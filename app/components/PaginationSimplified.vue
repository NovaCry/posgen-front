<script setup lang="ts">
import { ref, watch } from 'vue';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import { ChevronLeft, ChevronRight } from 'lucide-vue-next';

const props = defineProps({
  modelValue: {
    default: 1,
    type: Number,
    required: false,
  },
  itemsPerPage: {
    type: Number,
    required: false,
    default: 10,
  },
  totalItems: {
    type: Number,
    default: 1,
  },
});

const p = ref<number>(props.modelValue || 1);

const emit = defineEmits(['update:modelValue']);

watch(p, (n) => emit('update:modelValue', n));
</script>

<template>
  <Pagination
    v-slot="{ page }"
    v-model:page="p"
    :items-per-page="itemsPerPage"
    :total="totalItems"
    :sibling-count="1"
    show-edges
    :default-page="1"
  >
    <PaginationContent v-slot="{ items }">
      <PaginationPrevious> <ChevronLeft /> Geri </PaginationPrevious>

      <template v-for="(item, index) in items" :key="index">
        <PaginationItem
          v-if="item.type === 'page'"
          :value="item.value"
          :is-active="item.value === page"
        >
          {{ item.value }}
        </PaginationItem>
      </template>

      <PaginationEllipsis :index="4" />

      <PaginationNext>
        İleri
        <ChevronRight />
      </PaginationNext>
    </PaginationContent>
  </Pagination>
</template>
