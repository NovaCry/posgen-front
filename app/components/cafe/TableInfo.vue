<script setup lang="ts">
import { Button } from '@/components/ui/button';
import { ArrowRight, Users } from 'lucide-vue-next';
import SeatRenderer from './SeatRenderer.vue';
import type Table from '@/types/api/Table';

interface Props {
  selectedTable: Table | null;
  hasActiveOrder: boolean;
  isLoading: boolean;
}

interface Emits {
  (e: 'changeTable'): void;
}

defineProps<Props>();
defineEmits<Emits>();
</script>

<template>
  <div class="p-3 border rounded-xl flex gap-3 items-center">
    <div class="p-2 border rounded-lg aspect-square w-fit shrink-0">
      <SeatRenderer
        :seat-size="selectedTable?.seatSize || 4"
        renderer-size="extrasmall"
      />
    </div>
    <div class="flex flex-col min-w-0 flex-1">
      <span class="font-semibold">{{
        selectedTable?.name || 'Masa Seçilmedi'
      }}</span>
      <span class="text-xs text-muted-foreground flex items-center gap-1">
        <Users class="size-3" />
        {{ selectedTable?.seatSize || 0 }} Kişilik
      </span>
      <span v-if="hasActiveOrder" class="text-xs text-green-600 font-medium">
        Aktif Sipariş Var
      </span>
    </div>
    <div class="shrink-0">
      <Button
        variant="ghost"
        size="sm"
        :disabled="isLoading"
        @click="$emit('changeTable')"
      >
        <span class="hidden xl:inline text-xs">Değiştir</span>
        <ArrowRight class="h-3 w-3 xl:ml-1" />
      </Button>
    </div>
  </div>
</template>
