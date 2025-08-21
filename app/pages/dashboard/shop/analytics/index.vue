<script setup lang="ts">
import Section from '@/components/layout/Section.vue';
import { AreaChart } from '@/components/ui/chart-area';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import {
  Box,
  ChartArea,
  ShoppingBasket,
  TrendingUp,
  DollarSign,
  Clock,
  Users,
} from 'lucide-vue-next';
import {
  ref,
  onMounted,
  onUnmounted,
  computed,
  shallowRef,
  markRaw,
  nextTick,
} from 'vue';
import type { FunctionalComponent, VNode } from 'vue';
import createProtectedApiInterface from '@/api/protected';
import { useSelectedShopStore } from '@/store/shop';

const selectedShop = useSelectedShopStore();
const protectedApiInterface = createProtectedApiInterface();

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
  table?: Table;
}

interface TableStats {
  tableId: string;
  tableName: string;
  todayTotal: number;
  todayActive: number;
  todayCompleted: number;
  todayPending: number;
  todayPreparing: number;
  todayReady: number;
  todayCancelled: number;
  todayRevenue: number;
  yesterdayTotal: number;
  yesterdayCompleted: number;
  yesterdayRevenue: number;
}

interface TableAnalyticsItem {
  name: string;
  alt: string;
  value: string;
  raw: number;
  details: {
    todayTotal: number;
    todayActive: number;
    todayCompleted: number;
    todayPending: number;
    todayPreparing: number;
    todayReady: number;
    todayCancelled: number;
    todayRevenue: number;
    yesterdayTotal: number;
    yesterdayCompleted: number;
    yesterdayRevenue: number;
    orderChange: number;
    revenueChange: number;
    completionRate: number;
  };
}

interface ProductCount {
  count: number;
  revenue: number;
  name: string;
}

interface WidgetRaw {
  size: number;
  icon: FunctionalComponent | VNode;
  title: string;
  alt?: string;
}

interface ChartWidget extends WidgetRaw {
  type: 'chart';
  style: 'area';
  data: Array<{ name: string; Gelir: number; Sipariş: number }>;
  categories: Array<'Gelir' | 'Sipariş'>;
}

interface NumeralWidget extends WidgetRaw {
  type: 'numeral';
  value: number;
  valueSubfix: string;
}

interface ItemList extends WidgetRaw {
  type: 'itemlist';
  items: Array<{ name: string; alt: string; value: string; raw: number }>;
}

interface SidebarHandler {
  __sidebarToggleHandler?: () => void;
}

type AnalyticsWidget = ChartWidget | NumeralWidget | ItemList;

// POLLYFILL

let averageTotal = 0;
let averagePredicted = 0;

function randMinMax(min: number, max: number) {
  return Math.random() * (max - min) + min;
}

function createFakeChartData() {
  const res: { name: string; Gelir: number; Sipariş: number }[] = [];
  for (let i = 0; i < 6; i++) {
    const predicted = +randMinMax(5000, 10000).toFixed(2);
    averagePredicted += predicted;
    const total = +randMinMax(60000, 120000).toFixed(2);
    averageTotal += total;
    res.push({
      name: new Date(2000, i, 1).toLocaleString('tr-TR', {
        month: 'long',
      }),
      Gelir: total,
      Sipariş: predicted,
    });
  }
  averagePredicted = +(averagePredicted / 12).toFixed(2);
  averageTotal = +(averageTotal / 12).toFixed(2);
  return res;
}

// POLLYFILL

const orderStats = ref({
  dailyOrders: 0,
  weeklyOrders: 0,
  monthlyOrders: 0,
  yearlyOrders: 0,
  totalRevenue: 0,
  averageOrderValue: 0,
  completionRate: 0,
  pendingOrders: 0,
  completedOrders: 0,
  preparingOrders: 0,
  readyOrders: 0,
  cancelledOrders: 0,
});

const chartData = shallowRef<
  Array<{ name: string; Gelir: number; Sipariş: number }>
>([]);
const topProducts = shallowRef<
  Array<{ name: string; alt: string; value: string; raw: number }>
>([]);
const recentOrders = shallowRef<
  Array<{ name: string; alt: string; value: string; raw: number }>
>([]);
const products = shallowRef<Product[]>([]);
const tables = shallowRef<Table[]>([]);
const tableAnalytics = shallowRef<TableAnalyticsItem[]>([]);
const isLoading = ref(false);
const orders = shallowRef<Order[]>([]);

