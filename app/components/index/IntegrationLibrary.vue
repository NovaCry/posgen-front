<script setup lang="ts">
import { onUnmounted, ref } from 'vue';
import Section from '@/components/section/Section.vue';
import SectionHeading from '@/components/section/SectionHeading.vue';
import { AnimatePresence, motion } from 'motion-v';
import { Separator } from '../ui/separator';
import { ArrowRight } from 'lucide-vue-next';
import { Button } from '../ui/button';

interface Integration {
  image: string;
  name: string;
}

const images: Integration[] = [
  {
    image: '/assets/dhl-e-commerse-256.png',
    name: 'DHL E-Commerce',
  },
  {
    image: '/assets/edenred-icon-filled-256.png',
    name: 'Edenred',
  },
  {
    image: '/assets/gib-400.jpg',
    name: 'Gib E-Ticaret',
  },
  {
    image: '/assets/google-ads-icon-filled-256.png',
    name: 'Google Ads',
  },
  {
    image: '/assets/hepsiburada-icon-filled-256.png',
    name: 'Hepsiburada',
  },
  {
    image: '/assets/multinet-256.jpg',
    name: 'Multinet',
  },
  {
    image: '/assets/trendyol-256.webp',
    name: 'Trendyol',
  },
  {
    image: '/assets/yemeksepeti-256.jpg',
    name: 'Yemeksepeti',
  },
];

const viewport = ref<Integration[]>([]);
let viewportPosition = 0;

function fillViewport() {
  viewport.value = images.filter((n, i) => i < 5).reverse();
}

function iterateViewport() {
  const newImage: Integration[] = [];
  for (let i = 0; i < 5; i++) {
    const iterated = images[(i + viewportPosition) % images.length];
    if (!iterated) continue;
    newImage.push(iterated);
  }
  viewport.value = newImage.reverse();
  viewportPosition = (viewportPosition + 1) % images.length;
}

fillViewport();

let interval: undefined | NodeJS.Timeout;

onMounted(() => {
  interval = setInterval(() => {
    iterateViewport();
  }, 1000);
});

onUnmounted(() => {
  clearInterval(interval);
});
</script>

<template>
  <Section>
    <SectionHeading> Entegrasyon Kütüphanesi </SectionHeading>
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-6 h-full mt-8">
      <div>
        <h2 class="text-4xl">En kolay dijitalleşme</h2>
        <div class="flex flex-col gap-4 mt-8">
          <p>
            Posgen, açık geliştirilebilir sistemi sayesinde her geçen gün
            entegrasyon kütüphanesine yenilerini katmakta ve siz
            kullanıcılarımıza daha zengin yönetim araçları sunmaktayız.
          </p>
          <p>
            Amacımız kullanıcılarımızın sorunsuz bir şekilde mevcuttaki işlerini
            tek bir platform üzerinden yönetebilmeleri ve genişletebilmeleri,
            bunun için çok çalışmaktayız.
          </p>
        </div>
        <div class="mt-8">
          <Button variant="outline" class="group/card relative w-fit">
            Entegrasyon Kütüphanesi <ArrowRight />
          </Button>
        </div>
      </div>
      <div class="grid-cols-5 w-full items-center hidden sm:grid">
        <AnimatePresence mode="popLayout">
          <motion.div
            v-for="(image, index) of viewport"
            :key="image.image"
            layout
            :animate="{ opacity: 1 }"
            :exit="index == viewport.length - 1 ? { scale: 0, opacity: 0 } : {}"
            class="flex"
          >
            <motion.div layout>
              <motion.figure
                layout
                class="size-8 sm:w-20 sm:h-auto aspect-square border rounded-xl overflow-hidden relative"
              >
                <img :src="image.image" :alt="image.name" />
              </motion.figure>
            </motion.div>
            <motion.div
              v-if="index >= 0 && index < viewport.length - 1"
              layout
              class="mx-4 my-auto h-12"
            >
              <Separator class="" orientation="vertical" />
            </motion.div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  </Section>
</template>
