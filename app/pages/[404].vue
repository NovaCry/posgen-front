<script setup lang="ts">
import { ref, onMounted } from 'vue';
import Header from '@/components/template/BasicHeader.vue';
import Button from '@/components/ui/button/Button.vue';

const router = useRouter();
const isLoaded = ref(false);

onMounted(() => {
  setTimeout(() => {
    isLoaded.value = true;
  }, 100);
});

function goHome() {
  if (window.history.length > 1) {
    router.back();
  } else {
    router.push('/');
  }
}
</script>

<template>
  <div class="min-h-screen text-white overflow-hidden">
    <Header />
    <div class="absolute inset-0 overflow-hidden pointer-events-none">
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
    <div
      class="relative z-10 flex items-center justify-center min-h-[calc(100vh-80px)] px-4"
    >
      <div
        class="text-center max-w-3xl mx-auto transform transition-all duration-1000 ease-out"
        :class="
          isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
        "
      >
        <div class="relative mb-12">
          <div class="flex items-center justify-center gap-4">
            <span
              class="text-8xl md:text-9xl font-black text-white leading-none drop-shadow-2xl relative"
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
                class="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full blur-xl scale-150"
              />
              <div
                class="relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-4 shadow-2xl"
              >
                <img
                  src="/resources/infill/512x512-infill.svg"
                  alt="POSGEN Logo"
                  class="w-20 h-20 md:w-28 md:h-28 drop-shadow-lg"
                />
              </div>
            </div>
            <span
              class="text-8xl md:text-9xl font-black text-white leading-none drop-shadow-2xl relative"
            >
              4
              <div
                class="absolute inset-0 text-8xl md:text-9xl font-black text-purple-400/20 blur-sm"
              >
                4
              </div>
            </span>
          </div>
        </div>
        <h1 class="text-4xl md:text-5xl font-bold mb-6 drop-shadow-lg">
          Burada Bir Şey Yok
        </h1>
        <p class="text-gray-400 mb-5 text-lg-4 opacity-75">
          Bu sayfa belki bir zamanlar vardı, belki de hiç olmadı. Belki silindi,
          belki de görmemen gerekiyordu.<br />
          Ama endişe etme — Posgen arka planda hâlâ sessizce çalışıyor. Her
          zamanki gibi.
        </p>
        <div
          class="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Button @click="goHome"> Geri Dön </Button>
          <Button variant="outline"> Sorun Bildir </Button>
        </div>
      </div>
    </div>
  </div>
</template>
