<script setup lang="ts">
import type { CartItem } from '../cafe';
import SideCafeProduct from '../cafe/SideCafeProduct.vue';
import ExpenseDetails from './ExpenseDetails.vue';

const selectedItemsList = defineModel({
  type: Array<CartItem>,
  required: true,
  default: [],
});
</script>

<template>
  <div class="container py-6">
    <h1 class="text-2xl font-semibold">Müşteri Bilgisi</h1>
    <div class="flex mt-4">
      <span class="text-sm text-muted-foreground">Hizmet mevcut değil.</span>
    </div>
    <h1 class="mt-8 text-2xl font-semibold">Fiyat Özeti</h1>
    <ExpenseDetails />
    <h1 class="mt-8 text-2xl font-semibold">Sepetteki Ürünler</h1>
    <div class="flex flex-col gap-4 mt-4">
      <!-- TODO: add v-for -->
      <!-- TODO: make component -->
      <SideCafeProduct
        v-for="item of selectedItemsList"
        :key="item.title"
        v-model:quantity="item.state.quantity"
        v-model:selected="item.state.selected"
        :name="item.title"
        :price="item.price"
        :max-quantity="item.maxQuantity"
      />
    </div>
  </div>
</template>
