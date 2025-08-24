<script setup lang="ts">
import Section from '@/components/layout/Section.vue';
import { Label } from '@/components/ui/label';
import { RadioGroupItem } from '@/components/ui/radio-group';
import RadioGroup from '@/components/ui/radio-group/RadioGroup.vue';
import { useColorMode } from '@vueuse/core';
import { ref, watch } from 'vue';
import SeoMeta from '@/components/seo/SeoMeta.vue';
definePageMeta({
  name: 'Tercihler',
});

const theme = useColorMode();
const selectedTheme = ref(theme.value);

watch(selectedTheme, (v) => {
  theme.value = v;
});

const systemTheme = theme.system;
</script>

<template>
  <div>
    <SeoMeta title="Tercihler" description="Tercihler" />
    <Section>
      <h1 class="text-2xl md:text-3xl font-semibold">Tercihler</h1>
      <h2 class="text-xl md:text-2xl font-semibold mt-4 mb-2">Görünüm</h2>
      <RadioGroup v-model="selectedTheme">
        <div class="flex flex-col lg:flex-row gap-4 p-4 border rounded-lg">
          <Label for="dark" class="flex flex-col gap-2">
            <figure
              class="aspect-video w-auto h-32 border rounded-md overflow-hidden shrink"
            >
              <NuxtImg src="/svg/Dark.svg" />
            </figure>
            <div class="flex items-center gap-1">
              <RadioGroupItem id="dark" value="dark" selected />
              <span>Karanlık Tema</span>
            </div>
          </Label>
          <Label for="white" class="flex flex-col gap-2">
            <figure
              class="aspect-video w-auto h-32 border rounded-md overflow-hidden shrink"
            >
              <NuxtImg src="/svg/White.svg" />
            </figure>
            <div class="flex items-center gap-1">
              <RadioGroupItem id="white" value="white" />
              <span>Beyaz Tema</span>
            </div>
          </Label>
          <Label for="auto" class="flex flex-col gap-2">
            <figure
              class="aspect-video w-auto h-32 border rounded-md overflow-hidden shrink"
            >
              <NuxtImg v-if="systemTheme == 'dark'" src="/svg/Dark.svg" />
              <NuxtImg v-else src="/svg/White.svg" />
            </figure>
            <div class="flex items-center gap-1">
              <RadioGroupItem id="auto" value="auto" />
              <span>Sistem Teması</span>
            </div>
          </Label>
        </div>
      </RadioGroup>
    </Section>
  </div>
</template>
