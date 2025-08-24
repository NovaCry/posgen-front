<script setup lang="ts">
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import Label from '@/components/ui/label/Label.vue';
import {
  Loader2,
  Plus,
  UploadCloud,
  X,
  Check,
  ChevronDown,
  Tag,
  Package,
  Settings,
  Edit,
} from 'lucide-vue-next';
import { computed, ref } from 'vue';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import LazyImage from '@/components/img/LazyImage.vue';
import NumberFieldSimplified from '@/components/input/NumberFieldSimplified.vue';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { computedAsync } from '@vueuse/core';
import { useSelectedShopStore } from '@/store/shop';
import type Pagination from '@/types/api/Pagination';
import type { Category } from '@/types/api/Category';
import { toast } from 'vue-sonner';
import createProtectedApiInterface from '@/api/protected';
import Section from '@/components/layout/Section.vue';
import { Separator } from '@/components/ui/separator';
import type { Product } from '~/types/api/Product';

useSeo({
  title: 'Ürün Oluştur',
  description: 'Ürün oluştur',
});

definePageMeta({
  name: 'Ürün Oluştur',
});

interface TaxType {
  id: string;
  name: string;
  rate: number;
  label: string;
}

const router = useRouter();
const route = useRoute();

const taxTypes: TaxType[] = [
  { id: 'kdv', name: 'KDV', rate: 20, label: 'KDV (%20)' },
  { id: 'otv', name: 'ÖTV', rate: 18, label: 'ÖTV (%18)' },
  { id: 'mtv', name: 'MTV', rate: 23, label: 'MTV (%23)' },
];

interface Stock {
  id: number;
  barcode: string;
  quantity: number;
  maxQuantity: number;
}

const protectedApiInterface = createProtectedApiInterface();
const selectedShop = useSelectedShopStore();

const categories = computedAsync(async () => {
  const res = await protectedApiInterface<Pagination<Category>>({
    url: `shop/categories/${selectedShop.id}/list`,
    method: 'GET',
  }).catch(useErrorHandler);

  if (!res) return [];
  return res.data.data;
});

const selectedCategoryId = ref('');
const isLimitless = ref(false);
const PricePerUnit = ref(false);
const price = ref(0);
const stock = ref<Stock[]>([]);
const productName = ref('');
const hideProduct = ref(false);
const isLoading = ref(false);
const selectedTaxType = ref<TaxType>(
  taxTypes[0] ?? { id: '', name: '', rate: 0, label: '' }
);
const isEditing = ref(route.query.edit === 'true' && route.query.id);

function selectTaxType(taxType: TaxType): void {
  if (!isLoading.value) {
    selectedTaxType.value = taxType;
  }
}

const isAcceptable = computed(() => {
  return (
    selectedCategoryId.value !== '' &&
    price.value > 0 &&
    (isLimitless.value || stock.value.length > 0) &&
    productName.value !== '' &&
    productName.value.length >= 1
  );
});

function selectCategory(id: string): void {
  if (!isLoading.value) {
    selectedCategoryId.value = id;
  }
}

async function EditProduct() {
  isLoading.value = true;

  const res = await protectedApiInterface({
    url: `shop/products/${selectedShop.id}/${route.query.id}/update`,
    method: 'PUT',
    data: {
      name: productName.value,
      price: price.value,
      isLimitless: isLimitless.value,
      stocks: isLimitless.value
        ? []
        : stock.value.map((stockItem) => ({
            ...stockItem,
            quantity: stockItem.quantity,
          })),
    },
  }).catch(useErrorHandler);

  if (!res) {
    isLoading.value = false;
    return;
  }

  toast('Ürün Güncellendi!', {
    description: `${productName.value} adındaki ürün güncellendi!`,
  });

  await router.push('/dashboard/product');
}

