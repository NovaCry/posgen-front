<script setup lang="ts">
import SeoMeta from '@/components/seo/SeoMeta.vue';
import Button from '@/components/ui/button/Button.vue';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Users,
  Receipt,
  TrendingUp,
  Calendar,
  CreditCard,
  ShoppingBag,
  CheckCircle,
  AlertCircle,
  Loader2,
  Plus,
  Settings,
} from 'lucide-vue-next';
import { useSelectedShopStore } from '@/store/shop';
import { storeToRefs } from 'pinia';
import { onMounted, ref, computed } from 'vue';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import createProtectedApiInterface from '@/api/protected';
import { toast } from 'vue-sonner';

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

interface TaxType {
  id: string;
  name: string;
  rate: number;
  isDefault: boolean;
}

const shopStore = useSelectedShopStore();
const { name } = storeToRefs(shopStore);
const protectedApiInterface = createProtectedApiInterface();

const isLoading = ref(true);
const isDialogOpen = ref(false);
const isSavingTax = ref(false);

const newTaxForm = ref({
  name: '',
  rate: 0,
});

const taxTypes = ref<TaxType[]>([
  { id: '1', name: 'KDV', rate: 20, isDefault: true },
  { id: '2', name: 'ÖTV', rate: 18, isDefault: false },
  { id: '3', name: 'MTV', rate: 23, isDefault: false },
]);

const stats = ref({
  dailyOrders: 0,
  weeklyOrders: 0,
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

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('tr-TR', {
    style: 'currency',
    currency: 'TRY',
  }).format(value);
};

const defaultTaxRate = computed(() => {
  const defaultTax = taxTypes.value.find((tax) => tax.isDefault);
  return defaultTax ? defaultTax.rate : 20;
});

const addNewTaxType = async () => {
  if (!newTaxForm.value.name.trim() || newTaxForm.value.rate <= 0) {
    toast.error('Lütfen tüm alanları doldurun');
    return;
  }

  try {
    isSavingTax.value = true;
    // fake api call & realistic delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const newTax: TaxType = {
      id: Date.now().toString(),
      name: newTaxForm.value.name.trim(),
      rate: newTaxForm.value.rate,
      isDefault: false,
    };

    taxTypes.value.push(newTax);

    toast.success('Yeni vergi türü başarıyla eklendi!');

    newTaxForm.value = {
      name: '',
      rate: 0,
    };

    isDialogOpen.value = false;
  } catch (error) {
    toast.error('Vergi türü eklenirken bir hata oluştu');
    console.error('Tax type creation error:', error);
  } finally {
    isSavingTax.value = false;
  }
};

const setDefaultTax = (taxId: string) => {
  taxTypes.value.forEach((tax) => {
    tax.isDefault = tax.id === taxId;
  });
  toast.success('Varsayılan vergi türü güncellendi!');
};

