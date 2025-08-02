<script setup lang="ts">
import { useColorMode } from '@vueuse/core';
import FooterColorModeButton from './FooterColorModeButton.vue';
import { Monitor, Moon, Sun } from 'lucide-vue-next';

const colorMode = useColorMode();
</script>

<template>
  <ClientOnly>
    <div
      :data-mode="colorMode"
      class="ml-auto group/selector flex border w-fit p-1 rounded-full"
    >
      <FooterColorModeButton
        :data-active="colorMode == 'dark'"
        @click="colorMode = 'dark'"
      >
        <Moon />
      </FooterColorModeButton>
      <FooterColorModeButton
        :data-active="colorMode == 'light'"
        @click="colorMode = 'light'"
      >
        <Sun />
      </FooterColorModeButton>
      <FooterColorModeButton
        :data-active="colorMode == 'auto'"
        @click="colorMode = 'auto'"
      >
        <Monitor />
      </FooterColorModeButton>
    </div>
  </ClientOnly>
</template>
