<script setup lang="ts">
import ChatDisplay from '~/components/ChatDisplay.vue';

definePageMeta({
  name: 'Pai',
});
</script>

<template>
  <main class="relative min-h-[calc(100vh-4rem)]">
    <div class="absolute top-1/2 left-1/2 -translate-1/2">
      <h1 class="text-center text-3xl mb-8">Size nasıl yardımcı olabilirim?</h1>
      <ChatDisplay />
    </div>
  </main>
</template>
