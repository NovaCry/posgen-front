<script setup lang="ts">
import createProtectedApiInterface from '@/api/protected';
import { toLocaleDate } from '@/lib/toLocaleDate';
import { useSelectedShopStore } from '@/store/shop';
import { Filter, Receipt, ChevronRight } from 'lucide-vue-next';
import Section from '@/components/layout/Section.vue';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { ref, onMounted, onUnmounted, computed } from 'vue';
import AdmissionWidget from '@/components/card/AdmissionWidget.vue';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';

interface Product {
  id: string;
  name: string;
  price: number;
}

interface Table {
  id: string;
  name: string;
}

interface OrderItem {
  productId: string;
  quantity: number;
  price: number;
}

interface Order {
  id: string;
  tableId: string;
  status: string;
  createdAt: string;
  finalAmount: number;
  totalAmount: number;
  taxAmount: number;
  items: OrderItem[];
}

const protectedApiInterface = createProtectedApiInterface();
const selectedShop = useSelectedShopStore();
const filter = ref<'all' | 'active'>('all');
const isLoading = ref(false);
const orders = ref<Order[]>([]);
const products = ref<Product[]>([]);
const tables = ref<Table[]>([]);
const isDialogOpen = ref(false);
const selectedOrder = ref<Order | null>(null);

const statusTranslations: Record<string, string> = {
  PENDING: 'Bekliyor',
  PREPARING: 'Hazırlanıyor',
  READY: 'Hazır',
  COMPLETED: 'Tamamlandı',
  CANCELLED: 'İptal Edildi',
};

const formatPrice = (price: number | string): string => {
  return Math.round(parseFloat(price?.toString() || '0')).toLocaleString();
};

const stats = computed(() => {
  const activeOrders = orders.value.filter((order: Order) =>
    ['PENDING', 'PREPARING', 'READY'].includes(order.status)
  );
  const completedOrders = orders.value.filter(
    (order: Order) => order.status === 'COMPLETED'
  );

  const totalRevenue = completedOrders.reduce((sum, order: Order) => {
    return sum + parseFloat(order.finalAmount?.toString() || '0');
  }, 0);

  const totalTax = completedOrders.reduce((sum, order: Order) => {
    return sum + parseFloat(order.taxAmount?.toString() || '0');
  }, 0);

  const netRevenue = completedOrders.reduce((sum, order: Order) => {
    return sum + parseFloat(order.totalAmount?.toString() || '0');
  }, 0);

  const activeRevenue = activeOrders.reduce((sum, order: Order) => {
    return sum + parseFloat(order.finalAmount?.toString() || '0');
  }, 0);

  const activeTax = activeOrders.reduce((sum, order: Order) => {
    return sum + parseFloat(order.taxAmount?.toString() || '0');
  }, 0);

  return {
    total: orders.value.length,
    active: activeOrders.length,
    completed: completedOrders.length,
    totalRevenue: Math.round(totalRevenue),
    totalTax: Math.round(totalTax),
    netRevenue: Math.round(netRevenue),
    activeRevenue: Math.round(activeRevenue),
    activeTax: Math.round(activeTax),
    averageAmount:
      completedOrders.length > 0
        ? Math.round(totalRevenue / completedOrders.length)
        : 0,
  };
});

const filteredOrders = computed(() => {
  if (filter.value === 'active') {
    return orders.value.filter((order: Order) =>
      ['PENDING', 'PREPARING', 'READY'].includes(order.status)
    );
  }
  return orders.value;
});

const getProductName = (productId: string): string => {
  const product = products.value.find((p: Product) => p.id === productId);
  return product?.name || `Ürün ${productId.slice(-4)}`;
};

const getTableName = (tableId: string): string => {
  const table = tables.value.find((t: Table) => t.id === tableId);
  return table?.name || `Masa ${tableId.slice(-4)}`;
};

const fetchOrders = async (): Promise<void> => {
  try {
    isLoading.value = true;

    const productsResponse = await protectedApiInterface({
      url: `shop/products/${selectedShop.id}/list`,
      method: 'GET',
    });
    if (productsResponse?.data?.data) {
      products.value = productsResponse.data.data as Product[];
    }

    const tablesResponse = await protectedApiInterface({
      url: `shop/tables/${selectedShop.id}/list`,
      method: 'GET',
    });
    if (tablesResponse?.data?.data) {
      tables.value = tablesResponse.data.data as Table[];
    }

    const ordersResponse = await protectedApiInterface({
      url: `shop/orders/${selectedShop.id}/orders`,
      method: 'GET',
    });
    if (ordersResponse?.data?.data) {
      orders.value = ordersResponse.data.data as Order[];
    }
  } catch (error) {
    console.error('Veriler yüklenirken hata:', error);
  } finally {
    isLoading.value = false;
  }
};

