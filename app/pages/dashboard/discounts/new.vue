<script setup lang="ts">
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { computed, ref, watch } from 'vue';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  Loader2,
  Plus,
  Tag,
  Package,
  Layers,
  Clock,
  Settings,
} from 'lucide-vue-next';
import { useSelectedShopStore } from '@/store/shop';
import { toast } from 'vue-sonner';
import createProtectedApiInterface from '@/api/protected';
import Section from '@/components/layout/Section.vue';

const router = useRouter();

const discountCode = ref('');
const discountAmount = ref('');
const isPercentageDiscount = ref(true);

const isRelatedProducts = ref(false);
const isRelatedCategories = ref(false);
const relatedProducts = ref([]);
const relatedCategories = ref([]);

const startDate = ref('');
const endDate = ref('');
const maxUses = ref<number | undefined>(undefined);

const categoryIcon = ref('tag');

const protectedApiInterface = createProtectedApiInterface();
const selectedShop = useSelectedShopStore();

const isLoading = ref(false);
const dateError = ref('');

watch([startDate, endDate], ([newStartDate, newEndDate]) => {
  if (newStartDate && newEndDate) {
    const start = new Date(newStartDate);
    const end = new Date(newEndDate);

    if (end < start) {
      dateError.value = 'Bitiş tarihi başlangıç tarihinden önce olamaz';
    } else {
      dateError.value = '';
    }
  } else {
    dateError.value = '';
  }
});

watch([discountAmount, isPercentageDiscount], ([newAmount, isPercent]) => {
  if (isPercent) {
    const val = Number(newAmount);
    if (isNaN(val) || val < 0) {
      discountAmount.value = '0';
    } else if (val > 100) {
      discountAmount.value = '100';
    }
  }
});

const isAcceptable = computed(() => {
  if (
    discountCode.value !== '' &&
    discountCode.value.length >= 3 &&
    discountAmount.value !== '' &&
    !dateError.value
  )
    return true;
  return false;
});

async function CreateDiscount() {
  if (dateError.value) return;

  isLoading.value = true;
  const res = await protectedApiInterface({
    url: `shop/discounts/${selectedShop.id}/create`,
    method: 'POST',
    data: {
      name: discountCode.value,
      discount: Number(discountAmount.value),
      isRate: isPercentageDiscount.value,
      icon: categoryIcon.value,

      isRelated: isRelatedProducts.value,
      relatedProducts: isRelatedProducts.value
        ? relatedProducts.value
        : undefined,
      relatedCategories: isRelatedProducts.value
        ? relatedCategories.value
        : undefined,

      startDate: startDate.value || undefined,
      endDate: endDate.value || undefined,
      maxUses: maxUses.value,
    },
  }).catch(useErrorHandler);

  if (!res) {
    isLoading.value = false;
    return;
  }

  toast('İndirim Oluşturuldu!', {
    description: `${discountCode.value} adındaki indirim başarıyla oluşturuldu!`,
  });
  router.push('/dashboard/discounts');
}

function onDiscountInput(event: Event) {
  const target = event.target as HTMLInputElement;
  let val = Number(target.value);
  if (isPercentageDiscount.value) {
    if (val < 1) val = 1;
    if (val > 100) val = 100;
  } else {
    if (val < 1) val = 1;
    if (val > 1500) val = 1500;
  }
  discountAmount.value = val.toString();
  target.value = val.toString();
}

definePageMeta({
  name: 'Yeni İndirim',
});
</script>

