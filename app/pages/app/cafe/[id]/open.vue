<script setup lang="ts">
import type { CartCategory, CartItem } from '@/components/cafe';
import SideCafeProduct from '@/components/cafe/SideCafeProduct.vue';
import SideCollapsible from '@/components/cafe/SideCollapsible.vue';
import Catalog from '@/components/layout/Catalog.vue';
import ReservationCard from '@/components/ReservationCard.vue';
import TableInfo from '@/components/cafe/TableInfo.vue';
import PaymentSplitter from '@/components/cafe/PaymentSplitter.vue';
import PaymentMethodSelector from '@/components/cafe/PaymentMethodSelector.vue';
import PriceSummary from '@/components/cafe/PriceSummary.vue';
import MobileOrderView from '@/components/cafe/MobileOrderView.vue';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  AlertTriangle,
  UtensilsCrossed,
  CreditCard,
  Banknote,
  Split,
} from 'lucide-vue-next';
import { motion } from 'motion-v';
import { computed, ref, onMounted, nextTick } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import createProtectedApiInterface from '@/api/protected';
import { useSelectedShopStore } from '@/store/shop';
import  useErrorHandler from '@/composables/useErrorHandler';
import type Table from '@/types/api/Table';
import type { Product } from '@/types/api/Product';

const route = useRoute();
const router = useRouter();

const selectedShop = useSelectedShopStore();
const protectedApiInterface = createProtectedApiInterface();

const tables = ref<Table[]>([]);
const productList = ref<CartCategory[]>([]);
const showMobileOrders = ref(false);
const paymentMethod = ref<'cash' | 'card'>('cash');
const isLoading = ref(false);
const splitPayment = ref(false);
const numberOfPeople = ref(2);
const splitPaymentMethods = ref<Array<'cash' | 'card'>>(['cash', 'cash']);
const customSplitAmounts = ref<number[]>([]);
const splitMode = ref<'equal' | 'custom'>('equal');

type Reservation = {
  name: string;
  start: Date;
  end: Date;
  table: number;
};

const upcomingReservations = ref<Reservation[]>([]);
const currentOrder = ref<{
  id?: string;
  status?: string;
  paymentStatus?: string;
} | null>(null);
const autoSaveTimeout = ref<NodeJS.Timeout | null>(null);

const tableId = computed(() => {
  const params = route.params as { id?: string };
  return params.id || '';
});

const selectedTable = computed(() => {
  return tables.value.find((table) => table.id === tableId.value) || null;
});

const selectedItemsList = computed(() => {
  const res: CartItem[] = [];
  for (const cat of productList.value) {
    for (const itm of cat.items) {
      if (itm.state.selected) res.push(itm);
    }
  }
  return res;
});

const totalPrice = computed(() => {
  return selectedItemsList.value.reduce(
    (sum, item) => sum + item.price * item.state.quantity,
    0
  );
});

const taxAmount = computed(() => {
  return Math.round(totalPrice.value * (0.2 / 1.2) * 100) / 100;
});

const finalPrice = computed(() => {
  return totalPrice.value;
});

const splitAmounts = computed(() => {
  if (!splitPayment.value) return [];

  if (splitMode.value === 'equal') {
    const equalAmount =
      Math.round((finalPrice.value / numberOfPeople.value) * 100) / 100;
    const amounts = Array(numberOfPeople.value).fill(equalAmount);

    const totalSplit = amounts.reduce((sum, amount) => sum + amount, 0);
    const difference = Math.round((finalPrice.value - totalSplit) * 100) / 100;
    if (difference !== 0) {
      amounts[amounts.length - 1] += difference;
    }

    return amounts;
  } else {
    return customSplitAmounts.value.slice(0, numberOfPeople.value);
  }
});

const totalSplitAmount = computed(() => {
  return splitAmounts.value.reduce((sum, amount) => sum + amount, 0);
});

