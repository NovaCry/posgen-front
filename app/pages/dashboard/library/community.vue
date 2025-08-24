<script setup lang="ts">
import { Button } from '@/components/ui/button';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from '@/components/ui/carousel';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { Search } from 'lucide-vue-next';
import Autoplay from 'embla-carousel-autoplay';
import Section from '@/components/layout/Section.vue';
import SeoMeta from '@/components/seo/SeoMeta.vue';

definePageMeta({
  name: 'Topluluk',
});
</script>

<template>
  <div>
    <SeoMeta title="Topluluk" description="Topluluk" />
    <Section>
      <div class="flex items-center">
        <h1 class="text-3xl font-semibold">Topluluk</h1>
        <div class="ml-auto flex gap-4 items-center">
          <Button>Filtreler</Button>
          <div class="relative">
            <Search
              class="absolute top-1/2 left-2 -translate-y-1/2 size-4 text-muted-foreground"
            />
            <Input class="pl-7" placeholder="Toplulukta Ara..." />
          </div>
        </div>
      </div>
      <div class="mt-6">
        <h2 class="text-2xl font-semibold">Sizin için önerilenler</h2>
        <Carousel
          class="mt-4 mb-8"
          :opts="{ loop: true }"
          :plugins="[Autoplay({ stopOnInteraction: true, delay: 1000 * 3 })]"
        >
          <CarouselContent>
            <CarouselItem
              v-for="n in 9"
              :key="n"
              class="basis-1/3 relative border p-4 mx-4 rounded-lg aspect-video"
            >
              <div class="absolute bottom-4 left-4">
                <Skeleton class="w-64 h-6 mb-4" />
                <div class="flex gap-4 items-center">
                  <Skeleton class="aspect-square size-8 rounded-full" />
                  <Skeleton class="w-32 h-4" />
                </div>
              </div>
            </CarouselItem>
          </CarouselContent>
        </Carousel>
        <h2 class="text-2xl font-semibold">Popüler Kaynaklar</h2>
        <Carousel
          class="mt-4 mb-8"
          :opts="{ loop: true }"
          :plugins="[Autoplay({ delay: 1000 * 3 })]"
        >
          <CarouselContent>
            <CarouselItem
              v-for="n in 9"
              :key="n"
              class="basis-1/3 relative border p-4 mx-4 rounded-lg aspect-video"
            >
              <div class="absolute bottom-4 left-4">
                <Skeleton class="w-64 h-6 mb-4" />
                <div class="flex gap-4 items-center">
                  <Skeleton class="aspect-square size-8 rounded-full" />
                  <Skeleton class="w-32 h-4" />
                </div>
              </div>
            </CarouselItem>
          </CarouselContent>
        </Carousel>
        <h2 class="text-2xl font-semibold">Daha Fazlası</h2>
        <div class="grid grid-cols-3 gap-6 mt-4">
          <div
            v-for="n in 6"
            :key="n"
            class="relative col-span-1 w-full border p-4 rounded-lg aspect-video"
          >
            <div class="absolute bottom-4 left-4">
              <Skeleton class="w-64 h-6 mb-4" />
              <div class="flex gap-4 items-center">
                <Skeleton class="aspect-square size-8 rounded-full" />
                <Skeleton class="w-32 h-4" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </Section>
  </div>
</template>
