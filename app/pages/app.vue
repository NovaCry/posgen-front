<script setup lang="ts">
import { RouterView } from 'vue-router';
import ApplicationHeader from '~/components/header/app/ApplicationHeader.vue';
</script>

<template>
  <main>
    <ApplicationHeader />
    <RouterView />
  </main>
</template>
