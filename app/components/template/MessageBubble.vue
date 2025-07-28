<script setup lang="ts">
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback } from '../ui/avatar';

defineProps<{
  owned?: boolean;
  name: string;
}>();

function SummarizeName(name: string) {
  let res = '';
  for (const chunk of name.toUpperCase().split(' ')) {
    if (res.length < 4) res += chunk[0];
  }
  return res;
}

const styles = {
  owned: {
    base: 'ml-auto flex',
    inner: 'bg-primary text-primary-foreground rounded-br-sm',
  },
  default: {
    base: 'mr-auto flex flex-row-reverse',
    inner: 'bg-input/40 border rounded-bl-sm',
  },
};
</script>

<template>
  <div
    :class="
      cn(
        'gap-2 max-w-[95%] sm:max-w-[75%]',
        styles[owned ? 'owned' : 'default'].base
      )
    "
  >
    <div
      :class="
        cn(
          'p-2.5 text-sm rounded-xl',
          styles[owned ? 'owned' : 'default'].inner
        )
      "
    >
      <slot />
    </div>
    <div class="mt-auto">
      <Avatar>
        <AvatarFallback class="text-sm">
          {{ SummarizeName(name) }}
        </AvatarFallback>
      </Avatar>
    </div>
  </div>
</template>
