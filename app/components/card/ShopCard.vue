<script setup lang="ts">
import { Skeleton } from '../ui/skeleton';
</script>

<template>
  <div class="flex flex-col">
    <div class="aspect-video">
      <Skeleton class="w-full h-full" />
    </div>
    <div class="mt-4 flex gap-4 items-center">
      <div>
        <Skeleton class="size-12" />
      </div>
      <div>
        <span class="font-semibold">Acme Inc</span>
        <p class="text-sm">Enterprise</p>
      </div>
    </div>
  </div>
</template>