const splitDifference = computed(() => {
  return Math.round((finalPrice.value - totalSplitAmount.value) * 100) / 100;
});

const hasUpcomingReservation = computed(() => {
  if (!selectedTable.value) return false;
  return upcomingReservations.value.some(
    (reservation) => reservation.table.toString() === selectedTable.value?.id
  );
});

const nextReservation = computed(() => {
  if (!selectedTable.value) return null;
  return upcomingReservations.value.find(
    (reservation) => reservation.table.toString() === selectedTable.value?.id
  );
});

async function fetchTables() {
  try {
          const res = await protectedApiInterface({
        url: `shop/tables/${selectedShop.id}/list?page=0`,
        method: 'GET',
      }).catch(useErrorHandler);

    if (!res) return;

    tables.value = res.data.data;
  } catch (error) {
    console.error(error);
  }
}

async function fetchProducts() {
  try {
    const res = await protectedApiInterface({
      url: `shop/products/${selectedShop.id}/list?maxItems=9999`,
      method: 'GET',
    }).catch(useErrorHandler);

    if (!res) return;

    const categories = new Map<string, CartCategory>();

    // First, create all categories
    res.data.data.forEach((product: Product) => {
      const categoryId = product.categoryId || 'uncategorized';
      const categoryName = product.category?.name || 'Diğer';

      if (!categories.has(categoryId)) {
        categories.set(categoryId, {
          id: categoryId,
          title: categoryName,
          items: [],
        } as CartCategory);
      }
    });

    // Then, add products to their categories
    res.data.data.forEach((product: Product) => {
      const categoryId = product.categoryId || 'uncategorized';
      const category = categories.get(categoryId);

      // Stok kontrolü - stoksuz ürünler için her zaman stok var kabul edilir
      const totalStock = product.stocks?.reduce((sum, stock) => {
        const quantity = Number(stock.quantity) || 0;
        return sum + quantity;
      }, 0) || 0;
      
      // Eğer stok yoksa ama ürün stoksuz olarak işaretlenmişse veya stok alanı yoksa, stok var kabul et
      const hasStock = totalStock > 0 || (product.isLimitless === true) || (product.stocks && product.stocks.length === 0);
      const maxQuantity = hasStock ? (totalStock > 0 ? totalStock : 999) : 0;

      category?.items.push({
        title: product.name,
        price: parseFloat(product.price),
        image: '',
        maxQuantity: maxQuantity,
        productId: product.id,
        state: {
          quantity: 1,
          selected: false,
        },
        hasStock: hasStock,
      } as CartItem);
    });

    // Convert to array and sort categories by name
    productList.value = Array.from(categories.values()).sort((a, b) =>
      a.title.localeCompare(b.title)
    );

    await nextTick();
  } catch (error) {
    console.error(error);
  }
}

function changeTable() {
  router.push('/app/cafe');
}

