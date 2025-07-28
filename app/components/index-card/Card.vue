<script setup lang="ts">
import { motion } from 'motion-v';
import CardNextButton from './CardNextButton.vue';
</script>

<template>
  <motion.div
    class="group/card border rounded-xl relative flex flex-col p-6 transition hover:scale-[1.01]"
  >
    <slot />
    <CardNextButton />
  </motion.div>
</template>
