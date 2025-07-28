<script setup lang="ts">
import { cn } from '@/lib/utils';

defineProps<{
  selected?: boolean;
}>();
</script>

<template>
  <div
    :class="
      cn(
        'flex items-center gap-2.5 px-4 py-2 rounded-md',
        selected ? 'bg-input' : ''
      )
    "
  >
    <div
      class="rounded-full bg-primary aspect-square grid place-items-center size-4"
    >
      <div v-if="selected" class="bg-primary-foreground size-2 rounded-full" />
    </div>
    <slot />
  </div>
</template>
