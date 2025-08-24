<script setup lang="ts">
import { RouterView } from 'vue-router';
import ApplicationHeader from '~/components/header/app/ApplicationHeader.vue';

definePageMeta({
  middleware: ['auth'],
});

useSeo({
  title: 'Uygulama',
  description: 'Posgen web uygulaması.',
});
</script>

<template>
  <div>
    <main>
      <ApplicationHeader />
      <RouterView />
    </main>
  </div>
</template>