const fetchStats = async () => {
  try {
    isLoading.value = true;
    const ordersResponse = await protectedApiInterface({
      url: `shop/orders/${shopStore.id}/orders`,
      method: 'GET',
    });

    if (ordersResponse?.data?.data) {
      const ordersData = ordersResponse.data.data as Order[];
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

      const dailyOrdersArr = ordersData.filter(
        (order) => new Date(order.createdAt) >= today
      );

      const weeklyOrdersArr = ordersData.filter((order) => {
        const orderDate = new Date(order.createdAt);
        const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
        return orderDate >= weekAgo;
      });

      const yearlyOrdersArr = ordersData.filter((order) => {
        const orderDate = new Date(order.createdAt);
        const yearAgo = new Date(
          today.getFullYear() - 1,
          today.getMonth(),
          today.getDate()
        );
        return orderDate >= yearAgo;
      });

      const pendingOrders = ordersData.filter(
        (order) => order.status === 'PENDING'
      );
      const preparingOrders = ordersData.filter(
        (order) => order.status === 'PREPARING'
      );
      const readyOrders = ordersData.filter(
        (order) => order.status === 'READY'
      );
      const completedOrders = ordersData.filter(
        (order) => order.status === 'COMPLETED'
      );
      const cancelledOrders = ordersData.filter(
        (order) => order.status === 'CANCELLED'
      );

      const totalRevenue = completedOrders.reduce(
        (sum, order) => sum + parseFloat(order.finalAmount?.toString() || '0'),
        0
      );

      stats.value = {
        dailyOrders: dailyOrdersArr.length,
        weeklyOrders: weeklyOrdersArr.length,
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
    }
  } catch (error) {
    console.error('İstatistikler yüklenirken hata:', error);
  } finally {
    isLoading.value = false;
  }
};

onMounted(async () => {
  await shopStore.load();
  await fetchStats();
});

definePageMeta({
  name: 'Ayarlar',
});
</script>

<template>
  <SeoMeta title="Ayarlar" description="Ayarlar" />
  <div class="min-h-screen bg-background">
    <div class="relative">
      <Skeleton class="w-full h-64 rounded-none" />
      <div
        class="absolute inset-0 bg-black/40 flex items-center justify-center"
      >
        <h1 class="text-white text-4xl font-bold opacity-0 animate-fade-in">
          {{ name || 'Mağaza Ayarları' }}
        </h1>
      </div>
    </div>

    <div class="flex flex-col items-center relative -top-16">
      <div class="max-w-[1200px] w-full px-6">
        <div class="flex flex-col lg:flex-row gap-8">
          <div class="flex-1">
            <Card class="shadow-lg">
              <CardHeader class="pb-2">
                <div class="flex justify-between items-start">
                  <div>
                    <h1 class="text-3xl font-bold">
                      {{ name || 'Mağaza Adı' }}
                    </h1>
                    <div class="flex items-center gap-2 mt-1">
                      <span class="text-muted-foreground">Mağaza Tipi:</span>
                      <Badge>Kafe</Badge>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p class="text-muted-foreground mb-6">
                  Mağaza açıklaması bulunmuyor.
                </p>

                <Tabs default-value="overview" class="w-full">
                  <TabsList class="w-full justify-start mb-6">
                    <TabsTrigger value="overview">Genel Bakış</TabsTrigger>
                    <TabsTrigger value="orders">Siparişler</TabsTrigger>
                    <TabsTrigger value="products">Çalışanlar</TabsTrigger>
                    <TabsTrigger value="tax">Vergi Ayarları</TabsTrigger>
                  </TabsList>

                  <TabsContent value="overview">
                    <h3 class="text-xl font-semibold mb-4">
                      Performans Metrikleri
                    </h3>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Card>
                        <CardHeader class="pb-2">
                          <div class="flex items-center justify-between">
                            <h4 class="text-base font-medium">
                              Satış İstatistikleri
                            </h4>
                            <TrendingUp class="size-4 text-muted-foreground" />
                          </div>
                        </CardHeader>
                        <CardContent class="space-y-4">
                          <div
                            v-if="isLoading"
                            class="flex justify-center py-4"
                          >
                            <Loader2
                              class="size-6 animate-spin text-muted-foreground"
                            />
                          </div>
                          <div v-else>
                            <div class="flex justify-between items-center mb-2">
                              <div class="flex items-center gap-2">
                                <Calendar
                                  class="size-4 text-muted-foreground"
                                />
                                <span class="text-sm">Bugün</span>
                              </div>
                              <span class="font-medium"
                                >{{ stats.dailyOrders }} Sipariş</span
                              >
                            </div>
                            <div class="flex justify-between items-center mb-2">
                              <div class="flex items-center gap-2">
                                <Calendar
                                  class="size-4 text-muted-foreground"
                                />
                                <span class="text-sm">Bu Hafta</span>
                              </div>
                              <span class="font-medium"
                                >{{ stats.weeklyOrders }} Sipariş</span
                              >
                            </div>
                            <div class="flex justify-between items-center mb-2">
                              <div class="flex items-center gap-2">
                                <Calendar
                                  class="size-4 text-muted-foreground"
                                />
                                <span class="text-sm">Bu Yıl</span>
                              </div>
                              <span class="font-medium"
                                >{{ stats.yearlyOrders }} Sipariş</span
                              >
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader class="pb-2">
                          <div class="flex items-center justify-between">
                            <h4 class="text-base font-medium">
                              Gelir Bilgileri
                            </h4>
                            <CreditCard class="size-4 text-muted-foreground" />
                          </div>
                        </CardHeader>
                        <CardContent class="space-y-4">
                          <div
                            v-if="isLoading"
                            class="flex justify-center py-4"
                          >
                            <Loader2
                              class="size-6 animate-spin text-muted-foreground"
                            />
                          </div>
                          <div v-else>
                            <div class="flex justify-between items-center mb-2">
                              <div class="flex items-center gap-2">
                                <ShoppingBag
                                  class="size-4 text-muted-foreground"
                                />
                                <span class="text-sm">Toplam Gelir</span>
                              </div>
                              <span class="font-medium">{{
                                formatCurrency(stats.totalRevenue)
                              }}</span>
                            </div>
                            <div class="flex justify-between items-center mb-2">
                              <div class="flex items-center gap-2">
                                <Receipt class="size-4 text-muted-foreground" />
                                <span class="text-sm"
                                  >Ortalama Sipariş Değeri</span
                                >
                              </div>
                              <span class="font-medium">{{
                                formatCurrency(stats.averageOrderValue)
                              }}</span>
                            </div>
                            <div class="flex justify-between items-center mb-2">
                              <div class="flex items-center gap-2">
                                <CheckCircle
                                  class="size-4 text-muted-foreground"
                                />
                                <span class="text-sm">Tamamlanma Oranı</span>
                              </div>
                              <span class="font-medium"
                                >%{{ stats.completionRate }}</span
                              >
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </TabsContent>

                  <TabsContent value="orders">
                    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <Card>
                        <CardHeader class="pb-2">
                          <h4 class="text-base font-medium">
                            Bekleyen Siparişler
                          </h4>
                        </CardHeader>
                        <CardContent>
                          <div class="flex items-center justify-between">
                            <AlertCircle class="size-5 text-amber-500" />
                            <span class="text-2xl font-bold">{{
                              stats.pendingOrders
                            }}</span>
                          </div>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader class="pb-2">
                          <h4 class="text-base font-medium">
                            Hazırlanan Siparişler
                          </h4>
                        </CardHeader>
                        <CardContent>
                          <div class="flex items-center justify-between">
                            <Loader2 class="size-5 text-blue-500" />
                            <span class="text-2xl font-bold">{{
                              stats.preparingOrders
                            }}</span>
                          </div>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader class="pb-2">
                          <h4 class="text-base font-medium">
                            Tamamlanan Siparişler
                          </h4>
                        </CardHeader>
                        <CardContent>
                          <div class="flex items-center justify-between">
                            <CheckCircle class="size-5 text-green-500" />
                            <span class="text-2xl font-bold">{{
                              stats.completedOrders
                            }}</span>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </TabsContent>

                  <TabsContent value="products">
                    <div class="flex items-center justify-between mb-4">
                      <h4 class="text-lg font-medium">Çalışan Listesi</h4>
                    </div>
                    <Card>
                      <CardContent class="p-6">
                        <div
                          class="flex flex-col items-center justify-center py-8 text-center"
                        >
                          <Users class="size-12 text-muted-foreground mb-4" />
                          <h3 class="text-lg font-medium mb-2">
                            Toplam 0 Çalışan
                          </h3>
                          <p class="text-muted-foreground max-w-md">
                            Çalışanlarınızı yönetmek, bilgilerini güncellemek ve
                            yeni çalışamlar eklemek için çalışam yönetimi
                            sayfasını ziyaret edin.
                          </p>
                          <NuxtLink to="/dashboard/settings/employees">
                            <Button variant="outline" class="mt-4">
                              Çalışan Yönetimine Git
                            </Button>
                          </NuxtLink>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="tax">
                    <div class="space-y-6">
                      <div class="flex items-center justify-between">
                        <h3 class="text-xl font-semibold">Vergi Ayarları</h3>
                        <Dialog v-model:open="isDialogOpen">
                          <DialogTrigger as-child>
                            <Button>
                              <Plus class="size-4 mr-2" />
                              Yeni Vergi Türü Ekle
                            </Button>
                          </DialogTrigger>
                          <DialogContent class="sm:max-w-[425px]">
                            <DialogHeader>
                              <DialogTitle>Yeni Vergi Türü Ekle</DialogTitle>
                              <DialogDescription>
                                Mağazanız için yeni bir vergi türü tanımlayın.
                                Bu vergi türü ürün oluştururken seçilebilir
                                olacaktır.
                              </DialogDescription>
                            </DialogHeader>
                            <div class="grid gap-4 py-4">
                              <div class="grid grid-cols-4 items-center gap-4">
                                <Label for="tax-name" class="text-right">
                                  İsim
                                </Label>
                                <Input
                                  id="tax-name"
                                  v-model="newTaxForm.name"
                                  placeholder="KDV, ÖTV, vb."
                                  class="col-span-3"
                                />
                              </div>
                              <div class="grid grid-cols-4 items-center gap-4">
                                <Label for="tax-rate" class="text-right">
                                  Vergi Oranı (%)
                                </Label>
                                <Input
                                  id="tax-rate"
                                  v-model.number="newTaxForm.rate"
                                  type="number"
                                  min="0"
                                  max="100"
                                  step="0.01"
                                  placeholder="20"
                                  class="col-span-3"
                                />
                              </div>
                            </div>
                            <DialogFooter>
                              <Button
                                type="button"
                                variant="outline"
                                @click="isDialogOpen = false"
                              >
                                İptal
                              </Button>
                              <Button
                                type="button"
                                :disabled="isSavingTax"
                                @click="addNewTaxType"
                              >
                                <Loader2
                                  v-if="isSavingTax"
                                  class="size-4 mr-2 animate-spin"
                                />
                                Kaydet
                              </Button>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
                      </div>

                      <Card>
                        <CardHeader>
                          <div class="flex items-center gap-2">
                            <Settings class="size-5" />
                            <h4 class="text-lg font-medium">
                              Varsayılan Vergi Ayarları
                            </h4>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div
                            class="flex items-center justify-between p-4 bg-muted rounded-lg"
                          >
                            <div>
                              <p class="font-medium">
                                Varsayılan Vergi Tutarınız
                              </p>
                              <p class="text-sm text-muted-foreground">
                                Yeni ürünlerde otomatik olarak seçilecek vergi
                                oranı
                              </p>
                            </div>
                            <Badge
                              variant="secondary"
                              class="text-lg px-3 py-1"
                            >
                              %{{ defaultTaxRate }}
                            </Badge>
                          </div>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader>
                          <h4 class="text-lg font-medium">
                            Tanımlı Vergi Türleri
                          </h4>
                        </CardHeader>
                        <CardContent>
                          <div class="space-y-3">
                            <div
                              v-for="tax in taxTypes"
                              :key="tax.id"
                              class="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors"
                            >
                              <div class="flex items-center gap-3">
                                <div>
                                  <p class="font-medium">{{ tax.name }}</p>
                                  <p class="text-sm text-muted-foreground">
                                    Vergi Oranı: %{{ tax.rate }}
                                  </p>
                                </div>
                              </div>
                              <div class="flex items-center gap-2">
                                <Badge v-if="tax.isDefault" variant="default">
                                  Varsayılan
                                </Badge>
                                <Button
                                  v-else
                                  variant="outline"
                                  size="sm"
                                  @click="setDefaultTax(tax.id)"
                                >
                                  Varsayılan Yap
                                </Button>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.animate-fade-in {
  animation: fadeIn 1.5s ease forwards;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
