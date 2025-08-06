<template>
  <main>
    <HeaderIndexHeader />
    <NuxtPage />
  </main>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: ['auth'],
});
</script>
