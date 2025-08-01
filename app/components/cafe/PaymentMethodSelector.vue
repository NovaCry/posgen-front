<script setup lang="ts">
import { CreditCard, Banknote } from 'lucide-vue-next';

interface Props {
  paymentMethod: 'cash' | 'card';
}

interface Emits {
  (e: 'update:paymentMethod', value: 'cash' | 'card'): void;
}

defineProps<Props>();
defineEmits<Emits>();
</script>

<template>
  <div class="space-y-3 w-full">
    <div
      class="flex items-center space-x-3 p-3 border rounded-lg hover:bg-accent/50 transition-all duration-200 w-full cursor-pointer"
      :class="
        paymentMethod === 'cash'
          ? 'bg-green-50 border-green-200 dark:bg-green-950/20 dark:border-green-800'
          : 'border-gray-200'
      "
      @click="$emit('update:paymentMethod', 'cash')"
    >
      <div class="relative flex items-center justify-center">
        <div
          class="w-5 h-5 border-2 rounded-full transition-all duration-200"
          :class="
            paymentMethod === 'cash' ? 'border-green-600' : 'border-gray-300'
          "
        />
        <div
          v-if="paymentMethod === 'cash'"
          class="absolute w-3 h-3 bg-green-600 rounded-full transition-all duration-200"
        />
      </div>
      <div class="flex items-center gap-3 flex-1">
        <Banknote class="size-5 text-green-600" />
        <span class="text-sm font-medium">Nakit</span>
      </div>
    </div>

    <div
      class="flex items-center space-x-3 p-3 border rounded-lg hover:bg-accent/50 transition-all duration-200 w-full cursor-pointer"
      :class="
        paymentMethod === 'card'
          ? 'bg-blue-50 border-blue-200 dark:bg-blue-950/20 dark:border-blue-800'
          : 'border-gray-200'
      "
      @click="$emit('update:paymentMethod', 'card')"
    >
      <div class="relative flex items-center justify-center">
        <div
          class="w-5 h-5 border-2 rounded-full transition-all duration-200"
          :class="
            paymentMethod === 'card' ? 'border-blue-600' : 'border-gray-300'
          "
        />
        <div
          v-if="paymentMethod === 'card'"
          class="absolute w-3 h-3 bg-blue-600 rounded-full transition-all duration-200"
        />
      </div>
      <div class="flex items-center gap-3 flex-1">
        <CreditCard class="size-5 text-blue-600" />
        <span class="text-sm font-medium">Kredi Kartı</span>
      </div>
    </div>
  </div>
</template>
