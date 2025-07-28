<script setup lang="ts">
import { motion, useScroll } from 'motion-v';
import { ref } from 'vue';

const sectionHeader = ref<HTMLHeadingElement | null>(null);

const sectionAnimationState = useScroll({
  target: sectionHeader,
  offset: ['end end', 'start center'],
  axis: 'y',
});

const sectionAnimationBlurState = ref(0);
const sectionAnimationPositionState = ref(0);

sectionAnimationState.scrollYProgress.on('change', (l) => {
  sectionAnimationBlurState.value = 4 * (1 - l);
  sectionAnimationPositionState.value = 50 * (1 - l);
});
</script>

<template>
  <div ref="sectionHeader">
    <motion.h1
      :style="{
        top: `${sectionAnimationPositionState}px`,
        opacity: sectionAnimationState.scrollYProgress,
        filter: `blur(${sectionAnimationBlurState}px)`,
      }"
      class="text-5xl md:text-7xl relative"
    >
      <slot />
    </motion.h1>
  </div>
</template>
