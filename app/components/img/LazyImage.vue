<template>
  <figure
    :data-aspect="aspect"
    :data-effect="hoverEffect"
    :class="
      cn(
        'group relative w-full h-full aspect-square data-[aspect=video]:aspect-video',
        props.class
      )
    "
  >
    <img
      loading="lazy"
      :loaded="isLoaded"
      :class="
        cn(
          'absolute z-10 group-data-[effect=true]:group-hover/card:brightness-75 aspect-square data-[loaded=false]:hidden group-data-[aspect=video]:aspect-video w-full h-auto object-cover object-center rounded-lg',
          props.class
        )
      "
      :src="src"
      :alt="alt"
      @load="isLoaded = true"
    />
    <Skeleton
      v-if="!isLoaded"
      class="bg-secondary group-data-[effect=true]:group-hover/card:bg-zinc-700 aspect-square group-data-[aspect=video]:aspect-video rounded-lg"
    />
  </figure>
</template>

<script lang="ts" setup>
import type { HTMLAttributes } from 'vue';
import { ref } from 'vue';
import { Skeleton } from '../ui/skeleton';
import { cn } from '@/lib/utils';

const isLoaded = ref(false);

const props = defineProps<{
  src: string;
  alt: string;
  aspect?: 'square' | 'video';
  hoverEffect?: boolean;
  class?: HTMLAttributes['class'];
}>();

// defineProps({
//   src: {
//     type: String,
//     required: true
//   },
//   alt: {
//     type: String,
//     required: true
//   },
//   aspect: {
//     type: String as PropType<"square" | "video">,
//     default: "square",
//     required: false
//   },
//   hoverEffect: {
//     type: Boolean,
//     required: false
//   },
// })
</script>
