<script setup lang="ts">
import type { RouteLocationRaw } from 'vue-router';
import CardNextButton from '../index-card/CardNextButton.vue';
import CardNextButtonArrow from '../index-card/CardNextButtonArrow.vue';
import { useColorMode } from '@vueuse/core';
import FooterColorMode from './FooterColorMode.vue';

interface FooterContentGroup {
  title: string;
  items: FooterContentItem[];
}

interface FooterContentItem {
  name: string;
  path: RouteLocationRaw;
}

const content: FooterContentGroup[] = [
  {
    title: 'Hızlı Erişim',
    items: [
      {
        name: 'Ana Sayfa',
        path: '/',
      },
      {
        name: 'Hizmetler',
        path: '/',
      },
      {
        name: 'Ücretlendirme',
        path: '/',
      },
      {
        name: 'Yardım',
        path: '/',
      },
      {
        name: 'Hakkımızda',
        path: '/',
      },
    ],
  },
  {
    title: 'Posgen',
    items: [
      {
        name: 'Hakkımızda',
        path: '/',
      },
      {
        name: 'İşe Alıyoruz',
        path: '/',
      },
      {
        name: 'Kurumsal',
        path: '/',
      },
      {
        name: 'İletişim',
        path: '/',
      },
    ],
  },
  {
    title: 'Sosyal',
    items: [
      {
        name: 'İletişim',
        path: '/',
      },
      {
        name: 'İnstagram',
        path: '/',
      },
      {
        name: 'Twitter',
        path: '/',
      },
      {
        name: 'Github',
        path: '/',
      },
      {
        name: 'info@posgen.app',
        path: '/',
      },
    ],
  },
  {
    title: 'Yasal',
    items: [
      {
        name: 'Hizmet Sözleşmesi',
        path: '/',
      },
      {
        name: 'KVKK Sözleşmesi',
        path: '/',
      },
      {
        name: 'Kapsam ve Telif',
        path: '/',
      },
    ],
  },
];

const colorMode = useColorMode();
</script>

<template>
  <footer class="border-t flex flex-col items-center">
    <div class="max-w-[1200px] mx-auto w-full flex flex-col gap-4 py-12 px-8">
      <div class="flex items-center gap-4">
        <ClientOnly>
          <img
            v-if="colorMode == 'dark'"
            src="/resources/white/64x64-mono-white.svg"
            alt="64x64-mono-white.svg"
            class="size-14"
          />
          <img
            v-else
            src="/resources/black/64x64-mono-black.svg"
            alt="64x64-mono-black.svg"
            class="size-14"
          />
        </ClientOnly>
      </div>
      <div class="grid grid-cols-1 gap-8 sm:grid-cols-2 my-8 md:grid-cols-4">
        <div
          v-for="group of content"
          :key="group.title"
          class="flex flex-col a:text-lg"
        >
          <span class="text-muted-foreground text-sm">{{ group.title }}</span>
          <CardNextButton
            v-for="item of group.items"
            :key="item.name"
            :to="item.path"
          >
            {{ item.name }} <CardNextButtonArrow />
          </CardNextButton>
        </div>
      </div>
    </div>
    <div class="border-t p-4 w-full">
      <div
        class="max-w-[1300px] mx-auto w-full items-center flex text-muted-foreground text-sm"
      >
        <span>
          Posgen, {{ new Date().getFullYear() }} tüm telif hakları saklıdır.
        </span>
        <FooterColorMode />
      </div>
    </div>
  </footer>
</template>
