<script setup lang="ts">
import { motion, useScroll } from 'motion-v';
import Section from '@/components/section/Section.vue';
import SectionHeading from '@/components/section/SectionHeading.vue';
import { ref } from 'vue';
import { Skeleton } from '../ui/skeleton';
import { AreaChart } from '../ui/chart-area';
import CardNextButtonArrow from '../index-card/CardNextButtonArrow.vue';
import MiniCard from '../index-card/MiniCard.vue';

let averageTotal = 0;
let averagePredicted = 0;

function randMinMax(min: number, max: number) {
  return Math.random() * (max - min) + min;
}

function createFakeChartData() {
  const res: { name: string; Toplam: number; Tahmini: number }[] = [];
  for (let i = 0; i < 6; i++) {
    const predicted = +randMinMax(4000, 5000).toFixed(2);
    averagePredicted += predicted;
    const total = +randMinMax(4000, 5000).toFixed(2);
    averageTotal += total;
    res.push({
      name: new Date(2000, i, 1).toLocaleString(navigator.language, {
        month: 'long',
      }),
      Toplam: total,
      Tahmini: predicted,
    });
  }
  averagePredicted = +(averagePredicted / 12).toFixed(2);
  averageTotal = +(averageTotal / 12).toFixed(2);
  return res;
}

const chartData = createFakeChartData();

const animationTarget = ref<HTMLElement | null>(null);
const secondAnimationTarget = ref<HTMLElement | null>(null);
const thirdAnimationTarget = ref<HTMLElement | null>(null);

const animationState = useScroll({
  target: animationTarget,
  offset: ['start end', 'start start'],
  axis: 'y',
});

const animationOpacityState = ref(0);

animationState.scrollYProgress.on('change', (l) => {
  animationOpacityState.value = Math.min(l, 0.6);
});

const secondAnimationState = useScroll({
  target: secondAnimationTarget,
  offset: ['start center', 'end end'],
});

const secondAnimationPositionState = ref(0);

secondAnimationState.scrollYProgress.on('change', (l) => {
  secondAnimationPositionState.value = 100 * (1 - l);
});

const thirdAnimationState = useScroll({
  target: secondAnimationTarget,
  offset: ['end end', 'center start'],
});

const thirdAnimationPositionState = ref(0);

thirdAnimationState.scrollYProgress.on('change', (l) => {
  thirdAnimationPositionState.value = 100 * (1 - l);
});
</script>

<template>
  <Section class="relative overflow-hidden max-w-screen">
    <SectionHeading> Detayların Ötesinde Analitikler </SectionHeading>
    <div ref="animationTarget" class="absolute z-5 left-0 h-full">
      <motion.div :style="{ opacity: animationOpacityState }" class="h-full">
        <AreaChart
          class="left-0 w-screen h-full"
          :data="chartData"
          index="name"
          :categories="['Toplam', 'Tahmini']"
          :show-legend="false"
          :show-x-axis="false"
          :show-y-axis="false"
          :show-tooltip="false"
          :margin="{ bottom: 0, left: 0, right: 0, top: 0 }"
        />
      </motion.div>
    </div>
    <div
      ref="secondAnimationTarget"
      class="grid z-10 mt-8 grid-cols-1 lg:grid-cols-2 min-h-[60vh] h-full gap-16"
    >
      <div class="flex items-center">
        <motion.div
          :style="{
            opacity: secondAnimationState.scrollYProgress,
            top: `${secondAnimationPositionState}px`,
          }"
          class="relative flex flex-col gap-4"
        >
          <div
            class="absolute left-0 h-[220px] w-[1px] bg-zinc-500 top-0 -translate-y-[60px]"
          />
          <div
            class="absolute left-0 h-[1px] w-[220px] bg-zinc-500 -translate-x-[60px]"
          />
          <div
            class="absolute right-0 h-[220px] w-[1px] bg-zinc-500 bottom-0 translate-y-[60px]"
          />
          <div
            class="absolute right-0 h-[1px] w-[220px] bg-zinc-500 bottom-0 translate-x-[60px]"
          />
          <span class="text-lg">
            Sadece hesaplanmış veriler değil, Posgen ile mümkün olabilecek her
            türü veriye ve tahminlere doğrudan, dolaysız bir şekilde kolayca ve
            boğulmadan erişin.
          </span>
          <span class="text-lg">
            Market, Kafe, Muhasebe veya Depo olsun Posgen tarafından toplanan
            her bir veriyi kategorileştirilmiş bir şekilde eğitime bile ihtiyaç
            duymadan okuyabilirsiniz.
          </span>
        </motion.div>
      </div>

      <motion.div
        :style="{
          opacity: secondAnimationState.scrollYProgress,
          top: `${secondAnimationPositionState}px`,
        }"
        class="relative"
      >
        <figure
          class="w-full h-full aspect-video bg-size-[14px_14px] bg-(image:--background-grid)"
        >
          <Skeleton class="w-full h-full" />
        </figure>
      </motion.div>
    </div>
    <div
      ref="thirdAnimationTarget"
      class="grid md:grid-cols-2 grid-cols-1 gap-4 mt-16"
    >
      <MiniCard
        :style="{
          opacity: thirdAnimationState.scrollYProgress,
          top: `${thirdAnimationPositionState}px`,
        }"
      >
        <figure class="h-16 rounded-lg">
          <div class="w-full rounded-lg h-full aspect-[4/3] bg-accent" />
        </figure>
        <div>
          <h4 class="text-lg">Verileri nasıl işlediğimizi görün</h4>
          <span class="text-muted-foreground"
            >Her eylemin yaratacağı sonucu görün.</span
          >
        </div>
        <div class="ml-auto">
          <CardNextButtonArrow :is-external="true" />
        </div>
      </MiniCard>
      <MiniCard
        :style="{
          opacity: thirdAnimationState.scrollYProgress,
          top: `${thirdAnimationPositionState}px`,
        }"
      >
        <figure class="h-16">
          <div class="w-full rounded-lg h-full aspect-[4/3] bg-accent" />
        </figure>
        <div>
          <h4 class="text-lg">Kendi profilinizi yaratın</h4>
          <span class="text-muted-foreground"
            >Analitik motorunu daha özel kılın.</span
          >
        </div>
        <div class="ml-auto">
          <CardNextButtonArrow :is-external="true" />
        </div>
      </MiniCard>
    </div>
  </Section>
</template>
