<script setup lang="ts">
import { RouterView } from 'vue-router';
import ApplicationHeader from '~/components/header/app/ApplicationHeader.vue';
import SeoMeta from '@/components/seo/SeoMeta.vue';
definePageMeta({
  middleware: ['auth'],
});
</script>

<template>
  <SeoMeta title="App" description="App" />
  <main>
    <ApplicationHeader />
    <RouterView />
  </main>
</template>
