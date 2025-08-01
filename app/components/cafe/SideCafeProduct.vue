<script setup lang="ts">
import { Trash2 } from 'lucide-vue-next';
import NumberFieldSimplified from '../input/NumberFieldSimplified.vue';

defineProps<{
  name: string;
  price: number;
  maxQuantity: number;
}>();

const selectedModel = defineModel('selected', {
  default: false,
});
const quantityModel = defineModel('quantity', {
  default: 1,
});

function removeFromOrder() {
  selectedModel.value = false;
  quantityModel.value = 1;
}
</script>

<template>
  <div v-if="selectedModel" class="flex gap-4 items-center group">
    <figure
      class="size-16 aspect-square rounded-md overflow-hidden relative shrink-0 bg-muted/50 border"
    >
      <button
        class="cursor-pointer absolute w-full h-full top-0 left-0 flex items-center justify-center bg-background/80 hover:bg-background/90 transition-colors"
        @click="removeFromOrder"
      >
        <Trash2 class="text-red-600 size-5" />
      </button>
    </figure>
    <div class="flex flex-col min-w-0 flex-1">
      <span class="truncate font-medium">{{ name }}</span>
      <span class="text-sm truncate text-muted-foreground"
        >{{ price.toLocaleString() }} ₺</span
      >
    </div>
    <NumberFieldSimplified
      :key="`${name}-${quantityModel}`"
      v-model="quantityModel"
      :min="1"
      :max="maxQuantity"
      class="max-w-28 shrink-0"
    />
  </div>
</template>
