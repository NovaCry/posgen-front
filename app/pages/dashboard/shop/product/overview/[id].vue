<script setup lang="ts">
import InspectableImage from '@/components/img/InspectableImage.vue';
import Render from '@/components/typography/render.vue';
import { Button } from '@/components/ui/button';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { ArrowLeft } from 'lucide-vue-next';

const router = useRouter();

definePageMeta({
  name: 'Ön Bakış',
});
</script>

<template>
  <main>
    <div class="border-b p-4 flex gap-4 items-center">
      <Button size="icon" variant="outline" @click="router.back()">
        <ArrowLeft />
      </Button>
      <h1 class="text-2xl md:text-3xl font-semibold">
        Apple Macbook Pro M4 14 inç
      </h1>
    </div>
    <div class="p-4 border-b">
      <Carousel>
        <CarouselContent>
          <CarouselItem
            v-for="n in 7"
            :key="n"
            class="md:basis-1/2 lg:basis-1/3"
          >
            <InspectableImage
              aspect="video"
              :src="`/macbook${n}.jpg`"
              alt="macbook"
            />
          </CarouselItem>
        </CarouselContent>
        <CarouselPrevious class="left-4" />
        <CarouselNext class="right-4" />
      </Carousel>
    </div>
    <div class="p-4 border-b">
      <Render />
    </div>
    <div class="p-4" />
  </main>
</template>