async function completeOrder() {
  if (!tableId.value || selectedItemsList.value.length === 0 || isLoading.value)
    return;

  console.log('🚀 Sipariş tamamlanıyor...', {
    tableId: tableId.value,
    items: selectedItemsList.value,
    currentOrder: currentOrder.value
  });

  try {
    isLoading.value = true;

    // Eğer mevcut bir otomatik kaydedilmiş sipariş varsa, onu kullan
    if (currentOrder.value?.id) {
      // Mevcut siparişi güncelle ve tamamla
      const orderItems = selectedItemsList.value.map((item) => ({
        productId: item.productId,
        quantity: item.state.quantity,
        note: '',
      }));

      await protectedApiInterface({
        url: `shop/orders/${selectedShop.id}/orders/${currentOrder.value.id}`,
        method: 'PUT',
        data: {
          status: 'COMPLETED',
          paymentStatus: 'PAID',
          items: orderItems, // Stok güncellemesi için items gerekli
        },
      }).catch(useErrorHandler);
    } else {
      // Yeni sipariş oluştur
      const orderItems = selectedItemsList.value.map((item) => ({
        productId: item.productId,
        quantity: item.state.quantity,
        note: '',
      }));

      const orderData = {
        tableId: tableId.value,
        items: orderItems,
        paymentMethod: paymentMethod.value === 'cash' ? 'CASH' : 'CARD',
        note: '',
      };

      const response = await protectedApiInterface({
        url: `shop/orders/${selectedShop.id}/orders`,
        method: 'POST',
        data: orderData,
      }).catch(useErrorHandler);

      if (!response) return;

      currentOrder.value = {
        id: response.data.id,
        status: response.data.status,
        paymentStatus: response.data.paymentStatus,
      };

      // Yeni oluşturulan siparişi tamamla
      await protectedApiInterface({
        url: `shop/orders/${selectedShop.id}/orders/${currentOrder.value.id}`,
        method: 'PUT',
        data: {
          status: 'COMPLETED',
          paymentStatus: 'PAID',
        },
      }).catch(useErrorHandler);
    }

    // Siparişi temizle
    currentOrder.value = null;

    for (const cat of productList.value) {
      for (const item of cat.items) {
        item.state.selected = false;
        item.state.quantity = 1;
      }
    }

    // Sipariş sonrası ürün listesini yenile (stok güncellemesi için)
    await fetchProducts();

    splitPayment.value = false;
    showMobileOrders.value = false;
  } catch (error) {
    console.error(error);
  } finally {
    isLoading.value = false;
  }
}

// Otomatik kaydetme fonksiyonu
async function autoSaveOrder() {
  if (!tableId.value || selectedItemsList.value.length === 0) return;

  try {
    const orderItems = selectedItemsList.value.map((item) => ({
      productId: item.productId,
      quantity: item.state.quantity,
      note: '',
    }));

    const orderData = {
      tableId: tableId.value,
      items: orderItems,
      paymentMethod: 'CASH', // Varsayılan olarak nakit
    };

    // Eğer mevcut bir sipariş varsa, onu güncelle
    if (currentOrder.value?.id) {
      await protectedApiInterface({
        url: `shop/orders/${selectedShop.id}/orders/${currentOrder.value.id}`,
        method: 'PUT',
        data: {
          items: orderItems,
          paymentMethod: 'CASH',
        },
      });
    } else {
      // Yeni sipariş oluştur
      const response = await protectedApiInterface({
        url: `shop/orders/${selectedShop.id}/orders`,
        method: 'POST',
        data: orderData,
      });

      if (response?.data?.id) {
        currentOrder.value = {
          id: response.data.id,
          status: response.data.status,
          paymentStatus: response.data.paymentStatus,
        };
      }
    }
  } catch (error) {
    console.error('Otomatik kaydetme hatası:', error);
  }
}

// Debounced otomatik kaydetme
function scheduleAutoSave() {
  if (autoSaveTimeout.value) {
    clearTimeout(autoSaveTimeout.value);
  }
  
  autoSaveTimeout.value = setTimeout(() => {
    autoSaveOrder();
  }, 1000); // 1 saniye bekle
}

async function handleItemDelete() {}

// Mevcut siparişi kontrol et ve geri yükle
async function checkExistingOrder() {
  try {
    if (!tableId.value) return;

    const response = await protectedApiInterface({
      url: `shop/orders/${selectedShop.id}/orders/table/${tableId.value}`,
      method: 'GET',
    });

    if (response?.data?.order) {
      currentOrder.value = {
        id: response.data.order.id,
        status: response.data.order.status,
        paymentStatus: response.data.order.paymentStatus,
      };

      // Mevcut siparişi ürün listesine yükle
      if (response.data.order.items) {
        for (const orderItem of response.data.order.items) {
          for (const cat of productList.value) {
            for (const product of cat.items) {
              if (product.productId === orderItem.productId) {
                product.state.selected = true;
                product.state.quantity = orderItem.quantity;
                break;
              }
            }
          }
        }
      }


    }
  } catch (error) {
    console.error('Mevcut sipariş kontrol hatası:', error);
  }
}

