<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue';
import Resource from '@/components/layout/Resource.vue';
import { toLocaleDate } from '@/lib/toLocaleDate';
import type { MenuCell, TableData } from '@/types/DataTable';
import { Receipt, Filter, Eye } from 'lucide-vue-next';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Section from '@/components/layout/Section.vue';
import createProtectedApiInterface from '@/api/protected';
import { useSelectedShopStore } from '@/store/shop';
import { Input } from '@/components/ui/input';
import { ListFilter } from 'lucide-vue-next';
import DataTable from '@/components/DataTable.vue';
import PaginationSimplified from '@/components/PaginationSimplified.vue';

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
  tableId: string | null;
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
const resourceVersion = ref(0);
const search = ref('');
const currentPage = ref(1);
const itemsPerPage = 10;

const getProductName = (productId: string): string => {
  const product = products.value.find((p: Product) => p.id === productId);
  return product?.name || `Ürün ${productId.slice()}`;
};

const getTableName = (tableId: string | null): string => {
  if (!tableId) return 'Self Servis';
  const table = tables.value.find((t: Table) => t.id === tableId);
  return table?.name || `${tableId.slice()}`;
};

const formatTime = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleTimeString('tr-TR', {
    hour: '2-digit',
    minute: '2-digit',
  });
};

const getActionsMenu = (order: Order): MenuCell => {
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

function makeResourceColumn(tableData: TableData[], order: Order) {
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
    'Sipariş No': [
      {
        type: 'text',
        data: `#${String(order.id).slice(-6).toUpperCase() + 'PSGNTR'}`,
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
        background: '#5456c0',
        color: 'white',
        data: 'Tamamlandı',
      },
    ],
    İşlemler: [getActionsMenu(order)],
  });
}

type Admission = {
  id: string;
  shopId: string;
  status: string;
  totalPrice: string;
  products: string[];
  tableId: string | null;
  createdAt: string;
};

function mapAdmissionsToOrders(admissions: Admission[], productList: Product[]): Order[] {
  return admissions.map((adm) => {
    const items: OrderItem[] = (adm.products || []).map((p) => {
      const [productId, qtyStr] = (p || '').split(':');
      const product = productList.find((pr) => pr.id === productId);
      const price = product ? Number(product.price) : 0;
      const quantity = Math.max(0, Number(qtyStr || '1'));
      return { productId, quantity, price } as OrderItem;
    });
    const finalAmount = Number(adm.totalPrice || '0');
    
    return {
      id: adm.id,
      tableId: adm.tableId ?? 'Paket Sipariş',
      status: adm.status === 'OPEN' ? 'COMPLETED' : adm.status,
      createdAt: adm.createdAt,
      finalAmount,
      items,
    } as Order;
  });
}

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

    const [ordersResponse, admissionsResponse] = await Promise.all([
      protectedApiInterface({
        url: `shop/orders/${selectedShop.id}/orders`,
        method: 'GET',
      }),
      protectedApiInterface({
        url: `shop/admissions/${selectedShop.id}/list?limit=250&page=0`,
        method: 'GET',
      }),
    ]);

    const baseOrders = (ordersResponse?.data?.data || []) as Order[];
    const admissions = (admissionsResponse?.data?.data || []) as Admission[];
    const mappedAdmissions = mapAdmissionsToOrders(admissions, products.value);
    
    const allOrders = [...baseOrders, ...mappedAdmissions];
    allOrders.sort((a: Order, b: Order) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
    
    orders.value = allOrders;
  } catch (error) {
    console.error('Veriler yüklenirken hata:', error);
  } finally {
    isLoading.value = false;
  }
};

const toggleFilter = (): void => {
  showOnlyToday.value = !showOnlyToday.value;
  resourceVersion.value += 1;
};

onMounted(() => {
  fetchOrders();
});


watch(search, () => {
  currentPage.value = 1;
});


watch(showOnlyToday, () => {
  currentPage.value = 1;
});

