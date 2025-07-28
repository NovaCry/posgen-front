<template>
  <Toaster />
  <RouterView />
</template>

<script setup lang="ts">
import { useColorMode } from '@vueuse/core';
import { Toaster } from './components/ui/sonner';
import { useUserStore } from './store/user';
import { useSelectedShopStore } from './store/shop';
import { useSidebarStore } from './store/sidebar';
useColorMode();

const user = useUserStore();
const selectedShop = useSelectedShopStore();
const sidebar = useSidebarStore();

user.load();
selectedShop.load();
sidebar.load();
</script>