const showChart = ref(true);
const chartKey = ref(0);
const isSidebarTransitioning = ref(false);
const cachedAnalytics = shallowRef<AnalyticsWidget[]>([]);

const fillFakeData = true;

const statusTranslations: Record<string, string> = {
  PENDING: 'Bekliyor',
  PREPARING: 'Hazırlanıyor',
  READY: 'Hazır',
  COMPLETED: 'Tamamlandı',
  CANCELLED: 'İptal Edildi',
};

const fetchProducts = async (): Promise<void> => {
  try {
    const response = await protectedApiInterface({
      url: `shop/products/${selectedShop.id}/list`,
      method: 'GET',
    });

    if (response?.data?.data) {
      products.value = response.data.data;
    }
  } catch (error) {
    console.error('Ürünler yüklenirken hata:', error);
  }
};

const fetchTables = async (): Promise<void> => {
  try {
    const response = await protectedApiInterface({
      url: `shop/tables/${selectedShop.id}/list`,
      method: 'GET',
    });

    if (response?.data?.data) {
      tables.value = response.data.data;
    }
  } catch (error) {
    console.error('Masalar yüklenirken hata:', error);
  }
};

const getProductName = (productId: string): string => {
  const product = products.value.find((p) => p.id === productId);
  return product?.name || `Ürün ${productId.slice(-4)}`;
};

const getTableName = (tableId: string): string => {
  const table = tables.value.find((t) => t.id === tableId);
  return table?.name || `Masa ${tableId.slice(-4)}`;
};

const calculateTableAnalytics = (ordersData: Order[]): TableAnalyticsItem[] => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const todayOrders = ordersData.filter((order: Order) => {
    const orderDate = new Date(order.createdAt);
    return orderDate >= today && orderDate < tomorrow;
  });

  const yesterdayOrders = ordersData.filter((order: Order) => {
    const orderDate = new Date(order.createdAt);
    return orderDate >= yesterday && orderDate < today;
  });

  const tableStats: Record<string, TableStats> = {};

  todayOrders.forEach((order: Order) => {
    const tableId = order.tableId;
    if (!tableStats[tableId]) {
      tableStats[tableId] = {
        tableId,
        tableName: getTableName(tableId),
        todayTotal: 0,
        todayActive: 0,
        todayCompleted: 0,
        todayPending: 0,
        todayPreparing: 0,
        todayReady: 0,
        todayCancelled: 0,
        todayRevenue: 0,
        yesterdayTotal: 0,
        yesterdayCompleted: 0,
        yesterdayRevenue: 0,
      };
    }

    tableStats[tableId].todayTotal++;
    tableStats[tableId].todayRevenue += parseFloat(
      order.finalAmount?.toString() || '0'
    );

    switch (order.status) {
      case 'PENDING':
        tableStats[tableId].todayPending++;
        tableStats[tableId].todayActive++;
        break;
      case 'PREPARING':
        tableStats[tableId].todayPreparing++;
        tableStats[tableId].todayActive++;
        break;
      case 'READY':
        tableStats[tableId].todayReady++;
        tableStats[tableId].todayActive++;
        break;
      case 'COMPLETED':
        tableStats[tableId].todayCompleted++;
        break;
      case 'CANCELLED':
        tableStats[tableId].todayCancelled++;
        break;
    }
  });

  yesterdayOrders.forEach((order: Order) => {
    const tableId = order.tableId;
    if (!tableStats[tableId]) {
      tableStats[tableId] = {
        tableId,
        tableName: getTableName(tableId),
        todayTotal: 0,
        todayActive: 0,
        todayCompleted: 0,
        todayPending: 0,
        todayPreparing: 0,
        todayReady: 0,
        todayCancelled: 0,
        todayRevenue: 0,
        yesterdayTotal: 0,
        yesterdayCompleted: 0,
        yesterdayRevenue: 0,
      };
    }

    tableStats[tableId].yesterdayTotal++;
    if (order.status === 'COMPLETED') {
      tableStats[tableId].yesterdayCompleted++;
      tableStats[tableId].yesterdayRevenue += parseFloat(
        order.finalAmount?.toString() || '0'
      );
    }
  });

  const tableAnalyticsData: TableAnalyticsItem[] = Object.values(tableStats)
    .map((table: TableStats) => {
      const orderChange =
        table.yesterdayTotal > 0
          ? Math.round(
              ((table.todayTotal - table.yesterdayTotal) /
                table.yesterdayTotal) *
                100
            )
          : table.todayTotal > 0
            ? 100
            : 0;

      const revenueChange =
        table.yesterdayRevenue > 0
          ? Math.round(
              ((table.todayRevenue - table.yesterdayRevenue) /
                table.yesterdayRevenue) *
                100
            )
          : table.todayRevenue > 0
            ? 100
            : 0;

      const completionRate =
        table.todayTotal > 0
          ? Math.round((table.todayCompleted / table.todayTotal) * 100)
          : 0;

      return {
        name: table.tableName,
        alt: `${table.todayActive} aktif, ${table.todayCompleted} tamamlandı`,
        value: `${table.todayTotal} Sipariş`,
        raw: table.todayTotal,
        details: {
          todayTotal: table.todayTotal,
          todayActive: table.todayActive,
          todayCompleted: table.todayCompleted,
          todayPending: table.todayPending,
          todayPreparing: table.todayPreparing,
          todayReady: table.todayReady,
          todayCancelled: table.todayCancelled,
          todayRevenue: table.todayRevenue,
          yesterdayTotal: table.yesterdayTotal,
          yesterdayCompleted: table.yesterdayCompleted,
          yesterdayRevenue: table.yesterdayRevenue,
          orderChange,
          revenueChange,
          completionRate,
        },
      };
    })
    .sort((a, b) => b.raw - a.raw);

  return tableAnalyticsData;
};

