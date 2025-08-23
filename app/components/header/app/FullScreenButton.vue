<script setup lang="ts">
import { useFullscreen } from '@vueuse/core';
import { Maximize, Minimize } from 'lucide-vue-next';
import { Button } from '~/components/ui/button';

const fullscreen = useFullscreen();
</script>

<template>
  <Button
    variant="ghost"
    size="icon"
    :title="
      fullscreen.isFullscreen.value
        ? 'Tam ekrandan çık (F11)'
        : 'Tam ekran (F11)'
    "
    @click="fullscreen.toggle"
  >
    <Minimize v-if="fullscreen.isFullscreen.value" class="size-3 sm:size-4" />
    <Maximize v-else class="size-3 sm:size-4" />
  </Button>
</template>