<template>
  <Section>
    <div
      class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8"
    >
      <div class="space-y-1">
        <h1 class="text-3xl font-bold tracking-tight">Yeni İndirim Oluştur</h1>
        <p class="text-muted-foreground">
          Müşterileriniz için özel indirim kampanyası oluşturun
        </p>
      </div>
      <Button
        size="lg"
        :disabled="isLoading || !isAcceptable"
        class="border-0 shadow-md"
        @click="CreateDiscount"
      >
        <Loader2 v-if="isLoading" class="animate-spin mr-2 h-4 w-4" />
        <Plus v-else class="mr-2 h-4 w-4" />
        İndirim Oluştur
      </Button>
    </div>

    <div class="grid lg:grid-cols-3 gap-8">
      <div class="lg:col-span-2 space-y-6">
        <Card class="border-0 shadow-md">
          <CardHeader class="pb-4">
            <div class="flex items-center gap-3">
              <Tag class="h-5 w-5" />
              <div>
                <CardTitle class="text-xl"> İndirim Bilgileri </CardTitle>
                <CardDescription>
                  Temel indirim ayarlarını yapılandırın
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent class="space-y-6">
            <div class="space-y-2">
              <Label for="discount-code" class="text-sm font-medium">
                İndirim Kodu
              </Label>
              <Input
                id="discount-code"
                v-model="discountCode"
                :disabled="isLoading"
                placeholder="örn. POSGEN2025"
                class="h-11 text-base"
              />
              <p class="text-xs text-muted-foreground">
                Müşterilerinizin kullanacağı benzersiz kod
              </p>
            </div>

            <div class="space-y-4">
              <div class="flex items-center justify-between">
                <div class="space-y-1">
                  <Label class="text-sm font-medium">İndirim Türü</Label>
                  <p class="text-xs text-muted-foreground">
                    {{
                      isPercentageDiscount
                        ? 'Yüzdelik indirim'
                        : 'Sabit tutar indirimi'
                    }}
                  </p>
                </div>
                <div class="flex items-center gap-3 bg-muted/50 rounded-lg p-1">
                  <span
                    class="text-sm px-3 py-1 rounded-md transition-colors"
                    :class="
                      !isPercentageDiscount
                        ? 'bg-background shadow-sm font-medium'
                        : 'text-muted-foreground'
                    "
                  >
                    Tutar
                  </span>
                  <Switch
                    v-model="isPercentageDiscount"
                    :disabled="isLoading"
                  />
                  <span
                    class="text-sm px-3 py-1 rounded-md transition-colors"
                    :class="
                      isPercentageDiscount
                        ? 'bg-background shadow-sm font-medium'
                        : 'text-muted-foreground'
                    "
                  >
                    Yüzde
                  </span>
                </div>
              </div>

              <div class="space-y-2">
                <Label for="discount-amount" class="text-sm font-medium">
                  İndirim Miktarı
                </Label>
                <div class="relative">
                  <Input
                    id="discount-amount"
                    v-model="discountAmount"
                    :disabled="isLoading"
                    type="number"
                    :placeholder="isPercentageDiscount ? '25' : '100'"
                    class="h-11 text-base pr-12"
                    :min="isPercentageDiscount ? 1 : 1"
                    :max="isPercentageDiscount ? 100 : 1500"
                    @input="onDiscountInput"
                    @change="onDiscountInput"
                  />
                  <div
                    class="absolute inset-y-0 right-0 flex items-center pr-4"
                  >
                    <div class="flex items-center gap-1 text-muted-foreground">
                      <span class="text-sm font-medium">
                        {{ isPercentageDiscount ? '%' : '₺' }}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div class="grid md:grid-cols-2 gap-6">
          <Card class="border-0 shadow-md">
            <CardHeader class="pb-4">
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-3">
                  <Package class="h-5 w-5" />
                  <div>
                    <CardTitle class="text-lg"> Ürün Hedefleme </CardTitle>
                    <CardDescription class="text-xs">
                      Belirli ürünlere uygula
                    </CardDescription>
                  </div>
                </div>
                <Switch v-model="isRelatedProducts" :disabled="isLoading" />
              </div>
            </CardHeader>
            <CardContent class="pt-0">
              <div
                class="transition-all duration-200"
                :class="isRelatedProducts ? 'opacity-100' : 'opacity-50'"
              >
                <div class="space-y-3">
                  <Badge variant="outline" class="text-xs">
                    {{ isRelatedProducts ? 'Aktif' : 'Pasif' }}
                  </Badge>
                  <p class="text-sm text-muted-foreground">
                    İndirimi sadece seçili ürünlerde geçerli kılın
                  </p>
                  <div
                    v-if="isRelatedProducts"
                    class="p-3 bg-muted/30 rounded-lg border-2 border-dashed"
                  >
                    <p class="text-sm text-center text-muted-foreground">
                      Ürün seçimi için geliştirilecek
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card class="border-0 shadow-md">
            <CardHeader class="pb-4">
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-3">
                  <Layers class="h-5 w-5" />
                  <div>
                    <CardTitle class="text-lg"> Kategori Hedefleme </CardTitle>
                    <CardDescription class="text-xs">
                      Belirli kategorilere uygula
                    </CardDescription>
                  </div>
                </div>
                <Switch v-model="isRelatedCategories" :disabled="isLoading" />
              </div>
            </CardHeader>
            <CardContent class="pt-0">
              <div
                class="transition-all duration-200"
                :class="isRelatedCategories ? 'opacity-100' : 'opacity-50'"
              >
                <div class="space-y-3">
                  <Badge variant="outline" class="text-xs">
                    {{ isRelatedCategories ? 'Aktif' : 'Pasif' }}
                  </Badge>
                  <p class="text-sm text-muted-foreground">
                    İndirimi sadece seçili kategorilerde geçerli kılın
                  </p>
                  <div
                    v-if="isRelatedCategories"
                    class="p-3 bg-muted/30 rounded-lg border-2 border-dashed"
                  >
                    <p class="text-sm text-center text-muted-foreground">
                      Kategori seçimi için geliştirilecek
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <div class="space-y-6">
        <Card class="border-0 shadow-md">
          <CardHeader class="pb-4">
            <div class="flex items-center gap-3">
              <Clock class="h-5 w-5" />
              <div>
                <CardTitle class="text-lg"> Geçerlilik Ayarları </CardTitle>
                <CardDescription class="text-xs">
                  Tarih ve kullanım sınırları
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent class="space-y-6">
            <div class="space-y-4">
              <div class="space-y-2">
                <Label
                  for="start-date"
                  class="text-sm font-medium flex items-center gap-2"
                >
                  Başlangıç Tarihi
                </Label>
                <Input
                  id="start-date"
                  v-model="startDate"
                  :disabled="isLoading"
                  type="date"
                  class="h-10"
                />
              </div>

              <div class="space-y-2">
                <Label
                  for="end-date"
                  class="text-sm font-medium flex items-center gap-2"
                >
                  Bitiş Tarihi
                </Label>
                <Input
                  id="end-date"
                  v-model="endDate"
                  :disabled="isLoading"
                  type="date"
                  class="h-10"
                  :class="dateError ? 'border-destructive' : ''"
                />
                <div
                  v-if="dateError"
                  class="text-xs text-destructive flex items-center gap-1 mt-1"
                >
                  {{ dateError }}
                </div>
              </div>

              <Separator />

              <div class="space-y-2">
                <Label
                  for="max-uses"
                  class="text-sm font-medium flex items-center gap-2"
                >
                  Maksimum Kullanım
                </Label>
                <Input
                  id="max-uses"
                  v-model="maxUses"
                  :disabled="isLoading"
                  type="number"
                  placeholder="Sınırsız"
                  class="h-10"
                />
                <p class="text-xs text-muted-foreground">
                  Boş bırakırsanız sınırsız kullanım
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card class="border-0 shadow-md">
          <CardHeader class="pb-4">
            <div class="flex items-center gap-3">
              <Settings class="h-5 w-5" />
              <div>
                <CardTitle class="text-lg"> Önizleme </CardTitle>
                <CardDescription class="text-xs">
                  İndirim özeti
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent class="space-y-4">
            <div class="p-4 rounded-lg border">
              <div class="text-center space-y-2">
                <div class="text-2xl font-bold truncate max-w-full">
                  {{ discountCode || 'POSGEN2025' }}
                </div>
                <div class="text-3xl font-bold">
                  {{ discountAmount || '0'
                  }}{{ isPercentageDiscount ? '%' : '₺' }}
                  <span class="text-sm font-normal text-muted-foreground"
                    >indirim</span
                  >
                </div>
                <Badge variant="secondary" class="text-xs">
                  {{ isPercentageDiscount ? 'Yüzdelik' : 'Sabit Tutar' }}
                </Badge>
              </div>
            </div>

            <div class="space-y-2 text-sm">
              <div class="flex justify-between">
                <span class="text-muted-foreground">Durum:</span>
                <Badge
                  :variant="isAcceptable ? 'default' : 'secondary'"
                  class="text-xs"
                >
                  {{ isAcceptable ? 'Hazır' : 'Eksik Bilgi' }}
                </Badge>
              </div>
              <div class="flex justify-between">
                <span class="text-muted-foreground">Hedefleme:</span>
                <span class="text-xs">
                  {{
                    isRelatedProducts || isRelatedCategories ? 'Özel' : 'Genel'
                  }}
                </span>
              </div>
              <div class="flex justify-between">
                <span class="text-muted-foreground">Süre:</span>
                <span class="text-xs">
                  {{ startDate && endDate ? 'Sınırlı' : 'Süresiz' }}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  </Section>
</template>
