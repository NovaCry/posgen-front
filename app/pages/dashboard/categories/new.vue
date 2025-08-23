<script setup lang="ts">
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';

import IconifyIconSelect from '@/components/input/IconifyIconSelect.vue';
import Label from '@/components/ui/label/Label.vue';

import { computed, ref } from 'vue';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Loader2,
  Plus,
  Info,
  Package,
  Eye,
  EyeOff,
  Tag,
  FileText,
} from 'lucide-vue-next';
import { useSelectedShopStore } from '@/store/shop';
import { toast } from 'vue-sonner';
import createProtectedApiInterface from '@/api/protected';
import Section from '@/components/layout/Section.vue';
import SeoMeta from '@/components/seo/SeoMeta.vue';
const router = useRouter();
const selectedShop = useSelectedShopStore(); // Move hook call to top level
definePageMeta({
  name: 'Yeni Kategori',
});

const categoryName = ref('');
const categoryIcon = ref('');
const categoryDescription = ref('');

const protectedApiInterface = createProtectedApiInterface();
const isLoading = ref(false);
const isAcceptable = computed(() => {
  if (
    categoryName.value !== '' &&
    categoryName.value.length >= 1 &&
    categoryIcon.value !== ''
  )
    return true;
  return false;
});

const isHidden = ref(false);
const isStockless = ref(false);

async function CreateCategory() {
  isLoading.value = true;
  const res = await protectedApiInterface({
    url: `shop/categories/${selectedShop.id}/create`,
    method: 'POST',
    data: {
      name: categoryName.value,
      icon: categoryIcon.value,
      description: categoryDescription.value,
      isHidden: isHidden.value,
      isStockless: isStockless.value,
    },
  }).catch(useErrorHandler);

  if (!res) return (isLoading.value = false);

  toast('Kategori Oluşturuldu!', {
    description: `${categoryName.value} adındaki kategori oluşturuldu!`,
  });
  router.push('/dashboard/categories');
}
</script>