const getFilteredOrders = (): Order[] => {
  const completedOrders = orders.value.filter(
    (order: Order) => order.status === 'COMPLETED'
  );

  let filteredOrders = completedOrders;
  
  if (search.value.trim()) {
    const searchTerm = search.value.toLowerCase().replace('#', '');
    filteredOrders = filteredOrders.filter(order => {
      const productNames = order.items.map(item => getProductName(item.productId)).join(' ').toLowerCase();
      const tableName = getTableName(order.tableId).toLowerCase();
      const orderId = order.id.toLowerCase();
      
      return productNames.includes(searchTerm) || 
             tableName.includes(searchTerm) || 
             orderId.includes(searchTerm) ||
             orderId.replace('#', '').includes(searchTerm);
    });
  }
  
  if (showOnlyToday.value) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    filteredOrders = filteredOrders.filter(
      (order: Order) => new Date(order.createdAt) >= today
    );
  }

  return filteredOrders.sort((a: Order, b: Order) => 
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
};

const getTableData = (): TableData[] => {
  const filteredOrders = getFilteredOrders();
  const tableData: TableData[] = [];
  
  for (const order of filteredOrders) {
    makeResourceColumn(tableData, order);
  }
  
  return tableData;
};

const populateResourceData = (tableData: TableData[]) => {
  const filteredOrders = getFilteredOrders();
  for (const order of filteredOrders) {
    makeResourceColumn(tableData, order);
  }
};


const fetchSalesData = async (page: number, limit: number, search: string) => {
  try {
    const [ordersResponse, admissionsResponse] = await Promise.all([
      protectedApiInterface({
        url: `shop/orders/${selectedShop.id}/orders?page=${page}&limit=${limit}&search=${encodeURIComponent(search)}`,
        method: 'GET',
      }),
      protectedApiInterface({
        url: `shop/admissions/${selectedShop.id}/list?limit=${limit}&page=${page}&search=${encodeURIComponent(search)}`,
        method: 'GET',
      }),
    ]);

    const baseOrders = (ordersResponse?.data?.data || []) as Order[];
    const admissions = (admissionsResponse?.data?.data || []) as Admission[];
    const mappedAdmissions = mapAdmissionsToOrders(admissions, products.value);
    
    const allOrders = [...baseOrders, ...mappedAdmissions];
    const completedOrders = allOrders.filter(
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

    filteredOrders.sort((a: Order, b: Order) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    return {
      data: filteredOrders,
      meta: {
        page: page,
        maxItems: limit,
        totalCount: filteredOrders.length,
        totalPages: Math.ceil(filteredOrders.length / limit)
      }
    };
  } catch (error) {
    console.error('Veriler yüklenirken hata:', error);
    return {
      data: [],
      meta: {
        page: 0,
        maxItems: 0,
        totalCount: 0,
        totalPages: 0
      }
    };
  }
};
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

    <div v-if="isLoading && orders.length === 0" class="text-center py-12">
      <div
        class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"
      />
      <p class="text-muted-foreground">Satışlar yükleniyor...</p>
    </div>

    <template v-else>
      <div class="flex items-center my-4">
        <div class="flex items-center mr-auto gap-4">
          <Input v-model="search" placeholder="Satışlarda Arama Yap..." />
          <Button disabled variant="outline">
            <ListFilter />
            Sırala
          </Button>
        </div>
      </div>
      
      <div v-if="getFilteredOrders().length === 0" class="text-center py-12">
        <Receipt class="size-12 mx-auto mb-4 text-muted-foreground opacity-50" />
        <h3 class="text-lg font-semibold mb-2">
          {{
            search.trim() 
              ? 'Arama sonucu bulunamadı' 
              : showOnlyToday 
                ? 'Bugün satış bulunmuyor' 
                : 'Henüz satış bulunmuyor'
          }}
        </h3>
        <p class="text-muted-foreground">
          {{
            search.trim()
              ? `"${search}" için sonuç bulunamadı. Farklı kelimeler deneyin.`
              : showOnlyToday
                ? 'Bugün henüz hiç satış yapılmamış.'
                : 'Henüz hiç satış tamamlanmamış.'
          }}
        </p>
      </div>

      <template v-else>
        <DataTable :data="getTableData().slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)" />
        
        <PaginationSimplified
          v-model="currentPage"
          class="my-4 w-full flex justify-center"
          :items-per-page="itemsPerPage"
          :total-items="getFilteredOrders().length"
        />
      </template>
    </template>
  </Section>
</template>