async function CreateProduct(): Promise<void> {
  isLoading.value = true;

  const res = await protectedApiInterface({
    url: `shop/products/${selectedShop.id}/create`,
    method: 'POST',
    data: {
      name: productName.value,
      price: String(price.value),
      categoryId: selectedCategoryId.value,
      isPricePerUnit: PricePerUnit.value,
      pricePerUnit: PricePerUnit.value ? String(price.value) : undefined,
      unitType: PricePerUnit.value ? 'kg' : undefined,
      isLimitless: isLimitless.value,
      stocks: isLimitless.value
        ? []
        : stock.value.map((stockItem) => ({
            ...stockItem,
            quantity: String(stockItem.quantity),
            maxQuantity: String(stockItem.maxQuantity),
          })),
    },
  }).catch(useErrorHandler);

  if (!res) {
    isLoading.value = false;
    return;
  }

  toast('Ürün Oluşturuldu!', {
    description: `${productName.value} adındaki ürün oluşturuldu!`,
  });

  await router.push('/dashboard/product');
}

function newStock(): void {
  stock.value.push({
    barcode: '',
    id: stock.value.length + 1,
    maxQuantity: 100,
    quantity: 1,
  });
}

function deleteStock(index: number): void {
  stock.value.splice(index, 1);
}

onMounted(async () => {
  const route = useRoute();

  if (isEditing.value) {
    const product = await protectedApiInterface.get<{ data: Product }>(
      `/shop/products/${selectedShop.id}/${route.query.id}/get`
    );
    productName.value = product.data.data.name;
    if (product.data.data.isPricePerUnit && product.data.data.pricePerUnit) {
      PricePerUnit.value = true;
      price.value = +product.data.data.pricePerUnit;
    } else {
      price.value = +product.data.data.price;
    }
    selectedCategoryId.value = product.data.data.categoryId;
    isLimitless.value = product.data.data.isLimitless || false;

    if (
      !isLimitless.value &&
      product.data.data.stocks &&
      product.data.data.stocks.length > 0
    ) {
      stock.value = []; // Clear default stock
      product.data.data.stocks.forEach((stockItem) => {
        stock.value.push({
          id: +stockItem.id,
          barcode: stockItem.barcode || '',
          quantity: Number(stockItem.quantity),
          maxQuantity: Number(stockItem.maxQuantity),
        });
      });
    } else if (isLimitless.value) {
      stock.value = []; // Clear stocks for limitless products
    }
  }
});
</script>

