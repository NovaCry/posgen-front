<script setup lang="ts">
import { cn } from '@/lib/utils';
import type { Endpoint, Method } from '@/types/Endpoint';
import { Lock } from 'lucide-vue-next';

defineProps<{
  endpoint: Endpoint;
}>();

const endpointColorMapping: Record<Method, string> = {
  DELETE: 'dark:bg-red-500 bg-red-600 text-white',
  GET: 'dark:bg-blue-500 bg-blue-600 text-white',
  OPTIONS: 'dark:bg-gray-500 bg-gray-600 text-white',
  PATCH: 'dark:bg-violet-500 bg-violet-600 text-white',
  POST: 'dark:bg-orange-500 bg-orange-600 text-white',
  PUT: 'dark:bg-yellow-500 bg-yellow-600 text-white',
};
</script>

<template>
  <div class="rounded-lg border p-1.5 flex items-center gap-1.5 w-fit pr-2.5">
    <div
      :class="
        cn(
          'inline p-1 text-xs rounded-md px-1.5',
          endpointColorMapping[endpoint.method]
        )
      "
    >
      {{ endpoint.method }}
    </div>
    <span class="whitespace-nowrap text-sm">{{ endpoint.url }}</span>
    <Lock v-if="endpoint.locked" class="size-3" />
  </div>
</template>