const fetchOrderStats = async (showLoader = false): Promise<void> => {
  try {
    if (showLoader) isLoading.value = true;

    await Promise.all([fetchProducts(), fetchTables()]);

    const response = await protectedApiInterface({
      url: `shop/orders/${selectedShop.id}/orders`,
      method: 'GET',
    });

    if (response?.data?.data) {
      orders.value = response.data.data;
      const ordersData: Order[] = response.data.data;

      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const dailyOrdersArr = ordersData.filter(
        (order: Order) => new Date(order.createdAt) >= today
      );
      const weeklyOrdersArr = ordersData.filter((order: Order) => {
        const orderDate = new Date(order.createdAt);
        const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
        return orderDate >= weekAgo;
      });
      const monthlyOrdersArr = ordersData.filter((order: Order) => {
        const orderDate = new Date(order.createdAt);
        const monthAgo = new Date(
          today.getFullYear(),
          today.getMonth() - 1,
          today.getDate()
        );
        return orderDate >= monthAgo;
      });
      const yearlyOrdersArr = ordersData.filter((order: Order) => {
        const orderDate = new Date(order.createdAt);
        const yearAgo = new Date(
          today.getFullYear() - 1,
          today.getMonth(),
          today.getDate()
        );
        return orderDate >= yearAgo;
      });

      const pendingOrders = ordersData.filter(
        (order: Order) => order.status === 'PENDING'
      );
      const preparingOrders = ordersData.filter(
        (order: Order) => order.status === 'PREPARING'
      );
      const readyOrders = ordersData.filter(
        (order: Order) => order.status === 'READY'
      );
      const completedOrders = ordersData.filter(
        (order: Order) => order.status === 'COMPLETED'
      );
      const cancelledOrders = ordersData.filter(
        (order: Order) => order.status === 'CANCELLED'
      );

      const totalRevenue = completedOrders.reduce((sum, order: Order) => {
        return sum + parseFloat(order.finalAmount?.toString() || '0');
      }, 0);

      orderStats.value = {
        dailyOrders: dailyOrdersArr.length,
        weeklyOrders: weeklyOrdersArr.length,
        monthlyOrders: monthlyOrdersArr.length,
        yearlyOrders: yearlyOrdersArr.length,
        totalRevenue: Math.round(totalRevenue * 100) / 100,
        averageOrderValue:
          completedOrders.length > 0
            ? Math.round((totalRevenue / completedOrders.length) * 100) / 100
            : 0,
        completionRate:
          ordersData.length > 0
            ? Math.round((completedOrders.length / ordersData.length) * 100)
            : 0,
        pendingOrders: pendingOrders.length,
        completedOrders: completedOrders.length,
        preparingOrders: preparingOrders.length,
        readyOrders: readyOrders.length,
        cancelledOrders: cancelledOrders.length,
      };

      tableAnalytics.value = calculateTableAnalytics(ordersData);

      const productCounts: Record<string, ProductCount> = {};
      ordersData.forEach((order: Order) => {
        if (order.items && Array.isArray(order.items)) {
          order.items.forEach((item: OrderItem) => {
            const productId = item.productId;
            if (!productCounts[productId]) {
              productCounts[productId] = {
                count: 0,
                revenue: 0,
                name: getProductName(productId),
              };
            }
            productCounts[productId].count += item.quantity;
            productCounts[productId].revenue +=
              parseFloat(item.price?.toString() || '0') * item.quantity;
          });
        }
      });

      topProducts.value = Object.values(productCounts)
        .sort((a: ProductCount, b: ProductCount) => b.count - a.count)
        .slice(0, 10)
        .map((product: ProductCount) => ({
          name: product.name,
          alt: `${product.revenue.toLocaleString()} ₺ gelir`,
          value: `${product.count} Satış`,
          raw: product.count,
        }));

      recentOrders.value = ordersData
        .sort(
          (a: Order, b: Order) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        )
        .slice(0, 8)
        .map((order: Order) => ({
          name: `Sipariş`,
          alt: `${order.table?.name || 'Bilinmeyen Masa'} - ${
            statusTranslations[order.status] || order.status
          }`,
          value: `${parseFloat(
            order.finalAmount?.toString() || '0'
          ).toLocaleString()} ₺`,
          raw: parseFloat(order.finalAmount?.toString() || '0'),
        }));

      const monthlyData: Array<{
        name: string;
        Gelir: number;
        Sipariş: number;
      }> = [];
      for (let i = 11; i >= 0; i--) {
        const date = new Date();
        date.setMonth(date.getMonth() - i);

        const monthStart = new Date(date.getFullYear(), date.getMonth(), 1);
        const monthEnd = new Date(date.getFullYear(), date.getMonth() + 1, 0);

        const monthOrders = ordersData.filter((order: Order) => {
          const orderDate = new Date(order.createdAt);
          return orderDate >= monthStart && orderDate <= monthEnd;
        });

        const monthRevenue = monthOrders
          .filter((order: Order) => order.status === 'COMPLETED')
          .reduce(
            (sum, order: Order) =>
              sum + parseFloat(order.finalAmount?.toString() || '0'),
            0
          );

        const monthOrderCount = monthOrders.length;

        monthlyData.push({
          name: date.toLocaleString('tr-TR', { month: 'long' }),
          Gelir: Math.round(monthRevenue * 100) / 100,
          Sipariş: monthOrderCount,
        });
      }

      chartData.value = monthlyData;

      setTimeout(() => {
        cachedAnalytics.value = analyticsComputed.value;
      }, 300);
    }
  } catch (error) {
    console.error('İstatistikler yüklenirken hata:', error);
  } finally {
    if (showLoader) {
      setTimeout(() => {
        isLoading.value = false;
      }, 500);
    }
  }
};

