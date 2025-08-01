<script setup lang="ts">
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';

defineProps<{
  content: string;
}>();
</script>

<template>
  <Tooltip>
    <TooltipTrigger>
      <slot />
    </TooltipTrigger>
    <TooltipContent>
      <p>{{ content }}</p>
    </TooltipContent>
  </Tooltip>
</template>
