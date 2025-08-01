<template>
  <Toaster />
  <NuxtPage />
</template>

<script setup lang="ts">
import { useColorMode } from '@vueuse/core';
import { Toaster } from './components/ui/sonner';
import { useUserStore } from './store/user';
import { useSelectedShopStore } from './store/shop';
useColorMode();

const user = useUserStore();
const selectedShop = useSelectedShopStore();

onMounted(() => {
  user.load();
  selectedShop.load();
});
</script>