onMounted(async () => {
  selectedShop.load();
  await fetchTables();
  await fetchProducts();
  await checkExistingOrder();
});
</script>

<template>
  <div
    class="grid grid-cols-1 lg:grid-cols-3 h-screen max-h-[calc(100vh-3rem)] overflow-hidden"
  >
    <ScrollArea
      class="col-span-1 lg:col-span-2 border-r-0 lg:border-r h-full max-h-[calc(100vh-3rem)]"
    >
      <motion.div
        v-if="hasUpcomingReservation"
        :initial="{ top: -100, opacity: 0 }"
        :animate="{ top: 0, opacity: 1 }"
        class="relative bg-yellow-100 dark:bg-yellow-950/30 w-full px-3 sm:px-6 py-3 sm:py-4 flex gap-3 sm:gap-4 items-center"
      >
        <AlertTriangle
          class="size-6 sm:size-7 shrink-0 text-yellow-600 dark:text-yellow-400"
        />
        <div class="flex flex-col min-w-0">
          <span class="text-sm sm:text-base font-medium"
            >Yaklaşan rezervasyon var!</span
          >
          <p class="text-xs sm:text-sm text-muted-foreground">
            Seçili masada yaklaşık 45 dakika sonra
            {{ nextReservation?.name }} adına bir rezervasyon var!
          </p>
        </div>
      </motion.div>

      <Catalog v-model="productList" class="relative" @product-update="scheduleAutoSave" />
    </ScrollArea>

    <div class="hidden lg:block relative max-h-[calc(100vh-3rem)] h-full">
      <ScrollArea class="h-[calc(100%-4rem)]">
        <SideCollapsible title="Masa Bilgisi">
          <div class="mt-4">
            <TableInfo
              :selected-table="selectedTable"
              :has-active-order="!!currentOrder?.id"
              :is-loading="isLoading"
              @change-table="changeTable"
            />
          </div>
        </SideCollapsible>

        <SideCollapsible
          v-if="hasUpcomingReservation && nextReservation"
          title="Yaklaşan Rezervasyonlar"
        >
          <div class="mt-4">
            <ReservationCard
              :name="nextReservation.name"
              :start="nextReservation.start"
              :end="nextReservation.end"
              :table="nextReservation.table"
            />
          </div>
        </SideCollapsible>

        <SideCollapsible title="Masa Siparişleri">
          <div class="mt-4 flex flex-col gap-3">
            <div
              v-if="selectedItemsList.length === 0"
              class="text-center py-6 text-muted-foreground"
            >
              <UtensilsCrossed class="size-8 mx-auto mb-2 opacity-50" />
              <p class="text-sm">Henüz sipariş alınmadı</p>
            </div>
                         <SideCafeProduct
               v-for="item of selectedItemsList"
               :key="`${tableId}-${item.title}`"
               v-model:quantity="item.state.quantity"
               v-model:selected="item.state.selected"
               :name="item.title"
               :price="item.price"
               :max-quantity="item.maxQuantity"
               @delete="handleItemDelete"
               @update:quantity="scheduleAutoSave"
               @update:selected="scheduleAutoSave"
             />
          </div>
        </SideCollapsible>

        <SideCollapsible title="Ödeme Yöntemi">
          <div class="mt-4">
            <PaymentSplitter
              v-model:split-payment="splitPayment"
              v-model:number-of-people="numberOfPeople"
              v-model:split-mode="splitMode"
              v-model:custom-split-amounts="customSplitAmounts"
              v-model:split-payment-methods="splitPaymentMethods"
              :final-price="finalPrice"
            />

            <div v-if="!splitPayment" class="mt-4">
              <PaymentMethodSelector v-model:payment-method="paymentMethod" />
            </div>
          </div>
        </SideCollapsible>

        <SideCollapsible title="Fiyat Özeti">
          <div class="mt-4">
            <PriceSummary
              :total-price="totalPrice"
              :tax-amount="taxAmount"
              :final-price="finalPrice"
              :split-payment="splitPayment"
              :split-amounts="splitAmounts"
              :split-payment-methods="splitPaymentMethods"
            />
          </div>
        </SideCollapsible>
      </ScrollArea>

      <div class="border-t h-16 px-4 flex items-center">
        <Button
          class="w-full"
          :disabled="
            !selectedTable ||
            selectedItemsList.length === 0 ||
            isLoading ||
            (splitPayment &&
              splitMode === 'custom' &&
              Math.abs(splitDifference) > 0.01)
          "
          @click="completeOrder"
        >
          <span v-if="isLoading">İşleniyor...</span>
          <span v-else-if="splitPayment">{{ numberOfPeople }} Kişi Ödeme</span>
          <span v-else>{{
            paymentMethod === 'cash' ? 'Nakit Tahsilat' : 'Kart ile Ödeme'
          }}</span>
          <component
            :is="
              splitPayment
                ? Split
                : paymentMethod === 'cash'
                  ? Banknote
                  : CreditCard
            "
            class="ml-2 h-4 w-4"
          />
        </Button>
      </div>
    </div>

    <div class="lg:hidden fixed bottom-4 right-4 z-50">
      <Button
        size="lg"
        class="rounded-full shadow-lg"
        @click="showMobileOrders = true"
      >
        <UtensilsCrossed class="h-4 w-4 mr-2" />
        <span class="text-sm">Sipariş ({{ selectedItemsList.length }})</span>
      </Button>
    </div>

    <MobileOrderView
      :show-mobile-orders="showMobileOrders"
      :selected-table="selectedTable"
      :has-active-order="!!currentOrder?.id"
      :is-loading="isLoading"
      :selected-items-list="selectedItemsList"
      :table-id="tableId"
      :split-payment="splitPayment"
      :number-of-people="numberOfPeople"
      :split-mode="splitMode"
      :custom-split-amounts="customSplitAmounts"
      :split-payment-methods="splitPaymentMethods"
      :payment-method="paymentMethod"
      :total-price="totalPrice"
      :tax-amount="taxAmount"
      :final-price="finalPrice"
      :split-difference="splitDifference"
      @update:show-mobile-orders="showMobileOrders = $event"
      @change-table="changeTable"
      @update:split-payment="splitPayment = $event"
      @update:number-of-people="numberOfPeople = $event"
      @update:split-mode="splitMode = $event"
      @update:custom-split-amounts="customSplitAmounts = $event"
      @update:split-payment-methods="splitPaymentMethods = $event"
      @update:payment-method="paymentMethod = $event"
      @complete-order="completeOrder"
      @item-update="scheduleAutoSave"
    >
      <template #mobile-order-items>
        <div class="mt-4 flex flex-col gap-3">
          <div
            v-if="selectedItemsList.length === 0"
            class="text-center py-6 text-muted-foreground"
          >
            <UtensilsCrossed class="size-8 mx-auto mb-2 opacity-50" />
            <p class="text-sm">Henüz sipariş alınmadı</p>
          </div>
                     <SideCafeProduct
             v-for="item of selectedItemsList"
             :key="`mobile-${tableId}-${item.title}`"
             v-model:quantity="item.state.quantity"
             v-model:selected="item.state.selected"
             :name="item.title"
             :price="item.price"
             :max-quantity="item.maxQuantity"
             @delete="handleItemDelete"
             @update:quantity="scheduleAutoSave"
             @update:selected="scheduleAutoSave"
           />
        </div>
      </template>
    </MobileOrderView>
  </div>
</template>