const setupSidebarListener = (): void => {
  const sidebarToggle = document.querySelector('[data-sidebar="trigger"]');
  if (sidebarToggle) {
    const handleSidebarToggle = (): void => {
      showChart.value = false;
      isSidebarTransitioning.value = true;

      setTimeout(() => {
        isSidebarTransitioning.value = false;
        chartKey.value++;
        nextTick(() => {
          showChart.value = true;
        });
      }, 350);
    };

    sidebarToggle.addEventListener('click', handleSidebarToggle);

    (window as SidebarHandler).__sidebarToggleHandler = handleSidebarToggle;
  }
};

const chartWidget = computed(
  (): ChartWidget => ({
    type: 'chart',
    size: 4,
    icon: markRaw(ChartArea),
    title: 'Aylık Gelir ve Sipariş Grafiği',
    alt: 'Son 12 Ay',
    style: 'area',
    data: fillFakeData ? createFakeChartData() : chartData.value,
    categories: ['Gelir', 'Sipariş'],
  })
);

const numeralWidgets = computed((): NumeralWidget[] => [
  {
    type: 'numeral',
    size: 1,
    icon: markRaw(ShoppingBasket),
    title: 'Bugünkü Siparişler',
    value: fillFakeData
      ? +randMinMax(100, 200).toFixed()
      : orderStats.value.dailyOrders || 0,
    valueSubfix: 'Sipariş',
  },
  {
    type: 'numeral',
    size: 1,
    icon: markRaw(ShoppingBasket),
    title: 'Haftalık Siparişler',
    // value: orderStats.value.weeklyOrders || 0,
    value: fillFakeData
      ? +randMinMax(400, 700).toFixed()
      : orderStats.value.weeklyOrders || 0,
    valueSubfix: 'Sipariş',
  },
  {
    type: 'numeral',
    size: 1,
    icon: markRaw(DollarSign),
    title: 'Aylık Gelir',
    // value: orderStats.value.totalRevenue || 0,
    value: fillFakeData
      ? randMinMax(60000, 400000)
      : orderStats.value.totalRevenue || 0,
    valueSubfix: '₺',
  },
  {
    type: 'numeral',
    size: 1,
    icon: markRaw(TrendingUp),
    title: 'Tamamlanma Oranı',
    // value: orderStats.value.completionRate || 0,
    value: fillFakeData
      ? +randMinMax(70, 100).toFixed(2)
      : orderStats.value.completionRate || 0,
    valueSubfix: '%',
  },
]);