<template>
  <SeoMeta title="Yeni Kategori" description="Yeni Kategori" />
  <Section>
    <div
      class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
    >
      <div>
        <h1 class="text-2xl sm:text-3xl font-semibold">Yeni Kategori</h1>
        <p class="text-muted-foreground mt-1">
          Mağazanız için yeni bir kategori oluşturun
        </p>
      </div>
      <Button
        class="w-full sm:w-auto"
        :disabled="isLoading || !isAcceptable"
        @click="CreateCategory"
      >
        <Loader2 v-if="isLoading" class="animate-spin mr-2" />
        Oluştur
        <Plus class="ml-2" />
      </Button>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-2 w-full mt-6 gap-6">
      <div class="grid grid-cols-1 gap-6 h-full">
        <Card class="h-full flex flex-col">
          <CardHeader>
            <CardTitle class="flex items-center gap-2">
              <Tag class="w-5 h-5" />
              Kategori Bilgisi
            </CardTitle>
            <CardDescription
              >Kategoriye ait temel bilgileri girin</CardDescription
            >
          </CardHeader>
          <CardContent class="flex flex-col gap-4 flex-1">
            <div>
              <Label for="name">Kategori Adı *</Label>
              <Input
                id="name"
                v-model="categoryName"
                :disabled="isLoading"
                class="mt-1"
                placeholder="Örn: Tatlılar"
              />
            </div>
            <div>
              <Label for="icon">Kategori İkonu *</Label>
              <IconifyIconSelect
                id="icon"
                v-model="categoryIcon"
                :disabled="isLoading"
                class="w-full mt-1"
              />
            </div>
          </CardContent>
        </Card>

        <Card class="h-full flex flex-col">
          <CardHeader>
            <CardTitle class="flex items-center gap-2">
              <FileText class="w-5 h-5" />
              Önizleme
            </CardTitle>
            <CardDescription
              >Kategorinin nasıl görüneceğini inceleyin</CardDescription
            >
          </CardHeader>
          <CardContent class="flex-1">
            <div
              v-if="categoryName || categoryIcon"
              class="flex items-center gap-3 p-4 border rounded-lg bg-muted/30 min-h-[72px]"
            >
              <div
                class="flex items-center justify-center w-12 h-12 border rounded-lg bg-background"
              >
                <Icon
                  v-if="categoryIcon"
                  :name="categoryIcon"
                  class="w-6 h-6"
                />
                <Tag v-else class="w-6 h-6 text-muted-foreground" />
              </div>
              <div class="flex flex-col gap-1 flex-1 justify-center">
                <span class="font-medium">{{
                  categoryName || 'Kategori Adı'
                }}</span>
                <span
                  v-if="categoryDescription"
                  class="text-sm text-muted-foreground"
                >
                  {{ categoryDescription }}
                </span>
                <div class="flex flex-wrap gap-1 mt-2">
                  <Badge v-if="isHidden" variant="secondary" class="text-xs">
                    <EyeOff class="w-3 h-3 mr-1" />
                    Gizli
                  </Badge>
                  <Badge
                    v-if="isStockless"
                    variant="outline"
                    class="text-xs bg-green-50 text-green-700 border-green-200"
                  >
                    <Icon name="mdi:infinity" class="w-3 h-3 mr-1" />
                    Stoksuz
                  </Badge>
                </div>
              </div>
            </div>
            <div
              v-else
              class="flex items-center justify-center p-8 border-2 border-dashed rounded-lg text-muted-foreground"
            >
              <div class="text-center">
                <Tag class="w-8 h-8 mx-auto mb-2" />
                <p class="text-sm">Kategori bilgilerini doldurun</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div class="grid grid-cols-1 gap-6 h-full">
        <Card class="h-full flex flex-col">
          <CardHeader>
            <CardTitle class="flex items-center gap-2">
              <Eye class="w-5 h-5" />
              Görünürlük Ayarları
            </CardTitle>
            <CardDescription
              >Kategorinin müşteriler tarafından görünürlüğünü kontrol
              edin</CardDescription
            >
          </CardHeader>
          <CardContent class="flex-1">
            <div class="flex items-start gap-3 p-4 border rounded-lg">
              <Checkbox
                id="hide"
                v-model:checked="isHidden"
                :disabled="isLoading"
                class="mt-1"
              />
              <div class="flex flex-col gap-2 flex-1">
                <Label
                  for="hide"
                  class="flex items-center gap-2 cursor-pointer"
                >
                  <EyeOff class="w-4 h-4" />
                  Kategoriyi Gizle
                  <Badge v-if="isHidden" variant="secondary" class="text-xs">
                    Gizli
                  </Badge>
                </Label>
                <p class="text-sm text-muted-foreground">
                  Kategori ve içerisindeki ürünler müşteri listelerinde
                  görünmez. Bu seçenek kategoriyi geçici olarak devre dışı
                  bırakmak için kullanılabilir.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card class="h-full flex flex-col">
          <CardHeader>
            <CardTitle class="flex items-center gap-2">
              <Package class="w-5 h-5" />
              Stok Yönetimi
            </CardTitle>
            <CardDescription
              >Bu kategorideki ürünlerin stok takibini
              yapılandırın</CardDescription
            >
          </CardHeader>
          <CardContent class="flex-1">
            <div class="flex items-start gap-3 p-4 border rounded-lg">
              <Checkbox
                id="stockless"
                v-model:checked="isStockless"
                :disabled="isLoading"
                class="mt-1"
              />
              <div class="flex flex-col gap-2 flex-1">
                <Label
                  for="stockless"
                  class="flex items-center gap-2 cursor-pointer"
                >
                  <Icon name="mdi:infinity" class="w-4 h-4" />
                  Stoksuz Kategori
                  <Badge
                    v-if="isStockless"
                    variant="outline"
                    class="text-xs bg-green-50 text-green-700 border-green-200"
                  >
                    Sınırsız Stok
                  </Badge>
                </Label>
                <p class="text-sm text-muted-foreground">
                  Bu kategorideki ürünler için stok takibi yapılmaz ve her zaman
                  satışa hazır kabul edilir.
                </p>
              </div>
            </div>

            <Alert v-if="isStockless" class="mt-4">
              <Info class="h-4 w-4" />
              <AlertDescription>
                <strong>Stoksuz Kategori Nedir?</strong><br />
                Bu kategorideki ürünler dijital ürünler, hizmetler veya sürekli
                temin edilebilen ürünler için uygundur. Satış sırasında stok
                kontrolü yapılmaz ve ürünler her zaman "stokta var" olarak
                gösterilir.
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      </div>
    </div>
  </Section>
</template>
