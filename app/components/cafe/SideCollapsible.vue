<script lang="ts" setup>
import { ChevronDown } from 'lucide-vue-next';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '../ui/collapsible';

defineProps<{
  title: string;
  open?: boolean;
}>();

const collapsibleOpen = defineModel('open', {
  default: true,
});
</script>

<template>
  <div class="border-b px-4 py-3">
    <Collapsible v-model:open="collapsibleOpen">
      <CollapsibleTrigger class="flex items-center w-full">
        <h3 class="text-l font-semibold">
          {{ title }}
        </h3>
        <ChevronDown class="size-4 ml-auto" />
      </CollapsibleTrigger>
      <CollapsibleContent>
        <slot />
      </CollapsibleContent>
    </Collapsible>
  </div>
</template>
