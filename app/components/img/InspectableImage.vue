<script setup lang="ts">
import type { PropType } from 'vue';
import { Dialog, DialogContent, DialogTrigger } from '../ui/dialog';
import LazyImage from './LazyImage.vue';

defineProps({
  src: {
    type: String,
    required: true,
  },
  alt: {
    type: String,
    required: true,
  },
  aspect: {
    type: String as PropType<'square' | 'video'>,
    default: 'square',
    required: false,
  },
  hoverEffect: {
    type: Boolean,
    required: false,
  },
});
</script>

<template>
  <Dialog>
    <DialogTrigger class="w-full h-full">
      <LazyImage
        :aspect="aspect"
        :src="src"
        :alt="alt"
        :hover-effect="hoverEffect"
      />
    </DialogTrigger>
    <DialogContent
      class="max-w-[80%] max-h-[80%] aspect-video w-full h-auto flex items-center justify-center"
    >
      <LazyImage
        class="h-[100%]"
        :aspect="aspect"
        :src="src"
        :alt="alt"
        :hover-effect="hoverEffect"
      />
    </DialogContent>
  </Dialog>
</template>