const getStatusTranslation = (status: string): string => {
  return statusTranslations[status] || status;
};

const viewOrderDetails = (orderId: string) => {
  const order = orders.value.find((o) => o.id === orderId);
  if (order) {
    selectedOrder.value = order;
    isDialogOpen.value = true;
  }
};

const autoRefreshInterval = ref<ReturnType<typeof setInterval> | null>(null);

onMounted(() => {
  fetchOrders();
  autoRefreshInterval.value = setInterval(() => {
    fetchOrders();
  }, 7000);
});

onUnmounted(() => {
  if (autoRefreshInterval.value) {
    clearInterval(autoRefreshInterval.value);
    autoRefreshInterval.value = null;
  }
});

definePageMeta({
  name: 'Adisyonlar',
});
</script>

<template>
  <Section>
    <div
      class="flex items-center justify-between mb-6 animate-in fade-in duration-500"
    >
      <div>
        <h1 class="text-2xl md:text-3xl font-semibold">Adisyonlar</h1>
        <p class="text-muted-foreground mt-1">
          Masa siparişlerini adisyon olarak görüntüleyin ve yönetin
        </p>
      </div>

      <div>
        <Select v-model="filter" default-value="all">
          <SelectTrigger>
            <SelectValue as-child>
              <Filter />
              Filtreler
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all"> Tümü </SelectItem>
            <SelectItem value="active"> Sadece Aktif </SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>

    <div class="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
      <AdmissionWidget
        :icon="Receipt"
        name="Aktif Adisyon"
        :value="stats.active.toLocaleString()"
        value-subfix="Adet"
        state="normal"
      />
      <AdmissionWidget
        :icon="Receipt"
        name="Net Gelir"
        :value="stats.netRevenue.toLocaleString()"
        value-subfix="₺"
        state="success"
      />
      <AdmissionWidget
        :icon="Receipt"
        name="Vergi Toplamı"
        :value="stats.totalTax.toLocaleString()"
        value-subfix="₺"
        state="danger"
      />
      <AdmissionWidget
        :icon="Receipt"
        name="Toplam Ciro"
        :value="stats.totalRevenue.toLocaleString()"
        value-subfix="₺"
        state="normal"
      />
    </div>

    <div
      v-if="isLoading && orders.length === 0"
      class="text-center py-12 animate-in fade-in duration-500"
    >
      <div
        class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"
      />
      <p class="text-muted-foreground animate-pulse">
        Adisyonlar yükleniyor...
      </p>
    </div>

    <div
      v-else-if="filteredOrders.length === 0"
      class="text-center py-12 animate-in fade-in duration-500"
    >
      <Receipt
        class="size-12 mx-auto mb-4 text-muted-foreground opacity-50 animate-bounce"
      />
      <h3 class="text-lg font-semibold mb-2">
        {{
          filter === 'active'
            ? 'Aktif adisyon bulunmuyor'
            : 'Henüz adisyon bulunmuyor'
        }}
      </h3>
      <p class="text-muted-foreground">
        {{
          filter === 'active'
            ? 'Şu anda aktif olan bir adisyon yok.'
            : 'Henüz hiç sipariş oluşturulmamış.'
        }}
      </p>
    </div>

    <div v-else class="grid gap-4">
      <Card
        v-for="(order, index) in filteredOrders"
        :key="order.id"
        class="transition-all duration-300 hover:shadow-lg hover:scale-[1.02] hover:-translate-y-1 animate-in slide-in-from-bottom-4 duration-500"
        :style="`animation-delay: ${index * 50}ms`"
      >
        <CardContent class="p-6">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-4">
              <div
                class="p-3 bg-primary/10 rounded-lg transition-all duration-300 hover:bg-primary/20 hover:scale-110"
              >
                <Receipt
                  class="size-6 text-primary transition-transform duration-300 hover:rotate-12"
                />
              </div>

              <div>
                <div class="flex items-center gap-2 mb-1">
                  <h3
                    class="font-semibold transition-colors duration-300 hover:text-primary"
                  >
                    {{ getTableName(order.tableId) }}
                  </h3>
                  <Badge
                    :variant="
                      ['PENDING', 'PREPARING', 'READY'].includes(order.status)
                        ? 'default'
                        : 'secondary'
                    "
                    :class="
                      ['PENDING', 'PREPARING', 'READY'].includes(order.status)
                        ? 'bg-green-500 hover:bg-green-600'
                        : 'bg-gray-500'
                    "
                    class="transition-all duration-300 hover:scale-105"
                  >
                    {{ getStatusTranslation(order.status) }}
                  </Badge>
                </div>

                <div
                  class="flex items-center gap-4 text-sm text-muted-foreground mb-3"
                >
                  <span
                    class="transition-colors duration-300 hover:text-foreground"
                    >{{ toLocaleDate(new Date(order.createdAt)) }}</span
                  >
                  <span
                    class="font-semibold text-foreground transition-all duration-300 hover:text-green-600 hover:scale-105"
                  >
                    {{ formatPrice(order.finalAmount) }} ₺
                  </span>
                </div>

                <div class="flex items-center">
                  <Button
                    size="sm"
                    class="flex items-center gap-2 text-xs bg-white border border-gray-200 text-gray-700 hover:bg-white/80 hover:border-gray-300 hover:shadow-md hover:scale-[1.02] transform transition-all duration-300 ease-in-out"
                    @click="() => viewOrderDetails(order.id)"
                  >
                    Detay
                    <ChevronRight class="size-3" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>

    <Dialog v-model:open="isDialogOpen">
      <DialogContent class="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle class="flex items-center gap-2">
            <Receipt class="size-5" />
            Adisyon Detayları
          </DialogTitle>
          <DialogDescription>
            Seçili adisyonun detaylı bilgilerini görüntüleyin
          </DialogDescription>
        </DialogHeader>

        <div v-if="selectedOrder" class="space-y-6">
          <div class="grid grid-cols-2 gap-4">
            <div>
              <h4 class="font-semibold text-sm text-muted-foreground mb-1">
                Masa
              </h4>
              <p class="font-medium">
                {{ getTableName(selectedOrder.tableId) }}
              </p>
            </div>
            <div>
              <h4 class="font-semibold text-sm text-muted-foreground mb-1">
                Durum
              </h4>
              <Badge
                :variant="
                  ['PENDING', 'PREPARING', 'READY'].includes(
                    selectedOrder.status
                  )
                    ? 'default'
                    : 'secondary'
                "
                :class="
                  ['PENDING', 'PREPARING', 'READY'].includes(
                    selectedOrder.status
                  )
                    ? 'bg-green-500'
                    : 'bg-gray-500'
                "
              >
                {{ getStatusTranslation(selectedOrder.status) }}
              </Badge>
            </div>
            <div>
              <h4 class="font-semibold text-sm text-muted-foreground mb-1">
                Tarih
              </h4>
              <p class="text-sm">
                {{ toLocaleDate(new Date(selectedOrder.createdAt)) }}
              </p>
            </div>
            <div>
              <h4 class="font-semibold text-sm text-muted-foreground mb-1">
                Sipariş ID
              </h4>
              <p class="text-sm font-mono">
                {{ selectedOrder.id.slice(-8) }}
              </p>
            </div>
          </div>

          <Separator />

          <div>
            <h4 class="font-semibold mb-3">Sipariş İçeriği</h4>
            <div class="space-y-2">
              <div
                v-for="item in selectedOrder.items"
                :key="item.productId"
                class="flex justify-between items-center p-3 bg-muted/50 rounded-lg"
              >
                <div>
                  <p class="font-medium">
                    {{ getProductName(item.productId) }}
                  </p>
                  <p class="text-sm text-muted-foreground">
                    {{ item.quantity }} adet
                  </p>
                </div>
                <div class="text-right">
                  <p class="font-semibold">
                    {{
                      formatPrice(
                        parseFloat(item.price?.toString() || '0') *
                          item.quantity
                      )
                    }}
                    ₺
                  </p>
                </div>
              </div>
            </div>
          </div>

          <Separator />

          <div>
            <div class="rounded-lg p-6 text-white">
              <h4 class="font-semibold mb-4 text-lg">Fiyat Detayları</h4>
              <div class="space-y-3">
                <div class="flex justify-between items-center">
                  <span class="text-slate-300">Ara Toplam:</span>
                  <span class="font-medium text-lg"
                    >{{ formatPrice(selectedOrder.totalAmount) }} ₺</span
                  >
                </div>
                <div class="flex justify-between items-center">
                  <span class="text-slate-300">Vergi:</span>
                  <span class="font-medium text-lg"
                    >{{ formatPrice(selectedOrder.taxAmount) }} ₺</span
                  >
                </div>
                <div class="border-t border-slate-700 pt-3">
                  <div class="flex justify-between items-center">
                    <span class="font-semibold text-xl">Toplam:</span>
                    <span class="font-bold text-2xl text-green-400"
                      >{{ formatPrice(selectedOrder.finalAmount) }} ₺</span
                    >
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  </Section>
</template>