const tableAnalyticsWidget = computed(
  (): ItemList => ({
    type: 'itemlist',
    size: 4,
    icon: markRaw(Users),
    title: 'Günlük Masa Kullanım Analizi',
    alt: 'Bugün vs Dün Karşılaştırması',
    items: tableAnalytics.value.map((table: TableAnalyticsItem) => ({
      name: table.name,
      alt: `Bugün: ${table.details.todayTotal} sipariş, Dün: ${
        table.details.yesterdayTotal
      } sipariş (${table.details.orderChange >= 0 ? '+' : ''}${
        table.details.orderChange
      }% değişim)`,
      value: `${table.details.todayActive} Aktif, ${table.details.todayCompleted} Tamamlandı`,
      raw: table.details.todayTotal,
    })),
  })
);

const topProductsWidget = computed(
  (): ItemList => ({
    type: 'itemlist',
    size: 2,
    icon: markRaw(Box),
    title: 'En Çok Satılan Ürünler',
    items: topProducts.value,
  })
);

const recentOrdersWidget = computed(
  (): ItemList => ({
    type: 'itemlist',
    size: 2,
    icon: markRaw(Clock),
    title: 'Son Siparişler',
    items: recentOrders.value,
  })
);

const orderStatusWidget = computed(
  (): ItemList => ({
    type: 'itemlist',
    size: 4,
    icon: markRaw(ShoppingBasket),
    title: 'Sipariş Durum Analizi',
    items: [
      {
        name: 'Bekleyen Siparişler',
        alt: `${statusTranslations['PENDING']} durumunda`,
        value: `${orderStats.value.pendingOrders || 0} Sipariş`,
        raw: orderStats.value.pendingOrders || 0,
      },
      {
        name: 'Hazırlanıyor',
        alt: `${statusTranslations['PREPARING']} durumunda`,
        value: `${orderStats.value.preparingOrders || 0} Sipariş`,
        raw: orderStats.value.preparingOrders || 0,
      },
      {
        name: 'Hazır Siparişler',
        alt: `${statusTranslations['READY']} durumunda`,
        value: `${orderStats.value.readyOrders || 0} Sipariş`,
        raw: orderStats.value.readyOrders || 0,
      },
      {
        name: 'Tamamlanan Siparişler',
        alt: `${statusTranslations['COMPLETED']} durumunda`,
        value: `${orderStats.value.completedOrders || 0} Sipariş`,
        raw: orderStats.value.completedOrders || 0,
      },
      {
        name: 'İptal Edilen Siparişler',
        alt: `${statusTranslations['CANCELLED']} durumunda`,
        value: `${orderStats.value.cancelledOrders || 0} Sipariş`,
        raw: orderStats.value.cancelledOrders || 0,
      },
    ],
  })
);

const analyticsComputed = computed((): AnalyticsWidget[] => {
  return [
    chartWidget.value,
    ...numeralWidgets.value,
    tableAnalyticsWidget.value,
    topProductsWidget.value,
    recentOrdersWidget.value,
    orderStatusWidget.value,
  ];
});

const analytics = computed((): AnalyticsWidget[] => {
  if (isSidebarTransitioning.value && cachedAnalytics.value.length > 0) {
    return cachedAnalytics.value;
  }
  return analyticsComputed.value;
});

const autoRefreshInterval = ref<ReturnType<typeof setInterval> | null>(null);

onMounted(() => {
  fetchOrderStats(true);
  setupSidebarListener();
  autoRefreshInterval.value = setInterval(() => {
    fetchOrderStats(false);
  }, 10000);
});

onUnmounted(() => {
  const sidebarToggle = document.querySelector('[data-sidebar="trigger"]');
  const handler = (window as SidebarHandler).__sidebarToggleHandler;
  if (sidebarToggle && typeof handler === 'function') {
    sidebarToggle.removeEventListener('click', handler);
    delete (window as SidebarHandler).__sidebarToggleHandler;
  }
  if (autoRefreshInterval.value) {
    clearInterval(autoRefreshInterval.value);
    autoRefreshInterval.value = null;
  }
});

