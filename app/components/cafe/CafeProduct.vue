<script setup lang="ts">
import { Check } from 'lucide-vue-next';
import NumberFieldSimplified from '../input/NumberFieldSimplified.vue';
import { motion } from 'motion-v';

defineProps<{
  name: string;
  maxQuantity: number;
  price: number;
  image: string;
}>();

const quantityModel = defineModel<number>('quantity', {
  type: Number,
  default: 1,
});

const [selectedModel] = defineModel<boolean>('selected', {
  default: true,
});

function handleCardClick(e: MouseEvent) {
  if ((e.target as HTMLElement).dataset.purpose == 'remove') {
    return (selectedModel.value = false);
  }
  selectedModel.value = true;
}
</script>

<template>
  <div class="w-full space-y-3">
    <!-- Main Product Card -->
    <button
      class="relative flex flex-col gap-4 w-full text-left p-4 bg-card border border-border rounded-xl hover:bg-accent/50 hover:border-accent-foreground/20 transition-all duration-200 hover:shadow-md group overflow-hidden"
      @click="handleCardClick"
    >
      <!-- Selected overlay -->
      <motion.div
        v-if="selectedModel"
        :initial="{ opacity: 0 }"
        :animate="{ opacity: 1 }"
        :exit="{ opacity: 0 }"
        :transition="{ duration: 0.075 }"
        class="absolute inset-0 bg-background/95 backdrop-blur-sm rounded-xl flex items-center justify-center z-10"
      >
        <div class="flex items-center gap-2">
          <div class="p-2 bg-primary rounded-full flex-shrink-0">
            <Check class="text-primary-foreground size-4" />
          </div>
          <span class="font-medium text-sm">Ürün Sepette Ekli</span>
        </div>
      </motion.div>

      <!-- Product info -->
      <div class="flex flex-col gap-2">
        <h3
          class="font-semibold text-lg text-foreground group-hover:text-accent-foreground transition-colors"
        >
          {{ name }}
        </h3>
        <div class="flex items-center justify-between">
          <span class="text-xl font-bold text-primary"
            >{{ price.toLocaleString() }} ₺</span
          >
        </div>
      </div>

      <!-- Selection indicator -->
      <div
        v-if="selectedModel"
        class="absolute -top-2 -right-2 w-6 h-6 bg-primary rounded-full flex items-center justify-center border-2 border-background shadow-lg"
      >
        <Check class="size-3 text-primary-foreground" />
      </div>
    </button>

    <NumberFieldSimplified
      v-if="false"
      v-model="quantityModel"
      :min="1"
      :max="9999"
    />

    <!-- External Controls (Quantity & Remove Button) -->
    <motion.div
      v-if="selectedModel"
      :initial="{ opacity: 0, y: -10 }"
      :animate="{ opacity: 1, y: 0 }"
      :exit="{ opacity: 0, y: -10 }"
      :transition="{ duration: 0.2 }"
      class="relative z-20"
    >
      <NumberFieldSimplified
        v-model="quantityModel"
        :max="maxQuantity"
        :min="1"
        label="Miktar"
      />
    </motion.div>
  </div>
</template>
