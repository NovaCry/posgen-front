<template>
  <Toaster />
  <NuxtPage />
</template>

<script setup lang="ts">
import { useColorMode } from '@vueuse/core';
import { Toaster } from './components/ui/sonner';
import { useSelectedShopStore } from './store/shop';
useColorMode();

const user = useUser();
const session = useSession();
const selectedShop = useSelectedShopStore();

onMounted(() => {
  user.load();
  session.load();
  selectedShop.load();
});
</script>
