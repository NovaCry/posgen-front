<script setup lang="ts">
import { ArrowRight, ArrowUpRight } from 'lucide-vue-next';

defineProps<{
  isExternal?: boolean;
}>();

const classNames =
  'size-4 relative group-hover/card:opacity-100 opacity-0 group-hover/card:left-0 -left-1.5 transition-all duration-100 delay-100';
</script>

<template>
  <component :is="isExternal ? ArrowUpRight : ArrowRight" :class="classNames" />
</template>
