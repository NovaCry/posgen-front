<script setup lang="ts">
import { motion } from 'motion-v';
</script>

<template>
  <motion.div
    class="flex p-4 border rounded-xl gap-4 items-center transition-all duration-200 delay-100 z-10 hover:scale-[1.03] group/card"
  >
    <slot />
  </motion.div>
</template>
