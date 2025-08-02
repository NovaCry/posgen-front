<script setup lang="ts">
import { cn } from '@/lib/utils';
import { computed, ref } from 'vue';

type RendererColor = 'green' | 'red' | 'yellow' | 'default';
type RendererSize = 'large' | 'medium' | 'small' | 'extrasmall';

const props = defineProps<{
  seatSize: number;
  rendererSize?: RendererSize;
  color?: RendererColor;
}>();

const color = ref(props.color || 'default');
const size = ref(props.rendererSize || 'medium');

const rendererMaxSeat = size.value == 'extrasmall' ? 4 : 12;

const seatRendererArray = computed(() => {
  const rendererArray = new Uint8Array(4);
  for (let i = 0; i < Math.min(rendererMaxSeat, props.seatSize); i++) {
    rendererArray[i % 4] += 1;
  }
  return rendererArray;
});

function styleRendererAsColor(color: RendererColor) {
  return (
    {
      default: 'bg-secondary',
      green:
        'group-data-[color=green]:bg-green-200 dark:group-data-[color=green]:bg-green-950',
      red: 'group-data-[color=red]:bg-red-200 dark:group-data-[color=red]:bg-red-950',
      yellow:
        'group-data-[color=yellow]:bg-yellow-200 dark:group-data-[color=yellow]:bg-yellow-950',
    } as Record<RendererColor, string>
  )[color];
}

function styleRendererAsSize(size: RendererSize) {
  return (
    {
      extrasmall: '[--size:1.5rem] [--gap:.75rem]',
      small: '[--size:3rem] [--gap:1rem]',
      medium: '[--size:4.5rem] [--gap:1.25rem]',
      large: '[--size:6rem] [--gap:1.5rem]',
    } as Record<RendererSize, string>
  )[size];
}
</script>

<template>
  <div
    class="w-fit flex relative items-center justify-center m-4 group"
    :data-size="rendererSize"
    :data-color="color"
  >
    <div
      :class="
        cn(
          styleRendererAsSize(size),
          `absolute left-1/2 -translate-x-1/2 -top-[var(--gap)] w-[var(--size)] flex gap-1`
        )
      "
    >
      <!-- Top -->
      <div
        v-for="n in seatRendererArray[0]"
        :key="n"
        :class="cn(`h-2 w-full rounded-full`, styleRendererAsColor(color))"
      />
    </div>
    <div
      :class="
        cn(
          styleRendererAsSize(size),
          `absolute left-1/2 -translate-x-1/2 -bottom-[var(--gap)] w-[var(--size)] flex gap-1`
        )
      "
    >
      <!-- Bottom -->
      <div
        v-for="n in seatRendererArray[1]"
        :key="n"
        :class="cn(`h-2 w-full rounded-full`, styleRendererAsColor(color))"
      />
    </div>
    <div
      :class="
        cn(
          styleRendererAsSize(size),
          `absolute -left-[var(--gap)] top-1/2 -translate-y-1/2 h-[var(--size)] flex flex-col gap-1`
        )
      "
    >
      <!-- Left -->
      <div
        v-for="n in seatRendererArray[2]"
        :key="n"
        :class="cn(`w-2 h-full rounded-full`, styleRendererAsColor(color))"
      />
    </div>
    <div
      :class="
        cn(
          styleRendererAsSize(size),
          `absolute -right-[var(--gap)] top-1/2 -translate-y-1/2 h-[var(--size)] flex flex-col gap-1`
        )
      "
    >
      <!-- Right -->
      <div
        v-for="n in seatRendererArray[3]"
        :key="n"
        :class="cn(`w-2 h-full rounded-full`, styleRendererAsColor(color))"
      />
    </div>
    <div
      :class="
        cn(
          styleRendererAsSize(size),
          `size-[var(--size)] rounded-lg flex items-center justify-center`,
          styleRendererAsColor(color)
        )
      "
    >
      <span class="text-lg">
        <slot />
      </span>
    </div>
  </div>
</template>
