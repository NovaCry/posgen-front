<template>
  <div>
    <div class="flex items-center justify-center w-screen h-screen">
      <Header />
      <div
        class="grid grid-cols-9 max-w-[80%] border max-h-[90%] w-full min-h-[60%] h-auto rounded-xl overflow-hidden"
      >
        <div class="col-span-5 border-r p-6 py-8 flex flex-col gap-6">
          <h1 class="text-2xl font-semibold">Dosyaları Yükle</h1>
          <div class="flex flex-col gap-6 my-auto">
            <div class="flex gap-4 items-center">
              <div
                class="size-24 rounded-md border-dashed border-2 flex items-center justify-center flex-col"
              >
                <UploadCloud class="text-muted-foreground size-8" />
                <!-- <span class="text-sm text-muted-foreground text-center mt-2">Resim Dosyaları (8mb)</span> -->
              </div>
              <div class="flex flex-col">
                <span class="text-lg">Mağaza Logosu</span>
                <span class="text-sm">Resim Dosyaları (Max. 8MB)</span>
              </div>
            </div>
            <div>
              <span class="text-lg">Mağaza Resimleri</span>
              <Carousel class="w-[calc(100%-5rem)] mx-auto mt-2">
                <CarouselContent>
                  <CarouselItem class="basis-32">
                    <div
                      class="group aspect-square border-2 border-dashed rounded-lg hover:border-primary transition flex flex-col items-center justify-center"
                    >
                      <UploadCloud
                        class="size-6 text-muted-foreground group-hover:text-primary transition"
                      />
                    </div>
                  </CarouselItem>
                  <CarouselItem v-for="n in 7" :key="n" class="basis-32">
                    <LazyImage :src="`/macbook${n}.jpg`" alt="macbook" />
                  </CarouselItem>
                </CarouselContent>
                <CarouselPrevious />
                <CarouselNext />
              </Carousel>
            </div>
          </div>
          <Button class="w-fit ml-auto">
            Devam Et
            <ArrowRight />
          </Button>
        </div>
        <div class="col-span-4 flex">
          <Skeleton class="w-full h-full rounded-none" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import Button from '@/components/ui/button/Button.vue';
import LazyImage from '@/components/img/LazyImage.vue';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowRight, UploadCloud } from 'lucide-vue-next';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import Header from '@/components/header/index/IndexHeader.vue';

useSeo({
  title: 'Mağaza Dosyaları Yükleyin',
  description: 'Mağaza dosyaları yükleyin',
});

definePageMeta({
  name: 'Mağaza Dosyaları Yükleyin',
});
</script>
