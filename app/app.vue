<template>
  <Toaster />
  <NuxtPage />
</template>

<script setup lang="ts">
import { useColorMode } from '@vueuse/core';
import { Toaster } from './components/ui/sonner';
import { useSelectedShopStore } from './store/shop';
useColorMode();

const auth = useAuth();
const selectedShop = useSelectedShopStore();

onMounted(() => {
  auth.load();
  selectedShop.load();
});
</script>
