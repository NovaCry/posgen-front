<script setup lang="ts">
import { ArrowRight, Ellipsis } from 'lucide-vue-next';
import SeatRenderer from './SeatRenderer.vue';

export type TableStatus = 'empty' | 'reserved' | 'filled';

defineProps<{
  name: string;
  size: number;
  status: TableStatus;
}>();
</script>

<template>
  <div
    class="border p-4 flex gap-4 items-center justify-between rounded-xl transition hover:bg-accent cursor-pointer active:scale-95"
  >
    <div class="flex gap-4 items-center min-w-0 flex-1">
      <SeatRenderer
        :key="name"
        :seat-size="size"
        renderer-size="small"
        :color="
          status === 'empty'
            ? 'default'
            : status === 'filled'
              ? 'red'
              : 'yellow'
        "
        class="shrink-0"
      >
        <Ellipsis />
      </SeatRenderer>
      <div class="flex flex-col min-w-0">
        <span class="text-lg font-medium truncate text-foreground">
          {{ name }}
        </span>
        <span class="text-sm text-muted-foreground">{{ size }} Kişi</span>
      </div>
    </div>
    <ArrowRight class="size-5 shrink-0 text-muted-foreground" />
  </div>
</template>
