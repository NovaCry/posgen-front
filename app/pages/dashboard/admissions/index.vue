<script setup lang="ts">
import createProtectedApiInterface from '@/api/protected';
import { toLocaleDate } from '@/lib/toLocaleDate';
import { useSelectedShopStore } from '@/store/shop';
import Section from '@/components/layout/Section.vue';

import { ref, onMounted, onUnmounted, computed, watch } from 'vue';
import { Button } from '@/components/ui/button';
import PaginationSimplified from '@/components/PaginationSimplified.vue';
import DataTable from '@/components/DataTable.vue';
import { Input } from '@/components/ui/input';
import type { Cell } from '@/types/DataTable';
import { ListFilter, Eye, Receipt } from 'lucide-vue-next';
import AdmissionsHeader from '@/components/admissions/AdmissionsHeader.vue';
import AdmissionsStats from '@/components/admissions/AdmissionsStats.vue';
import AdmissionDetails from '@/components/admissions/AdmissionDetails.vue';
import SeoMeta from '@/components/seo/SeoMeta.vue';
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
  tableId: string | null;
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
const currentPage = ref(1);
const itemsPerPage = 10;
const totalCount = ref(0);
const totalPages = ref(0);
const search = ref('');

const statusTranslations: Record<string, string> = {
  OPEN: 'Bekliyor',
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
    ['OPEN', 'PREPARING', 'READY'].includes(order.status)
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

const getFilteredOrders = (): Order[] => {
  let filteredOrders = orders.value;

  if (filter.value === 'active') {
    filteredOrders = orders.value.filter((order: Order) =>
      ['PENDING', 'PREPARING', 'READY'].includes(order.status)
    );
  }

  if (search.value.trim()) {
    const searchTerm = search.value.toLowerCase().replace('#', '');
    filteredOrders = filteredOrders.filter((order) => {
      const productNames = order.items
        .map((item) => getProductName(item.productId))
        .join(' ')
        .toLowerCase();
      const tableName = getTableName(order.tableId, order.id).toLowerCase();
      const orderId = order.id.toLowerCase();

      return (
        productNames.includes(searchTerm) ||
        tableName.includes(searchTerm) ||
        orderId.includes(searchTerm) ||
        orderId.replace('#', '').includes(searchTerm)
      );
    });
  }

  return filteredOrders.sort(
    (a: Order, b: Order) =>
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
};

const _getCurrentPageOrders = (): Order[] => {
  const filteredOrders = getFilteredOrders();
  const startIndex = (currentPage.value - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  return filteredOrders.slice(startIndex, endIndex);
};

const getTableData = (): Record<string, string | Cell[]>[] => {
  const filteredOrders = getFilteredOrders();
  const tableData: Record<string, string | Cell[]>[] = [];

  for (const order of filteredOrders) {
    makeResourceColumn(tableData, order);
  }

  return tableData;
};

function makeActionsForAdmission(order: Order): Cell {
  return {
    type: 'menu',
    data: [
      {
        type: 'group',
        title: 'İşlemler',
        items: [
          {
            type: 'item',
            text: 'Detayları Görüntüle',
            icon: Eye,
            action() {
              viewOrderDetails(order.id);
            },
          },
          {
            type: 'item',
            text: 'Yazdır',
            icon: Receipt,
            action() {
              console.log('Yazdır', order.id);
            },
          },
        ],
      },
    ],
  };
}

function makeResourceColumn(tableData: Record<string, string | Cell[]>[], order: Order) {
  const itemsText =
    order.items
      ?.slice(0, 2)
      .map(
        (item: OrderItem) =>
          `${item.quantity}x ${getProductName(item.productId)}`
      )
      .join(', ') +
    (order.items && order.items.length > 2
      ? ` +${order.items.length - 2}`
      : '');

  tableData.push({
    'Adisyon No': [
      {
        type: 'text',
        data: formatOrderId(order.id),
      },
    ],
    'Masa/Adisyon': [
      {
        type: 'text',
        data: getTableName(order.tableId, order.id),
      },
    ],
    'Oluşturma Tarihi': [
      {
        type: 'text',
        data: toLocaleDate(new Date(order.createdAt)),
      },
    ],
    'Ürün Detayı': [
      {
        type: 'text',
        data: itemsText,
      },
    ],
    'Toplam Tutar': [
      {
        type: 'text',
        data: `${formatPrice(order.finalAmount)} ₺`,
      },
    ],
    Durum: [
      {
        type: 'badge',
        background: '#5456c0',
        color: 'white',
        data: getStatusTranslation(order.status),
      },
    ],

    İşlemler: [makeActionsForAdmission(order)],
  });
}

const updatePagination = () => {
  const filteredLength = getFilteredOrders().length;
  totalCount.value = filteredLength;
  totalPages.value = Math.ceil(filteredLength / itemsPerPage);
  if (currentPage.value > totalPages.value && totalPages.value > 0) {
    currentPage.value = totalPages.value;
  }
};

const getProductName = (productId: string): string => {
  const product = products.value.find((p: Product) => p.id === productId);
  return product?.name || `Ürün ${productId.slice(-4)}`;
};

const formatOrderId = (orderId: string): string => {
  return `#${String(orderId).slice(-6).toUpperCase()}PSGNTR`;
};

const getTableName = (tableId: string | null, orderId?: string): string => {
  if (!tableId)
    return `Paket Sipariş${orderId ? ` | ${formatOrderId(orderId)}` : ''}`;
  const table = tables.value.find((t: Table) => t.id === tableId);
  const tableName = table?.name || `${tableId}`;
  return orderId ? `${tableName} | ${formatOrderId(orderId)}` : tableName;
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

    const baseOrders = (ordersResponse?.data?.data || []) as Order[];

    orders.value = baseOrders.sort(
      (a: Order, b: Order) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
    updatePagination();
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

const _handlePageChange = (page: number) => {
  currentPage.value = page;
};

const _getActionsMenu = (order: Order): Cell => {
  return {
    type: 'menu',
    data: [
      {
        type: 'group',
        title: 'İşlemler',
        items: [
          {
            type: 'item',
            text: 'Detayları Görüntüle',
            icon: Eye,
            action() {
              viewOrderDetails(order.id);
            },
          },
        ],
      },
    ],
  };
};

const autoRefreshInterval = ref<ReturnType<typeof setInterval> | null>(null);

watch(filter, () => {
  currentPage.value = 1;
  updatePagination();
});

watch(search, () => {
  currentPage.value = 1;
});

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
  <SeoMeta title="Adisyonlar" description="Adisyonlar" />
  <Section>
    <AdmissionsHeader v-model:filter="filter" />
    <AdmissionsStats :stats="stats" />

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

    <template v-else>
      <div class="flex items-center my-4">
        <div class="flex items-center mr-auto gap-4">
          <Input v-model="search" placeholder="Adisyonlarda Arama Yap..." />
          <Button disabled variant="outline">
            <ListFilter />
            Sırala
          </Button>
        </div>
      </div>

      <div
        v-if="getFilteredOrders().length === 0"
        class="text-center py-12 animate-in fade-in duration-500"
      >
        <Receipt
          class="size-12 mx-auto mb-4 text-muted-foreground opacity-50 animate-bounce"
        />
        <h3 class="text-lg font-semibold mb-2">
          {{
            search.trim()
              ? 'Arama sonucu bulunamadı'
              : filter === 'active'
                ? 'Aktif adisyon bulunmuyor'
                : 'Henüz adisyon bulunmuyor'
          }}
        </h3>
        <p class="text-muted-foreground">
          {{
            search.trim()
              ? `"${search}" için sonuç bulunamadı. Farklı kelimeler deneyin.`
              : filter === 'active'
                ? 'Şu anda aktif olan bir adisyon yok.'
                : 'Henüz hiç sipariş oluşturulmamış.'
          }}
        </p>
      </div>

      <template v-else>
        <DataTable
          :data="
            getTableData().slice(
              (currentPage - 1) * itemsPerPage,
              currentPage * itemsPerPage
            )
          "
        />

        <PaginationSimplified
          v-model="currentPage"
          class="my-4 w-full flex justify-center"
          :items-per-page="itemsPerPage"
          :total-items="getFilteredOrders().length"
        />
      </template>
    </template>

    <AdmissionDetails
      :is-dialog-open="isDialogOpen"
      :selected-order="selectedOrder"
      @update:is-dialog-open="isDialogOpen = $event"
    />
  </Section>
</template>
