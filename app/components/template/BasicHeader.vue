<script setup lang="ts">
import { Badge } from '../ui/badge';
</script>

<template>
  <div class="fixed top-0 left-0 p-8 flex w-full">
    <div>
      <span
        class="font-semibold tracking-widest text-lg flex items-center gap-2"
      >
        POSGEN
        <Badge> BETA </Badge>
      </span>
    </div>
    <div class="ml-auto flex gap-4">
      <span class="underline">Yardım</span>
      <span class="underline">İletişim</span>
    </div>
  </div>
</template>