definePageMeta({
  name: 'Analizler',
});
</script>

<template>
  <Section>
    <div class="flex items-center justify-between mb-6">
      <div>
        <h1 class="text-3xl font-semibold">Analizler</h1>
        <p class="text-muted-foreground mt-1">
          Sipariş ve gelir istatistiklerinizi görüntüleyin
        </p>
      </div>
    </div>

    <div
      v-if="isLoading && chartData.length === 0"
      class="flex items-center justify-center py-24"
    >
      <div class="flex flex-col items-center space-y-4">
        <div class="relative">
          <div
            class="w-12 h-12 border-3 border-muted border-t-primary rounded-full animate-spin"
          />
          <div class="absolute inset-0 flex items-center justify-center">
            <ChartArea class="w-4 h-4 text-primary" />
          </div>
        </div>
        <div class="text-center">
          <div class="text-muted-foreground text-sm font-medium">
            Grafik hazırlanıyor
          </div>
        </div>
      </div>
    </div>
    <div v-else class="grid grid-cols-4 max-sm:grid-cols-1 gap-4">
      <div
        v-for="(widget, index) of analytics"
        :key="`widget-${widget.title}-${index}`"
        :class="
          cn(
            `col-span-${widget.size} max-sm:col-span-1 flex flex-col border rounded-xl p-4 bg-card hover:shadow-md transition-shadow`
          )
        "
      >
        <div class="flex items-center text-muted-foreground gap-2 mb-4">
          <div class="flex items-center gap-2 text-sm">
            <div class="flex p-1.5 bg-muted rounded-lg">
              <component :is="widget.icon" class="size-4" />
            </div>
            {{ widget.title }}
          </div>
          <div v-if="widget.alt" class="ml-auto text-xs">
            {{ widget.alt }}
          </div>
        </div>

        <template v-if="widget.type === 'chart'">
          <div
            v-if="!showChart"
            class="flex-1 h-[300px] flex items-center justify-center"
          >
            <div class="flex flex-col items-center space-y-4">
              <div class="relative">
                <div
                  class="w-12 h-12 border-3 border-muted border-t-primary rounded-full animate-spin"
                />
                <div class="absolute inset-0 flex items-center justify-center">
                  <ChartArea class="w-4 h-4 text-primary" />
                </div>
              </div>
              <div class="text-center">
                <div class="text-muted-foreground text-sm font-medium">
                  Grafik hazırlanıyor
                </div>
              </div>
            </div>
          </div>
          <ClientOnly v-else>
            <AreaChart
              :key="chartKey"
              :data="widget.data"
              index="name"
              :categories="widget.categories"
              class="flex-1 h-[300px]"
            />
          </ClientOnly>
        </template>

        <div
          v-else-if="widget.type === 'numeral'"
          class="flex-1 flex items-center"
        >
          <span class="text-3xl font-bold text-foreground">
            {{ widget.value.toLocaleString() }}
            <span class="text-lg text-muted-foreground">{{
              widget.valueSubfix
            }}</span>
          </span>
        </div>

        <ScrollArea
          v-else-if="widget.type === 'itemlist'"
          class="flex-1 max-h-[400px] pr-4"
        >
          <div
            v-if="widget.items.length === 0"
            class="text-center py-8 text-muted-foreground"
          >
            <Box class="size-8 mx-auto mb-2 opacity-50" />
            <p class="text-sm">Henüz veri bulunmuyor</p>
          </div>
          <div
            v-for="(item, itemIndex) of widget.items"
            v-else
            :key="`${widget.title}-item-${itemIndex}`"
            class="p-3 flex items-center gap-3 max-w-full relative hover:bg-accent rounded-lg transition-colors mb-2"
          >
            <div
              class="p-2 bg-primary/10 rounded-lg aspect-square w-fit h-fit flex items-center justify-center"
            >
              <Box class="size-4 text-primary" />
            </div>
            <div class="flex flex-col flex-1 min-w-0">
              <span
                class="overflow-hidden text-ellipsis whitespace-nowrap font-medium text-sm"
                >{{ item.name }}</span
              >
              <span class="text-muted-foreground text-xs">{{ item.alt }}</span>
            </div>
            <div class="shrink-0 font-semibold text-sm">
              {{ item.value }}
            </div>
          </div>
        </ScrollArea>
      </div>
    </div>
  </Section>
</template>
