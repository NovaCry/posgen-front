<script setup lang="ts">
import Header from '@/components/header/index/IndexHeader.vue';
import Button from '@/components/ui/button/Button.vue';
import { motion } from 'motion-v';

useSeo({
  title: '404 - Sayfa Bulunamadı',
  description: 'Sayfa Bulunamadı',
});

const router = useRouter();

function goHome() {
  if (window.history.length > 1) {
    router.back();
  } else {
    router.push('/');
  }
}
</script>

<template>
  <div class="h-screen text-sm overflow-hidden">
    <Header />
    <div class="absolute inset-0 mt-auto overflow-hidden pointer-events-none">
      <div
        class="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMwLTkuOTQtOC4wNi0xOC0xOC0xOFMwIDguMDYgMCAxOHM4LjA2IDE4IDE4IDE4IDE4LTguMDYgMTgtMTh6IiBmaWxsPSIjZmZmIiBmaWxsLW9wYWNpdHk9Ii4wMiIvPjwvZz48L3N2Zz4=')] opacity-20"
      />
      <div
        v-for="i in 20"
        :key="i"
        class="absolute w-1 h-1 bg-white/20 rounded-full animate-pulse"
        :style="{
          left: Math.random() * 100 + '%',
          top: Math.random() * 100 + '%',
          animationDelay: Math.random() * 3 + 's',
          animationDuration: Math.random() * 2 + 2 + 's',
        }"
      />
    </div>
    <div class="relative z-10 flex items-center justify-center px-4">
      <div class="text-center max-w-3xl mx-auto">
        <motion.div
          :initial="{ opacity: 0, bottom: -30, filter: `blur(8px)` }"
          :animate="{ opacity: 1, bottom: 0, filter: `blur(0px)` }"
          :transition="{ delay: 0.1 }"
          class="relative mb-12"
        >
          <div class="flex items-center justify-center gap-4">
            <span
              class="text-8xl md:text-9xl font-black leading-none drop-shadow-2xl relative"
            >
              4
              <div
                class="absolute inset-0 text-8xl md:text-9xl font-black text-blue-400/20 blur-sm"
              >
                4
              </div>
            </span>
            <div class="flex items-center justify-center relative">
              <div
                class="animate-pulse absolute inset-0 bg-gradient-to-r from-blue-500/40 to-purple-500/40 rounded-full blur-xl scale-150"
              />
              <div
                class="relative bg-white/10 dark:bg-black/20 border border-white/20 dark:border-gray-600/40 rounded-2xl p-4 shadow-lg"
              >
                <NuxtImg
                  src="/resources/infill/512x512-infill.svg"
                  alt="POSGEN Logo"
                  class="w-20 h-20 md:w-28 md:h-28 drop-shadow-lg"
                />
              </div>
            </div>
            <span
              class="text-8xl md:text-9xl font-black leading-none drop-shadow-2xl relative"
            >
              4
              <div
                class="absolute inset-0 text-8xl md:text-9xl font-black text-purple-400/20 blur-sm"
              >
                4
              </div>
            </span>
          </div>
        </motion.div>
        <motion.h1
          :initial="{ opacity: 0, bottom: -30, filter: `blur(8px)` }"
          :animate="{ opacity: 1, bottom: 0, filter: `blur(0px)` }"
          :transition="{ delay: 0.2 }"
          class="text-sm md:text-5xl font-bold mb-6 drop-shadow-lg relative"
        >
          Burada Bir Şey Yok
        </motion.h1>
        <motion.p
          :initial="{ opacity: 0, bottom: -30, filter: `blur(8px)` }"
          :animate="{ opacity: 1, bottom: 0, filter: `blur(0px)` }"
          :transition="{ delay: 0.3 }"
          class="text-sm mb-5 text-lg-4 opacity-75 relative"
        >
          Bu sayfa belki bir zamanlar vardı, belki de hiç olmadı. Belki silindi,
          belki de görmemen gerekiyordu.<br />
          Ama endişe etme — Posgen arka planda hâlâ sessizce çalışıyor. Her
          zamanki gibi.
        </motion.p>
        <motion.div
          :initial="{ opacity: 0, bottom: -30, filter: `blur(8px)` }"
          :animate="{ opacity: 1, bottom: 0, filter: `blur(0px)` }"
          :transition="{ delay: 0.4 }"
          class="flex flex-col sm:flex-row items-center justify-center gap-4 relative"
        >
          <Button @click="goHome"> Geri Dön </Button>
          <Button variant="outline"> Sorun Bildir </Button>
        </motion.div>
      </div>
    </div>
  </div>
</template>
