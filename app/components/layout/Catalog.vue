<script setup lang="ts">
import CafeProduct from '../cafe/CafeProduct.vue';
import type { CartCategory } from '../cafe';
import { Filter, Search, SortDesc, ChevronDown } from 'lucide-vue-next';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { ref, computed } from 'vue';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const productList = defineModel({
  type: Array<CartCategory>,
  required: true,
  default: [],
});

const emit = defineEmits<{
  productUpdate: [];
}>();

const selectedCategoryId = ref<string | null>(null);
const searchQuery = ref('');
const sortBy = ref<'name' | 'price-asc' | 'price-desc'>('name');
 

const filteredCategories = computed(() => {
  let filtered = [...productList.value];

  
  if (searchQuery.value) {
    filtered = filtered
      .map((category) => ({
        ...category,
        items: category.items.filter((item) =>
          item.title.toLowerCase().includes(searchQuery.value.toLowerCase())
        ),
      }))
      .filter((category) => category.items.length > 0);
  }

  
  if (selectedCategoryId.value) {
    filtered = filtered.filter(
      (category) => category.id === selectedCategoryId.value
    );
  }

  
  filtered = filtered.map((category) => {
    const sortedItems = [...category.items].sort((a, b) => {
      if (sortBy.value === 'name') {
        return a.title.localeCompare(b.title);
      } else if (sortBy.value === 'price-asc') {
        return a.price - b.price;
      } else if (sortBy.value === 'price-desc') {
        return b.price - a.price;
      }
      return 0;
    });

    return {
      ...category,
      items: sortedItems,
    };
  });

  return filtered;
});

function selectCategory(categoryId: string) {
  selectedCategoryId.value =
    selectedCategoryId.value === categoryId ? null : categoryId;
}

function setSort(sort: 'name' | 'price-asc' | 'price-desc') {
  sortBy.value = sort;
}
</script>

<template>
  <div v-bind="$attrs">
    <div class="flex items-center px-6 py-4 gap-4">
      <div class="relative w-full">
        <Search
          class="absolute left-2.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground"
        />
        <Input
          v-model="searchQuery"
          placeholder="Ürünlerin hepsinde arayın..."
          class="pl-8"
        />
      </div>

      <DropdownMenu>
        <DropdownMenuTrigger as-child>
          <Button variant="outline" size="lg" class="gap-2">
            <SortDesc class="size-4" />
            Sırala
            <ChevronDown class="size-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem @click="setSort('name')">
            İsme Göre
          </DropdownMenuItem>
          <DropdownMenuItem @click="setSort('price-asc')">
            Fiyat (Düşükten Yükseğe)
          </DropdownMenuItem>
          <DropdownMenuItem @click="setSort('price-desc')">
            Fiyat (Yüksekten Düşüğe)
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <DropdownMenu>
        <DropdownMenuTrigger as-child>
          <Button variant="outline" size="lg" class="gap-2">
            <Filter class="size-4" />
            Filtrele
            <ChevronDown class="size-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem @click="selectedCategoryId = null">
            Tüm Kategoriler
          </DropdownMenuItem>
          <DropdownMenuItem
            v-for="cat of productList"
            :key="cat.id"
            @click="selectedCategoryId = cat.id"
          >
            {{ cat.title }}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
    <div class="px-6 pb-6">
      <div class="flex gap-4 overflow-x-auto pb-2">
        <Button
          v-for="cat of productList"
          :key="cat.id"
          size="lg"
          :variant="selectedCategoryId === cat.id ? 'default' : 'outline'"
          class="whitespace-nowrap"
          @click="selectCategory(cat.id)"
        >
          {{ cat.title }}
        </Button>
      </div>
    </div>

    <div class="space-y-8">
      <div v-for="cat of filteredCategories" :key="cat.id">
        <div class="px-6">
          <h2 class="text-xl font-semibold mb-4">
            {{ cat.title }}
          </h2>
          <div
            class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 items-start mb-4"
          >
            <CafeProduct
              v-for="item of cat.items"
              :key="item.title"
              v-model:quantity="item.state.quantity"
              v-model:selected="item.state.selected"
              :name="item.title"
              :price="item.price"
              :image="item.image"
              :max-quantity="item.maxQuantity"
              :has-stock="item.hasStock"
              @update:quantity="$emit('productUpdate')"
              @update:selected="$emit('productUpdate')"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
