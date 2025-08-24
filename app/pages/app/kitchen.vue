<script setup lang="ts">
// import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import OrderCard from '@/components/OrderCard.vue';

useSeo({
  title: 'Mutfak',
  description: 'Mutfak',
});
</script>

<template>
  <div>
    <div class="grid grid-cols-2 w-full h-screen max-h-[calc(100dvh-3rem)]">
      <div class="border-r p-4">
        <h1 class="text-2xl font-semibold">Bekleyen Siparişler</h1>
        <div class="mt-4">
          <OrderCard />
        </div>
      </div>
      <div class="p-4">
        <h1 class="text-2xl font-semibold">Devam Edenler</h1>
      </div>
    </div>
  </div>
</template>