<template>
  <div>
    <Section>
      <div class="flex flex-col space-y-4 mb-6 sm:mb-8 lg:mb-10">
        <div
          class="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4"
        >
          <div class="space-y-1 flex-1">
            <h1
              class="text-xl sm:text-2xl lg:text-3xl font-bold tracking-tight"
            >
              Yeni Ürün Oluştur
            </h1>
            <p class="text-sm sm:text-base text-muted-foreground">
              Mağazanıza yeni bir ürün ekleyin
            </p>
          </div>
          <Button
            size="lg"
            :disabled="isLoading || !isAcceptable"
            class="border-0 shadow-md w-full sm:w-auto sm:min-w-[160px] h-11 sm:h-12"
            @click="isEditing ? EditProduct() : CreateProduct()"
          >
            <Loader2 v-if="isLoading" class="animate-spin mr-2 h-4 w-4" />
            <template v-else>
              <Edit v-if="isEditing" class="mr-2 h-4 w-4" />
              <Plus v-else class="mr-2 h-4 w-4" />
            </template>

            <span class="text-sm sm:text-base">
              <template v-if="isEditing"> Ürünü Düzenle </template>
              <template v-else> Ürünü Oluştur </template>
            </span>
          </Button>
        </div>
      </div>

      <div class="grid grid-cols-1 xl:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
        <div class="xl:col-span-2 space-y-4 sm:space-y-6">
          <Card class="border-0 shadow-md">
            <CardHeader class="pb-3 sm:pb-4 px-4 sm:px-6">
              <div class="flex items-center gap-2 sm:gap-3">
                <Tag class="h-4 w-4 sm:h-5 sm:w-5 shrink-0" />
                <div class="min-w-0 flex-1">
                  <CardTitle class="text-lg sm:text-xl truncate">
                    Ürün Bilgileri
                  </CardTitle>
                  <CardDescription class="text-xs sm:text-sm">
                    Temel ürün bilgilerini yapılandırın
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent class="space-y-4 sm:space-y-6 px-4 sm:px-6">
              <div class="space-y-2">
                <Label for="brand" class="text-sm font-medium">
                  Ürün Markası
                </Label>
                <Input
                  id="brand"
                  disabled
                  class="h-10 sm:h-11 text-sm sm:text-base"
                  placeholder="Marka Adı"
                />
                <p class="text-xs text-muted-foreground">
                  Ürünün marka bilgisi
                </p>
              </div>
              <div class="space-y-2">
                <Label for="name" class="text-sm font-medium"> Ürün Adı </Label>
                <Input
                  id="name"
                  v-model="productName"
                  :disabled="isLoading"
                  class="h-10 sm:h-11 text-sm sm:text-base"
                  placeholder="Ürün Adı"
                />
                <p class="text-xs text-muted-foreground">
                  Ürünün görünecek adı
                </p>
              </div>
            </CardContent>
          </Card>

          <Card class="border-0 shadow-md">
            <CardHeader class="pb-3 sm:pb-4 px-4 sm:px-6">
              <div class="flex items-center gap-2 sm:gap-3">
                <Package class="h-4 w-4 sm:h-5 sm:w-5 shrink-0" />
                <div class="min-w-0 flex-1">
                  <CardTitle class="text-lg sm:text-xl truncate">
                    {{ isLimitless ? 'Stok Kontrolü Yok' : 'Ürün Stoğu' }}
                  </CardTitle>
                  <CardDescription class="text-xs sm:text-sm">
                    {{
                      isLimitless
                        ? 'Bu ürün için stok kontrolü yapılmaz'
                        : 'Stok ve barkod bilgileri'
                    }}
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent class="space-y-4 sm:space-y-6 px-4 sm:px-6">
              <div v-if="isLimitless" class="text-center py-8">
                <Package
                  class="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50"
                />
                <h3 class="text-lg font-semibold mb-2">Stok Kontrolü Yok</h3>
                <p class="text-muted-foreground">
                  Bu ürün için stok kontrolü yapılmaz. Ürün her zaman satışa
                  açıktır.
                </p>
              </div>

              <div
                v-for="(stockField, i) in stock"
                v-else
                :key="stockField.id"
                class="space-y-4"
              >
                <div class="block sm:hidden space-y-3">
                  <div class="flex items-center gap-2">
                    <div class="flex-1 flex items-center gap-2">
                      <Label class="text-sm font-medium">Barkod</Label>
                      <Input
                        v-model="stockField.barcode"
                        class="h-10 text-sm mt-1 flex-1"
                        :disabled="isLoading"
                        placeholder="978020137962"
                      />
                    </div>
                    <Button
                      class="h-9 w-9 shrink-0"
                      :disabled="isLoading"
                      size="icon"
                      variant="outline"
                      @click="deleteStock(i)"
                    >
                      <X class="h-4 w-4" />
                    </Button>
                  </div>
                  <div class="grid grid-cols-2 gap-3">
                    <div>
                      <Label class="text-sm font-medium">Stok</Label>
                      <NumberFieldSimplified
                        v-model="stockField.quantity"
                        class="h-10 text-sm mt-1"
                        :disabled="isLoading"
                        label=""
                      />
                    </div>
                    <div>
                      <Label class="text-sm font-medium">Maksimum</Label>
                      <NumberFieldSimplified
                        v-model="stockField.maxQuantity"
                        class="h-10 text-sm mt-1"
                        :disabled="isLoading"
                        label=""
                      />
                    </div>
                  </div>
                </div>
                <div class="hidden sm:grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div class="flex items-end gap-2 lg:col-span-2">
                    <Button
                      class="h-11 w-11 shrink-0"
                      :disabled="isLoading"
                      size="icon"
                      variant="outline"
                      @click="deleteStock(i)"
                    >
                      <X class="h-4 w-4" />
                    </Button>
                    <div class="flex-1">
                      <Label class="text-sm font-medium">Barkod</Label>
                      <Input
                        v-model="stockField.barcode"
                        class="h-11 text-base"
                        :disabled="isLoading"
                        placeholder="978020137962"
                      />
                    </div>
                  </div>
                  <div>
                    <Label class="text-sm font-medium">Stok</Label>
                    <NumberFieldSimplified
                      v-model="stockField.quantity"
                      class="h-11 text-base"
                      :disabled="isLoading"
                      label=""
                    />
                  </div>
                  <div>
                    <Label class="text-sm font-medium">Maksimum</Label>
                    <NumberFieldSimplified
                      v-model="stockField.maxQuantity"
                      class="h-11 text-base"
                      :disabled="isLoading"
                      label=""
                    />
                  </div>
                </div>
              </div>
              <Button
                v-if="!isLimitless"
                :disabled="isLoading"
                class="w-full h-10 sm:h-11"
                @click="newStock()"
              >
                <Plus class="mr-2 h-4 w-4" />
                <span class="text-sm sm:text-base">Yeni Stok</span>
              </Button>
            </CardContent>
          </Card>
        </div>
        <div class="space-y-4 sm:space-y-6">
          <Card class="border-0 shadow-md">
            <CardHeader class="pb-3 sm:pb-4 px-4 sm:px-6">
              <div class="flex items-center gap-2 sm:gap-3">
                <Tag class="h-4 w-4 sm:h-5 sm:w-5 shrink-0" />
                <div class="min-w-0 flex-1">
                  <CardTitle class="text-base sm:text-lg truncate">
                    Kategori
                  </CardTitle>
                  <CardDescription class="text-xs">
                    Ürünün bulunacağı kategori
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent class="px-4 sm:px-6">
              <Carousel class="w-full">
                <CarouselContent class="-ml-2 sm:-ml-4">
                  <CarouselItem
                    v-for="category of categories"
                    :key="category.id"
                    :data-selected="category.id == selectedCategoryId"
                    class="group basis-[120px] sm:basis-[140px] lg:basis-[160px] pl-2 sm:pl-4"
                  >
                    <div
                      class="group-data-[selected=true]:bg-primary group-data-[selected=true]:text-primary-foreground hover:bg-secondary transition-colors cursor-pointer flex w-full items-center justify-center gap-2 border p-2 sm:p-3 rounded-md min-h-[40px] sm:min-h-[44px]"
                      @click="selectCategory(category.id)"
                    >
                      <span
                        class="text-xs sm:text-sm text-center leading-tight"
                        >{{ category.name }}</span
                      >
                    </div>
                  </CarouselItem>
                </CarouselContent>
                <CarouselPrevious class="hidden sm:flex" />
                <CarouselNext class="hidden sm:flex" />
              </Carousel>
            </CardContent>
          </Card>
          <Card class="border-0 shadow-md">
            <CardHeader class="pb-3 sm:pb-4 px-4 sm:px-6">
              <div class="flex items-center gap-2 sm:gap-3">
                <Settings class="h-4 w-4 sm:h-5 sm:w-5 shrink-0" />
                <div class="min-w-0 flex-1">
                  <CardTitle class="text-base sm:text-lg truncate">
                    Ürün Ayarları
                  </CardTitle>
                  <CardDescription class="text-xs">
                    Ürün niteliğinde işlenecek ayarlar
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent class="space-y-4 px-4 sm:px-6">
              <div class="space-y-4">
                <div class="space-y-2">
                  <DropdownMenu>
                    <DropdownMenuTrigger as-child>
                      <Button
                        variant="outline"
                        class="w-full justify-between"
                        :disabled="isLoading"
                      >
                        <span>Vergi Türü: {{ selectedTaxType.label }}</span>
                        <ChevronDown class="h-4 w-4 opacity-50" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent class="w-56">
                      <DropdownMenuLabel>Vergi Türleri</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        v-for="taxType in taxTypes"
                        :key="taxType.id"
                        class="flex items-center justify-between cursor-pointer"
                        @click="selectTaxType(taxType)"
                      >
                        <span>{{ taxType.label }}</span>
                        <Check
                          v-if="selectedTaxType.id === taxType.id"
                          class="h-4 w-4 text-primary"
                        />
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                <div class="space-y-2">
                  <Label class="text-sm font-medium">Fiyat (₺)</Label>
                  <NumberFieldSimplified
                    v-model="price"
                    :disabled="isLoading"
                    class="h-10 sm:h-11 text-sm sm:text-base"
                    :min="0"
                    label=""
                  />
                </div>
              </div>
              <Separator class="my-4" />
              <div class="space-y-3">
                <div class="flex items-center justify-between py-2">
                  <div class="flex-1">
                    <Label class="text-sm font-medium">Ürünü Gizle</Label>
                    <p class="text-xs text-muted-foreground mt-0.5">
                      Listelerden gizler
                    </p>
                  </div>
                  <Checkbox
                    v-model="hideProduct"
                    :disabled="isLoading"
                    class="shrink-0"
                  />
                </div>
                <div class="flex items-center justify-between py-2">
                  <div class="flex-1">
                    <Label class="text-sm font-medium">Stoksuz</Label>
                    <p class="text-xs text-muted-foreground mt-0.5">
                      Stok kontrolü yapılmaz
                    </p>
                  </div>
                  <Checkbox
                    v-model="isLimitless"
                    :disabled="isLoading"
                    class="shrink-0"
                  />
                </div>
                <div class="flex items-center justify-between py-2">
                  <div class="flex-1">
                    <Label class="text-sm font-medium">Tartılabilir Ürün</Label>
                    <p class="text-xs text-muted-foreground mt-0.5">
                      Fiyat ağırlığa göre hesaplanır
                    </p>
                  </div>
                  <Checkbox
                    v-model="PricePerUnit"
                    :disabled="isLoading"
                    class="shrink-0"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card class="border-0 shadow-md">
            <CardHeader class="pb-3 sm:pb-4 px-4 sm:px-6">
              <div class="flex items-center gap-2 sm:gap-3">
                <UploadCloud class="h-4 w-4 sm:h-5 sm:w-5 shrink-0" />
                <div class="min-w-0 flex-1">
                  <CardTitle class="text-base sm:text-lg truncate">
                    Ürün Fotoğrafları
                  </CardTitle>
                  <CardDescription class="text-xs">
                    Listelemelerde yer alacak ürün fotoğrafları
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent class="px-4 sm:px-6">
              <Carousel class="w-full">
                <CarouselContent class="-ml-2 sm:-ml-4">
                  <CarouselItem
                    class="basis-20 sm:basis-24 lg:basis-28 pl-2 sm:pl-4"
                  >
                    <div
                      class="group aspect-square border-2 border-dashed rounded-lg hover:border-primary transition-colors cursor-pointer flex flex-col items-center justify-center"
                    >
                      <UploadCloud
                        class="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6 text-muted-foreground group-hover:text-primary transition-colors"
                      />
                    </div>
                  </CarouselItem>
                  <CarouselItem
                    v-for="n in 7"
                    :key="n"
                    class="basis-20 sm:basis-24 lg:basis-28 pl-2 sm:pl-4"
                  >
                    <LazyImage
                      :src="`/macbook${n}.jpg`"
                      alt="macbook"
                      class="aspect-square object-cover rounded-lg"
                    />
                  </CarouselItem>
                </CarouselContent>
                <CarouselPrevious class="hidden sm:flex" />
                <CarouselNext class="hidden sm:flex" />
              </Carousel>
            </CardContent>
          </Card>
        </div>
      </div>
    </Section>
  </div>
</template>
