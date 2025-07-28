<template>
  <div class="border flex flex-col rounded-xl">
    <div class="flex items-center text-sm text-muted-foreground gap-2 p-3">
      <component :is="icon" class="size-4" />
      <h5 class="font-semibold">
        {{ name }}
      </h5>
    </div>
    <div class="flex flex-col mt-auto p-3 gap-1">
      <span :class="cn('text-2xl font-semibold', stateMap[state])">
        {{ value.toLocaleString() }}
        <span v-if="valueSubfix" class="opacity-60 text-lg">
          {{ valueSubfix }}
        </span>
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { cn } from '@/lib/utils';
import type {
  DefineComponent,
  FunctionalComponent,
  HTMLAttributes,
  VNode,
} from 'vue';

type CardValueState = 'normal' | 'danger' | 'success';

const stateMap: Record<CardValueState, HTMLAttributes['class']> = {
  danger: 'text-red-600 dark:text-red-400',
  normal: '',
  success: 'text-green-600 dark:text-green-400',
};

defineProps<{
  name: string;
  value: string | number;
  valueSubfix?: string;
  icon: VNode | DefineComponent<unknown> | FunctionalComponent;
  state: CardValueState;
}>();
</script>
