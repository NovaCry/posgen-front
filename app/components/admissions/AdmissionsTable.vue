<template>
  <div class="flex items-center my-4">
    <div class="flex items-center mr-auto gap-4">
      <Input :model-value="props.search" @update:model-value="(value: string | number) => emit('update:search', String(value))" placeholder="Adisyonlarda Arama Yap..." />
      <Button disabled variant="outline">
        <ListFilter />
        Sırala
      </Button>
    </div>
  </div>
  
  <div v-if="props.getFilteredOrders().length === 0" class="text-center py-12 animate-in fade-in duration-500">
    <Receipt
      class="size-12 mx-auto mb-4 text-muted-foreground opacity-50 animate-bounce"
    />
    <h3 class="text-lg font-semibold mb-2">
      {{
        props.search.trim() 
          ? 'Arama sonucu bulunamadı' 
          : props.filter === 'active'
            ? 'Aktif adisyon bulunmuyor'
            : 'Henüz adisyon bulunmuyor'
      }}
    </h3>
    <p class="text-muted-foreground">
      {{
        props.search.trim()
          ? `"${props.search}" için sonuç bulunamadı. Farklı kelimeler deneyin.`
          : props.filter === 'active'
            ? 'Şu anda aktif olan bir adisyon yok.'
            : 'Henüz hiç sipariş oluşturulmamış.'
      }}
    </p>
  </div>

  <template v-else>
    <DataTable :data="props.getTableData().slice((props.currentPage - 1) * props.itemsPerPage, props.currentPage * props.itemsPerPage)" />
    
    <PaginationSimplified
      :model-value="props.currentPage"
      @update:model-value="emit('update:currentPage', $event)"
      class="my-4 w-full flex justify-center"
      :items-per-page="props.itemsPerPage"
      :total-items="props.getFilteredOrders().length"
    />
  </template>
</template>

<script setup lang="ts">
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ListFilter, Receipt } from 'lucide-vue-next';
import DataTable from '@/components/DataTable.vue';
import PaginationSimplified from '@/components/PaginationSimplified.vue';

interface Order {
  id: string;
  tableId: string | null;
  status: string;
  createdAt: string;
  finalAmount: number;
  items: any[];
}

interface Props {
  search: string;
  filter: 'all' | 'active';
  currentPage: number;
  itemsPerPage: number;
  getFilteredOrders: () => Order[];
  getTableData: () => any[];
}

interface Emits {
  'update:search': [value: string];
  'update:currentPage': [value: number];
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();
</script>
