<script setup lang="ts">
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-vue-next';
import { AnimatePresence, motion } from 'motion-v';
import { onUnmounted, ref } from 'vue';
import { Skeleton } from '../ui/skeleton';

let heroVerbIndex = 1;
const heroVerbs = ['POS', 'Adisyon', 'Depo', 'Mutfak', 'Muhasebe'];
const heroVerb = ref(heroVerbs[0]);

let heroInterval: undefined | NodeJS.Timeout;

onMounted(() => {
  heroInterval = setInterval(() => {
    heroVerb.value = heroVerbs[heroVerbIndex];
    heroVerbIndex += 1;
    heroVerbIndex = heroVerbIndex % heroVerbs.length;
  }, 2500);
});

onUnmounted(() => {
  clearInterval(heroInterval);
});
</script>

<template>
  <section class="grid grid-cols-1 pt-14 min-h-screen lg:grid-cols-2">
    <div class="flex gap-10 flex-col justify-center pl-8 md:pl-16">
      <h1
        class="text-5xl sm:text-6xl md:text-7xl leading-20 sm:leading-22 md:leading-24 font-semibold"
      >
        İşletmeniz için beklediğiniz
        <span class="font-header flex font-bold">
          <div layout class="relative">
            <AnimatePresence layout mode="wait">
              <motion.span
                :key="heroVerb"
                layout
                :data-verb="heroVerb"
                :initial="{ bottom: -100, opacity: 0 }"
                :animate="{ bottom: 0, opacity: 1 }"
                :exit="{ top: -100, opacity: 0 }"
                class="relative data-[verb=POS]:text-blue-600 data-[verb=Adisyon]:text-rose-500 data-[verb=Depo]:text-emerald-500 data-[verb=Mutfak]:text-amber-500 data-[verb=Muhasebe]:text-violet-500"
              >
                {{ heroVerb }}
              </motion.span>
            </AnimatePresence>
            <div
              :data-verb="heroVerb"
              class="absolute bottom-0 w-full transition duration-500 h-2 bg-foreground data-[verb=POS]:bg-blue-600 data-[verb=Adisyon]:bg-rose-500 data-[verb=Depo]:bg-emerald-500 data-[verb=Mutfak]:bg-amber-500 data-[verb=Muhasebe]:bg-violet-500"
            />
          </div>
        </span>
        çözümü.
      </h1>
      <div class="flex items-center gap-4">
        <NuxtLink to="/register">
          <Button>
            Şimdi Başla
            <ArrowRight />
          </Button>
        </NuxtLink>
        <Button variant="outline"> İletişime Geç </Button>
      </div>
    </div>
    <div
      class="relative hidden items-center justify-center lg:flex overflow-hidden pr-8 md:pr-16"
    >
      <Skeleton
        class="aspect-video lg:max-h-[430px] xl:max-h-[520px] 2xl:max-h-[768px] h-full ml-2.5 bg-accent rounded-4xl"
      ></Skeleton>
    </div>
  </section>
</template>
