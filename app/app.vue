<template>
  <Toaster />
  <NuxtPage />
</template>

<script setup lang="ts">
import { useColorMode } from '@vueuse/core';
import { Toaster } from './components/ui/sonner';
import { useSelectedShopStore } from './store/shop';
useColorMode();

const userStore = useUserStore();
const selectedShop = useSelectedShopStore();

onMounted(() => {
  userStore.load();
  selectedShop.load();
});
</script>
