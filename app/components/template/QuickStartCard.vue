<script setup lang="ts">
import { motion, useScroll } from 'motion-v';
import { ref } from 'vue';

const card = ref<HTMLHeadingElement | null>(null);

const sectionAnimationState = useScroll({
  target: card,
  offset: ['start center', 'end end'],
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
  <div ref="card">
    <motion.div
      :style="{
        top: `${sectionAnimationPositionState}px`,
        opacity: sectionAnimationState.scrollYProgress,
        filter: `blur(${sectionAnimationBlurState}px)`,
      }"
      class="border shadow-xl bg-accent p-4 rounded-xl items-start flex flex-col gap-2 pb-0"
    >
      <slot />
    </motion.div>
  </div>
</template>
