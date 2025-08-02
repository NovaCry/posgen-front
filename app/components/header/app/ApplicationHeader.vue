<script lang="ts" setup>
import Palette from '@/components/CommandPalette.vue';
import UserWidget from './UserWidget.vue';
import ShopWidget from './ShopWidget.vue';
import {
  ArrowLeft,
  CakeSlice,
  ChefHat,
  ShoppingBasket,
  Maximize,
  Minimize,
} from 'lucide-vue-next';
// import router from '@/router';
import {
  type FunctionalComponent,
  type VNode,
  ref,
  onMounted,
  onUnmounted,
} from 'vue';
import { useUserStore } from '@/store/user';
import { Button } from '@/components/ui/button';
import { motion } from 'motion-v';

const user = useUserStore();
const router = useRouter();

const isFullscreen = ref(false);

interface Application {
  name: string;
  icon: FunctionalComponent | VNode;
  path: string;
  bg: string;
  iconColor: string;
}

const apps: Application[] = [
  {
    name: 'Market',
    path: '/market',
    icon: ShoppingBasket,
    bg: 'bg-emerald-100 dark:bg-emerald-900/30',
    iconColor: 'text-emerald-600 dark:text-emerald-300',
  },
  {
    name: 'Kafe',
    path: '/cafe',
    icon: CakeSlice,
    bg: 'bg-rose-100 dark:bg-rose-900/30',
    iconColor: 'text-rose-600 dark:text-rose-300',
  },
  {
    name: 'Mutfak',
    path: '/kitchen',
    icon: ChefHat,
    bg: 'bg-amber-100 dark:bg-amber-800/30',
    iconColor: 'text-amber-600 dark:text-amber-300',
  },
];

const toggleFullscreen = () => {
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen();
  } else {
    document.exitFullscreen();
  }
};

const handleFullscreenChange = () => {
  isFullscreen.value = !!document.fullscreenElement;
};

const handleKeydown = (event: KeyboardEvent) => {
  if (event.key === 'F11') {
    event.preventDefault();
    toggleFullscreen();
  }
};

onMounted(() => {
  document.addEventListener('fullscreenchange', handleFullscreenChange);
  document.addEventListener('keydown', handleKeydown);
  isFullscreen.value = !!document.fullscreenElement;
});

onUnmounted(() => {
  document.removeEventListener('fullscreenchange', handleFullscreenChange);
  document.removeEventListener('keydown', handleKeydown);
});
</script>

<template>
  <header
    v-if="!router.currentRoute.value.meta.hideHeader"
    class="group w-full border-b flex shrink-0 items-center gap-1 sm:gap-2 ease-linear h-12 overflow-hidden"
  >
    <div
      class="flex items-center gap-1 sm:gap-2 w-full relative px-1 sm:px-2 min-w-0"
    >
      <motion.div layout class="flex gap-1 sm:gap-2 shrink-0">
        <motion.div
          v-if="router.currentRoute.value.path != '/'"
          layout
          :initial="{ left: -100 }"
          :animate="{ opacity: 1, left: 0 }"
          :exit="{ left: -100 }"
          class="relative"
          @click="router.back()"
        >
          <Button size="icon" variant="ghost" class="h-8 w-8 sm:h-10 sm:w-10">
            <ArrowLeft class="h-4 w-4" />
          </Button>
        </motion.div>
        <motion.div layout class="shrink-0">
          <ShopWidget />
        </motion.div>
      </motion.div>

      <Palette
        :disabled="user.requireToLogin"
        class="hidden lg:block absolute left-1/2 -translate-x-1/2 max-w-xs xl:max-w-sm"
      />

      <div class="ml-auto flex gap-1 sm:gap-2 items-center justify-center">
        <div class="hidden sm:flex gap-1">
          <button
            v-for="app of apps"
            :key="app.name"
            :data-selected="router.currentRoute.value.path == app.path"
            :class="[
              app.bg,
              'p-1 sm:p-1.5 outline-none disabled:opacity-60 disabled:cursor-not-allowed focus-visible:ring-2 data-[selected=true]:ring-2 data-[selected=true]:ring-primary transition hover:scale-105 rounded-md active:scale-95',
            ]"
            @click="router.push(app.path)"
          >
            <component
              :is="app.icon"
              :class="[app.iconColor, 'size-3 sm:size-4']"
            />
          </button>
        </div>

        <button
          :title="isFullscreen ? 'Tam ekrandan çık (F11)' : 'Tam ekran (F11)'"
          class="p-1 sm:p-1.5 outline-none disabled:opacity-60 disabled:cursor-not-allowed focus-visible:ring-2 transition hover:scale-105 rounded-md active:scale-95 bg-slate-100 dark:bg-slate-800/50 text-slate-600 dark:text-slate-300"
          @click="toggleFullscreen"
        >
          <Maximize v-if="!isFullscreen" class="size-3 sm:size-4" />
          <Minimize v-else class="size-3 sm:size-4" />
        </button>

        <div class="shrink-0">
          <UserWidget />
        </div>
      </div>
    </div>
  </header>
</template>
