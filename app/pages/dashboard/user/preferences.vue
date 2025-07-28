<script setup lang="ts">
import Section from '@/components/layout/Section.vue';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { RadioGroupItem } from '@/components/ui/radio-group';
import RadioGroup from '@/components/ui/radio-group/RadioGroup.vue';
import { TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import Tooltip from '@/components/ui/tooltip/Tooltip.vue';
import TooltipProvider from '@/components/ui/tooltip/TooltipProvider.vue';
import { useColorMode } from '@vueuse/core';
import { ref, watch } from 'vue';

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
  <Section>
    <h1 class="text-2xl md:text-3xl font-semibold">Tercihler</h1>
    <h2 class="text-xl md:text-2xl font-semibold mt-4 mb-2">Görünüm</h2>
    <RadioGroup v-model="selectedTheme">
      <div class="flex gap-4 p-4 border rounded-lg">
        <Label for="dark" class="flex flex-col gap-2">
          <figure
            class="aspect-video w-auto h-32 border rounded-md overflow-hidden"
          >
            <img src="../../../assets/svg/Dark.svg" />
          </figure>
          <div class="flex items-center gap-1">
            <RadioGroupItem id="dark" value="dark" selected />
            <span>Karanlık Tema</span>
          </div>
        </Label>
        <Label for="white" class="flex flex-col gap-2">
          <figure
            class="aspect-video w-auto h-32 border rounded-md overflow-hidden"
          >
            <img src="../../../assets/svg/White.svg" />
          </figure>
          <div class="flex items-center gap-1">
            <RadioGroupItem id="white" value="white" />
            <span>Beyaz Tema</span>
          </div>
        </Label>
        <Label for="auto" class="flex flex-col gap-2">
          <figure
            class="aspect-video w-auto h-32 border rounded-md overflow-hidden"
          >
            <img
              v-if="systemTheme == 'dark'"
              src="../../../assets/svg/Dark.svg"
            />
            <img v-else src="../../../assets/svg/White.svg" />
          </figure>
          <div class="flex items-center gap-1">
            <RadioGroupItem id="auto" value="auto" />
            <span>Sistem Teması</span>
          </div>
        </Label>
      </div>
    </RadioGroup>
    <h2 class="text-xl md:text-2xl font-semibold mt-4 mb-2">Gizlilik</h2>
    <div class="flex flex-col gap-4">
      <p class="flex-col text-muted-foreground text-sm">
        Posgen KVKK doğrultusunda kullanıcılardan verileri işlemek için izin
        toplamak zorundadır. Sizin verdiğiniz izinler
        <RouterLink to="/" class="underline"> KVKK metnince </RouterLink>
        işlenir ve usülüne uygun bir şekilde paylaşılır.
      </p>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger class="w-fit">
            <div class="flex items-center gap-1">
              <Checkbox id="usage" checked />
              <Label for="usage"
                >Verilerimin Paylaşılmasına İzin Veriyorum</Label
              >
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <p>Verileriniz Anonim tutulur ve KVKK metnince paylaşılır.</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  </Section>
</template>
