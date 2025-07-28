<script setup lang="ts">
import CardNextButtonArrow from './CardNextButtonArrow.vue';
</script>

<template>
  <a
    href="#"
    class="flex gap-2.5 items-center mt-2.5 relative w-fit transition-all duration-100 delay-100 group-hover/card:ml-2"
  >
    <slot>
      Daha fazlası
      <CardNextButtonArrow />
    </slot>
  </a>
</template>
