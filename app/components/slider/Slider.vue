<template>
  <div class="relative">
    <div
      v-if="BoundingSide == 'none' || BoundingSide != 'left'"
      class="absolute left-0 top-0 h-full w-10 bg-linear-to-r from-zinc-50 dark:from-zinc-950"
    />
    <div
      ref="SliderContent"
      class="group flex gap-2 w-full overflow-hidden cursor-grab data-[handling=true]:cursor-grabbing"
      :data-handling="isHandling"
      :data-bounding-side="BoundingSide"
    >
      <slot />
    </div>
    <div
      v-if="BoundingSide == 'none' || BoundingSide != 'right'"
      class="absolute right-0 top-0 h-full w-10 bg-linear-to-l from-zinc-50 dark:from-zinc-950"
    />
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref } from 'vue';

const SliderContent = ref<HTMLDivElement | null>(null);
const BoundingSide = ref('');
const isHandling = ref(false);
let maxScrollLeft = 0;

function attachSlider() {
  if (!SliderContent.value) return;

  let lastPosition = 0;
  let isDown = false;
  maxScrollLeft =
    (SliderContent.value?.scrollWidth || 0) -
    (SliderContent.value?.clientWidth || 0);

  CalculateBoundingSide();

  SliderContent.value.addEventListener('pointerdown', () => {
    isDown = true;
    // isHandling.value = true;
  });

  SliderContent.value.addEventListener('pointerup', () => {
    isDown = false;
    isHandling.value = false;
  });

  SliderContent.value.addEventListener('pointerleave', () => {
    isDown = false;
    isHandling.value = false;
  });

  SliderContent.value.addEventListener('wheel', (ev) => {
    if (SliderContent.value) SliderContent.value.scrollLeft += ev.deltaY * 0.3;
  });

  SliderContent.value.addEventListener('pointermove', (ev) => {
    if (isDown && !isHandling.value) isHandling.value = true;
    if (isHandling.value) {
      if (SliderContent.value)
        SliderContent.value.scrollLeft += ev.movementX * -1;
      CalculateBoundingSide();
    }
  });

  SliderContent.value.addEventListener('touchend', () => {
    lastPosition = -1;
  });

  SliderContent.value.addEventListener('touchmove', (ev) => {
    if (lastPosition == -1) {
      lastPosition = ev.touches[0].clientX;
      return;
    }
    const movement = ev.touches[0].clientX - lastPosition;
    if (SliderContent.value) SliderContent.value.scrollLeft += movement * -1;
    CalculateBoundingSide();
    lastPosition = ev.touches[0].clientX;
  });
}

function CalculateBoundingSide() {
  if (SliderContent.value?.scrollLeft == 0) BoundingSide.value = 'left';
  else if (SliderContent.value?.scrollLeft == maxScrollLeft)
    BoundingSide.value = 'right';
  else BoundingSide.value = 'none';
}

onMounted(() => {
  if (!SliderContent.value) return;
  attachSlider();
});
</script>
