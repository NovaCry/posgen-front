<script setup lang="ts">
import { CreditCard, Banknote, Users } from 'lucide-vue-next';

interface Props {
  totalPrice: number;
  taxAmount: number;
  finalPrice: number;
  splitPayment: boolean;
  splitAmounts: number[];
  splitPaymentMethods: Array<'cash' | 'card'>;
}

defineProps<Props>();
</script>

<template>
  <div class="gap-1 flex flex-col w-full">
    <div class="grid grid-cols-7 gap-2 items-center">
      <span class="col-span-3 text-right text-muted-foreground text-xs"
        >Toplam:</span
      >
      <span class="col-span-4 font-semibold text-sm"
        >{{ totalPrice.toLocaleString() }}₺</span
      >
    </div>
    <div class="grid grid-cols-7 gap-2 items-center">
      <span class="col-span-3 text-right text-muted-foreground text-xs"
        >Vergi (KDV 20%):</span
      >
      <span class="col-span-4 font-medium text-xs"
        >{{ taxAmount.toLocaleString() }}₺</span
      >
    </div>
    <div class="grid grid-cols-7 gap-2 items-center border-t pt-2 mt-2">
      <span class="col-span-3 text-right font-medium text-xs"
        >Genel Toplam:</span
      >
      <span class="col-span-4 font-semibold text-sm"
        >{{ finalPrice.toLocaleString() }}₺</span
      >
    </div>

    <div
      v-if="splitPayment"
      class="mt-3 p-2 bg-blue-50 dark:bg-blue-950/20 rounded border border-blue-200 dark:border-blue-800"
    >
      <div class="text-xs font-medium text-blue-700 dark:text-blue-300 mb-2">
        Ödeme Bölünmesi:
      </div>
      <div class="space-y-1">
        <div
          v-for="(amount, index) in splitAmounts"
          :key="index"
          class="flex justify-between text-xs"
        >
          <span class="flex items-center gap-1">
            <Users class="size-2" />
            Kişi {{ index + 1 }}
            <component
              :is="
                splitPaymentMethods[index] === 'cash' ? Banknote : CreditCard
              "
              class="size-2 ml-1"
            />
          </span>
          <span class="font-medium">{{ amount.toLocaleString() }}₺</span>
        </div>
      </div>
    </div>
  </div>
</template>
