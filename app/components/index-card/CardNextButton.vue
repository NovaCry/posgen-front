<script setup lang="ts">
import CardNextButtonArrow from './CardNextButtonArrow.vue';
</script>

<template>
  <NuxtLink
    class="flex gap-2.5 items-center group/button mt-2.5 relative w-fit transition-all duration-100 delay-100 group-hover/card:ml-2 hover:ml-2"
  >
    <slot>
      Daha fazlası
      <CardNextButtonArrow />
    </slot>
  </NuxtLink>
</template>
