<script setup lang="ts">
import { RouterView } from 'vue-router';
import ApplicationHeader from '~/components/header/app/ApplicationHeader.vue';

definePageMeta({
  middleware: ['auth'],
});
</script>

<template>
  <main>
    <ApplicationHeader />
    <RouterView />
  </main>
</template>
