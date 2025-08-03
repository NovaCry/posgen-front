<script setup lang="ts">
import { CakeSlice, ChefHat, ShoppingBasket } from 'lucide-vue-next';
import { motion, MotionConfig } from 'motion-v';
import { Avatar, AvatarFallback, AvatarImage } from '~/components/ui/avatar';
import shortenName from '~/lib/shortenName';
import { toLocaleDate } from '~/lib/toLocaleDate';
import { toLocaleTime } from '~/lib/toLocaleTime';
import { cn } from '~/lib/utils';

const localTime = ref('');

let timerInterval: NodeJS.Timeout | undefined;

onMounted(() => {
  localTime.value = toLocaleTime(new Date());
  timerInterval = setInterval(() => {
    localTime.value = toLocaleTime(new Date());
  }, 1000);
});

onUnmounted(() => {
  clearInterval(timerInterval);
});

const applications = [
  {
    name: 'Cafe',
    path: '/app/cafe',
    icon: CakeSlice,
    color: 'from-red-400/10 hover:from-red-400/30',
    disabled: false,
  },
  {
    name: 'Mutfak',
    path: '/app/kitchen',
    icon: ChefHat,
    color: 'from-amber-400/10 hover:from-amber-400/30',
    disabled: true,
  },
  {
    name: 'Market',
    path: '/app/market',
    icon: ShoppingBasket,
    color: 'from-green-400/10 hover:from-green-400/30 ',
    disabled: true,
  },
];
</script>

<template>
  <main class="h-[calc(100vh-3rem)] grid grid-cols-5 xl:w-[1000px] mx-auto">
    <div
      class="col-span-2 min-w-[300px] mx-auto flex my-auto h-fit flex-col min-h-[340px]"
    >
      <MotionConfig
        :transition="{ type: 'tween', duration: 0.3, ease: 'anticipate' }"
      >
        <ClientOnly>
          <motion.span
            :initial="{ filter: 'blur(10px)', scale: 0.8 }"
            :animate="{ filter: 'blur(0px)', scale: 1 }"
            class="font-header"
            >{{ toLocaleDate(new Date(), true) }}</motion.span
          >
          <motion.h1
            :initial="{ filter: 'blur(10px)', scale: 0.8 }"
            :animate="{ filter: 'blur(0px)', scale: 1 }"
            :transition="{ delay: 0.1 }"
            class="text-5xl"
          >
            {{ localTime }}
          </motion.h1>
        </ClientOnly>
        <motion.div
          :initial="{ filter: 'blur(10px)', scale: 0.8 }"
          :animate="{ filter: 'blur(0px)', scale: 1 }"
          :transition="{ delay: 0.2 }"
          class="py-6 flex items-center gap-2"
        >
          <Avatar class="size-10">
            <AvatarImage src="" />
            <AvatarFallback>
              {{ shortenName('Eren Kaplan') }}
            </AvatarFallback>
          </Avatar>
          <div>
            <span>Günaydın, Eren Kaplan.</span>
          </div>
        </motion.div>
      </MotionConfig>
    </div>
    <div
      class="col-span-3 w-fit min-w-[400px] mx-auto flex flex-col min-h-[340px] my-auto items-center"
    >
      <motion.div
        v-for="(app, index) of applications"
        :key="app.name"
        :initial="{ filter: 'blur(10px)', scale: 0.8 }"
        :animate="{ filter: 'blur(0px)', scale: 1 }"
        :transition="{
          type: 'tween',
          delay: 0.1 * index,
          duration: 0.3,
          ease: 'anticipate',
        }"
        class="w-full"
      >
        <NuxtLink
          :to="app.disabled ? '' : app.path"
          :class="
            cn(
              'flex gap-2.5 items-center py-3 px-3.5 my-2 rounded-xl bg-gradient-to-r cursor-pointer to-transparent transition duration-100 delay-100',
              app.disabled
                ? 'from-zinc-600/40 opacity-50 cursor-not-allowed'
                : app.color
            )
          "
        >
          <component :is="app.icon" class="size-8" />
          <div>
            <span class="text-lg">{{ app.name }}</span>
          </div>
        </NuxtLink>
      </motion.div>
    </div>
  </main>
</template>
