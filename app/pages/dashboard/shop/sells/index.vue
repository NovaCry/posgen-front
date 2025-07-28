<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import DataTable from '@/components/datatable/DataTable.vue';
import PaginationSimplified from '@/components/pagination/PaginationSimplified.vue';
import { toLocaleDate } from '@/lib/toLocaleDate';
import type { Cell, TableData } from '@/types/DataTable';
import { Receipt, Filter, Eye } from 'lucide-vue-next';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Section from '@/components/layout/Section.vue';
import createProtectedApiInterface from '@/api/protected';
import { useSelectedShopStore } from '@/store/shop';

definePageMeta({
  name: 'Satışlar',
});

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
  items: OrderItem[];
}

const protectedApiInterface = createProtectedApiInterface();
const selectedShop = useSelectedShopStore();
const showOnlyToday = ref(true);
const isLoading = ref(false);
const orders = ref<Order[]>([]);
const products = ref<Product[]>([]);
const tables = ref<Table[]>([]);
const data = ref<TableData[]>([]);
const autoRefreshInterval = ref<ReturnType<typeof setInterval> | null>(null);

const getProductName = (productId: string): string => {
  const product = products.value.find((p: Product) => p.id === productId);
  return product?.name || `Ürün ${productId.slice(-4)}`;
};

const getTableName = (tableId: string): string => {
  const table = tables.value.find((t: Table) => t.id === tableId);
  return table?.name || `Masa ${tableId.slice(-4)}`;
};

const formatTime = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleTimeString('tr-TR', {
    hour: '2-digit',
    minute: '2-digit',
  });
};

const getActionsMenu = (order: Order): Cell => {
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
              console.log('Detayları Görüntüle', order.id);
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
};

const populateTableData = () => {
  const completedOrders = orders.value.filter(
    (order: Order) => order.status === 'COMPLETED'
  );

  let filteredOrders = completedOrders;
  if (showOnlyToday.value) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    filteredOrders = completedOrders.filter(
      (order: Order) => new Date(order.createdAt) >= today
    );
  }

  data.value = filteredOrders.map((order: Order) => {
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

    return {
      'Sipariş No': [
        {
          type: 'text',
          data: `#${order.id.slice(-6)}`,
        },
      ],
      Masa: [
        {
          type: 'text',
          data: getTableName(order.tableId),
        },
      ],
      Tarih: [
        {
          type: 'text',
          data: toLocaleDate(new Date(order.createdAt)),
        },
      ],
      Saat: [
        {
          type: 'text',
          data: formatTime(order.createdAt),
        },
      ],
      Ürünler: [
        {
          type: 'text',
          data: itemsText,
        },
      ],
      Tutar: [
        {
          type: 'text',
          data: `${parseFloat(
            order.finalAmount?.toString() || '0'
          ).toLocaleString()} ₺`,
        },
      ],
      Durum: [
        {
          type: 'badge',
          background: '#dcfce7',
          color: '#166534',
          data: 'Tamamlandı',
        },
      ],
      İşlemler: [getActionsMenu(order)],
    };
  });
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
      populateTableData();
    }
  } catch (error) {
    console.error('Veriler yüklenirken hata:', error);
  } finally {
    isLoading.value = false;
  }
};

const toggleFilter = (): void => {
  showOnlyToday.value = !showOnlyToday.value;
  populateTableData();
};

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
</script>

<template>
  <Section>
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-3xl font-semibold">Satışlar</h1>

      <div class="flex items-center gap-3">
        <Button
          variant="outline"
          size="sm"
          class="flex items-center gap-2"
          @click="toggleFilter"
        >
          <Filter class="size-4" />
          {{ showOnlyToday ? 'Bugün' : 'Tümü' }}
        </Button>
      </div>
    </div>

    <div v-if="showOnlyToday" class="mb-4">
      <Badge
        variant="secondary"
        class="bg-blue-50 text-blue-700 border-blue-200"
      >
        <div class="w-2 h-2 bg-blue-500 rounded-full mr-2" />
        Sadece bugünkü satışlar gösteriliyor
      </Badge>
    </div>

    <div v-if="isLoading && data.length === 0" class="text-center py-12">
      <div
        class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"
      />
      <p class="text-muted-foreground">Satışlar yükleniyor...</p>
    </div>

    <div v-else-if="data.length === 0" class="text-center py-12">
      <Receipt class="size-12 mx-auto mb-4 text-muted-foreground opacity-50" />
      <h3 class="text-lg font-semibold mb-2">
        {{
          showOnlyToday ? 'Bugün satış bulunmuyor' : 'Henüz satış bulunmuyor'
        }}
      </h3>
      <p class="text-muted-foreground">
        {{
          showOnlyToday
            ? 'Bugün henüz hiç satış yapılmamış.'
            : 'Henüz hiç satış tamamlanmamış.'
        }}
      </p>
    </div>

    <template v-else>
      <DataTable :data="data" class="mt-6" />
      <PaginationSimplified
        class="my-4 w-full flex justify-center"
        :model-value="1"
        :total-items="data.length"
      />
    </template>
  </Section>
</template>
