<script setup lang="ts">
import type { CartCategory, CartItem } from '@/components/cafe';
import SideCafeProduct from '@/components/cafe/SideCafeProduct.vue';
import SideCollapsible from '@/components/cafe/SideCollapsible.vue';
import Catalog from '@/components/layout/Catalog.vue';
import PaymentSplitter from '@/components/cafe/PaymentSplitter.vue';
import PaymentMethodSelector from '@/components/cafe/PaymentMethodSelector.vue';
import PriceSummary from '@/components/cafe/PriceSummary.vue';
import MobileOrderView from '@/components/cafe/MobileOrderView.vue';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { UtensilsCrossed, CreditCard, Banknote, Split } from 'lucide-vue-next';
import { ref, computed, onMounted, nextTick } from 'vue';
import { useSelectedShopStore } from '@/store/shop';
import createProtectedApiInterface from '@/api/protected';
import type { Product } from '@/types/api/Product';

useSeo({
  title: 'Sipariş Sayfası',
  description: 'Sipariş sayfası',
});

const selectedShop = useSelectedShopStore();
const protectedApiInterface = createProtectedApiInterface();

const productList = ref<CartCategory[]>([]);
const showMobileOrders = ref(false);
const paymentMethod = ref<'cash' | 'card'>('cash');
const isLoading = ref(false);

const splitPayment = ref(false);
const numberOfPeople = ref(1);
const splitPaymentMethods = ref<Array<'cash' | 'card'>>(['cash']);
const customSplitAmounts = ref<number[]>([]);
const splitMode = ref<'equal' | 'custom'>('equal');

const currentOrder = ref<{
  id?: string;
  status?: string;
  paymentStatus?: string;
} | null>(null);

const selectedItemsList = computed(() => {
  const res: CartItem[] = [];
  for (const cat of productList.value) {
    for (const itm of cat.items) {
      if (itm.state.selected) res.push(itm);
    }
  }
  return res;
});

const totalPrice = computed(() =>
  selectedItemsList.value.reduce(
    (sum, item) =>
      sum + (Number(item.price) || 0) * (Number(item.state.quantity) || 1),
    0
  )
);

const taxAmount = computed(
  () => Math.round(totalPrice.value * (0.2 / 1.2) * 100) / 100
);
const finalPrice = computed(() => totalPrice.value);

const splitAmounts = computed(() => {
  if (!splitPayment.value || numberOfPeople.value < 1) return [];
  if (splitMode.value === 'equal') {
    const equalAmount =
      Math.round((finalPrice.value / numberOfPeople.value) * 100) / 100;
    const amounts = Array(numberOfPeople.value).fill(equalAmount);
    const totalSplit = amounts.reduce((sum, a) => sum + a, 0);
    const diff = Math.round((finalPrice.value - totalSplit) * 100) / 100;
    if (diff !== 0) amounts[amounts.length - 1] += diff;
    return amounts;
  } else {
    return customSplitAmounts.value
      .slice(0, numberOfPeople.value)
      .map((v) => Number(v) || 0);
  }
});

const totalSplitAmount = computed(() =>
  splitAmounts.value.reduce((sum, a) => sum + a, 0)
);
const splitDifference = computed(
  () => Math.round((finalPrice.value - totalSplitAmount.value) * 100) / 100
);

async function fetchProducts() {
  try {
    const res = await protectedApiInterface({
      url: `shop/products/${selectedShop.id}/list?maxItems=9999`,
      method: 'GET',
    }).catch(() => null);

    if (!res) return;

    const categories = new Map<string, CartCategory>();

    res.data.data.forEach((product: Product) => {
      const categoryId = product.categoryId || 'uncategorized';
      const categoryName = product.category?.name || 'Diğer';
      if (!categories.has(categoryId)) {
        categories.set(categoryId, {
          id: categoryId,
          title: categoryName,
          items: [],
        });
      }
    });

    res.data.data.forEach((product: Product) => {
      const categoryId = product.categoryId || 'uncategorized';
      const category = categories.get(categoryId);
      if (!category) return;

      // Stok kontrolü - stoksuz ürünler için her zaman stok var kabul edilir
      const totalStock =
        product.stocks?.reduce((sum, stock) => {
          const quantity = Number(stock.quantity) || 0;
          return sum + quantity;
        }, 0) || 0;

      // Eğer stok yoksa ama ürün stoksuz olarak işaretlenmişse veya stok alanı yoksa, stok var kabul et
      const hasStock =
        totalStock > 0 ||
        product.isLimitless === true ||
        (product.stocks && product.stocks.length === 0);

      category.items.push({
        title: product.name,
        price: Number(product.price) || 0,
        image: '',
        maxQuantity: hasStock ? (totalStock > 0 ? totalStock : 999) : 0,
        productId: product.id,
        state: { quantity: 1, selected: false },
        hasStock: hasStock,
      } as CartItem);
    });

    productList.value = Array.from(categories.values()).sort((a, b) =>
      a.title.localeCompare(b.title)
    );
    await nextTick();
  } catch (e) {
    console.error(e);
  }
}

async function completeOrder() {
  if (selectedItemsList.value.length === 0 || isLoading.value) return;

  try {
    isLoading.value = true;

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
  } catch (e) {
    console.error('Sipariş tamamlama hatası:', e);
  } finally {
    isLoading.value = false;
  }
}

async function handleItemDelete() {}

onMounted(async () => {
  selectedShop.load();
  await fetchProducts();
});
</script>

<template>
  <div>
    <div
      class="grid grid-cols-1 lg:grid-cols-3 h-screen max-h-[calc(100vh-3rem)] overflow-hidden"
    >
      <ScrollArea
        class="col-span-1 lg:col-span-2 border-r-0 lg:border-r h-full max-h-[calc(100vh-3rem)]"
      >
        <Catalog v-model="productList" class="relative" />
      </ScrollArea>

      <div class="hidden lg:block relative max-h-[calc(100vh-3rem)] h-full">
        <ScrollArea class="h-[calc(100%-4rem)]">
          <SideCollapsible title="Siparişler">
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
                :key="`self-${item.title}`"
                v-model:quantity="item.state.quantity"
                v-model:selected="item.state.selected"
                :name="item.title"
                :price="item.price"
                :max-quantity="item.maxQuantity"
                @delete="handleItemDelete"
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
              selectedItemsList.length === 0 ||
              isLoading ||
              (splitPayment && Math.abs(splitDifference) > 0.01)
            "
            @click="completeOrder"
          >
            <span v-if="isLoading">İşleniyor...</span>
            <span v-else-if="splitPayment"
              >{{ numberOfPeople }} Kişi Ödeme</span
            >
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
        :selected-table="null"
        :has-active-order="false"
        :is-loading="isLoading"
        :selected-items-list="selectedItemsList"
        :table-id="'self'"
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
        @update:split-payment="splitPayment = $event"
        @update:number-of-people="numberOfPeople = $event"
        @update:split-mode="splitMode = $event"
        @update:custom-split-amounts="customSplitAmounts = $event"
        @update:split-payment-methods="splitPaymentMethods = $event"
        @update:payment-method="paymentMethod = $event"
        @complete-order="completeOrder"
      />
    </div>
  </div>
</template>
