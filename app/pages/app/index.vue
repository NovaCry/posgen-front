<script setup lang="ts">
import { CakeSlice, ChefHat, ShoppingBasket, AlertCircle, Loader2, WifiOff, Wifi } from 'lucide-vue-next';
import { motion, MotionConfig } from 'motion-v';
import { Avatar, AvatarFallback, AvatarImage } from '~/components/ui/avatar';
import shortenName from '~/lib/shortenName';
import { useUserStore } from '@/store/user';
const userStore = useUserStore();
import { toLocaleDate } from '~/lib/toLocaleDate';
import { toLocaleTime } from '~/lib/toLocaleTime';
import { cn } from '~/lib/utils';
import { api } from '@/app.conf.json';

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


interface HealthStatus {
  status: string;
  timestamp: string;
  uptime: string;
  uptimeRaw: number;
}

const healthStatus = ref<HealthStatus | null>(null);
const isLoading = ref(false);
const error = ref<string | null>(null);
const lastSyncTime = ref<Date | null>(null);
const syncInterval = ref<ReturnType<typeof setInterval> | null>(null);
const isSynchronized = ref(false);
const unsyncedDataCount = ref(0);

const fetchHealthStatus = async () => {
  try {
    isLoading.value = true;
    error.value = null;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);

    const response = await fetch(
      (import.meta.env.MODE === 'development' ? api.dev : api.prod) + 'health',
      {
        signal: controller.signal,
      }
    );

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    healthStatus.value = data;
    lastSyncTime.value = new Date();

    if (data.status === 'healthy') {
      isSynchronized.value = true;
      unsyncedDataCount.value = 0;
    } else {
      isSynchronized.value = false;
      unsyncedDataCount.value = 1;
    }
  } catch (err) {
    console.error('Health check failed:', err);

    if (
      typeof err === 'object' &&
      err !== null &&
      'name' in err &&
      (err as { name?: string }).name === 'AbortError'
    ) {
      error.value = 'Bağlantı zaman aşımı';
    } else {
      error.value =
        err instanceof Error ? err.message : 'Sunucuya erişilemiyor';
    }

    healthStatus.value = null;
    isSynchronized.value = false;
    unsyncedDataCount.value = Math.floor(Math.random() * 5) + 1;
  } finally {
    isLoading.value = false;
  }
};

const syncInfo = computed(() => {
  if (isLoading.value) {
    return {
      icon: Loader2,
      text: 'Kontrol ediliyor...',
      variant: 'secondary' as const,
      iconClass: 'animate-spin',
    };
  }

  if (error.value !== null) {
    return {
      icon: WifiOff,
      text: 'Sunucu erişilemez',
      variant: 'destructive' as const,
      iconClass: '',
    };
  }

  if (!isSynchronized.value) {
    return {
      icon: AlertCircle,
      text: `${unsyncedDataCount.value} senkronize olmayan veri`,
      variant: 'destructive' as const,
      iconClass: '',
    };
  }

  return {
    icon: Wifi,
    text: 'Sunucu bağlantısı aktif',
    variant: 'default' as const,
    iconClass: '',
  };
});

const startHealthCheck = () => {
  fetchHealthStatus();
  syncInterval.value = setInterval(() => {
    fetchHealthStatus();
  }, 20000);
};

const stopHealthCheck = () => {
  if (syncInterval.value) {
    clearInterval(syncInterval.value);
    syncInterval.value = null;
  }
};

onMounted(() => {
  startHealthCheck();
});

onUnmounted(() => {
  stopHealthCheck();
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
  <div
    class="fixed top-16 right-0 mr-2 z-30 flex items-center gap-2 px-3 py-1 rounded-lg shadow bg-white/80 backdrop-blur border border-gray-200"
    style="min-width: 180px;">
    <component :is="syncInfo.icon"
      :class="['h-4 w-4', syncInfo.iconClass,
        syncInfo.variant === 'destructive' ? 'text-red-500' : syncInfo.variant === 'secondary' ? 'text-yellow-500' : 'text-green-500']" />
    <span class="text-xs font-medium truncate"
      :class="syncInfo.variant === 'destructive' ? 'text-red-500' : syncInfo.variant === 'secondary' ? 'text-yellow-500' : 'text-green-500'">
      {{ syncInfo.text }}
    </span>
  </div>
  <main class="h-[calc(100vh-3rem)] grid grid-cols-1 md:grid-cols-5 xl:w-[1000px] mx-auto px-2 md:px-0">
    <div
      class="col-span-1 md:col-span-2 min-w-[200px] md:min-w-[300px] mx-auto flex my-auto h-fit flex-col min-h-[240px] md:min-h-[340px] w-full">
      <MotionConfig :transition="{ type: 'tween', duration: 0.3, ease: 'anticipate' }">
        <ClientOnly>
          <motion.span :initial="{ filter: 'blur(10px)', scale: 0.8 }" :animate="{ filter: 'blur(0px)', scale: 1 }"
            class="font-header">{{ toLocaleDate(new Date(), true) }}</motion.span>
          <motion.h1 :initial="{ filter: 'blur(10px)', scale: 0.8 }" :animate="{ filter: 'blur(0px)', scale: 1 }"
            :transition="{ delay: 0.1 }" class="text-5xl">
            {{ localTime }}
          </motion.h1>
        </ClientOnly>
        <motion.div :initial="{ filter: 'blur(10px)', scale: 0.8 }" :animate="{ filter: 'blur(0px)', scale: 1 }"
          :transition="{ delay: 0.2 }" class="py-6 flex items-center gap-2">
          <Avatar class="size-10">
            <AvatarImage src="" />
            <AvatarFallback>
              {{ shortenName((userStore.user?.firstName || '') + ' ' + (userStore.user?.lastName || '')) }}
            </AvatarFallback>
          </Avatar>
          <div>
            <span>Günaydın, {{ userStore.user?.firstName || '' }} {{ userStore.user?.lastName || '' }}.</span>
          </div>
        </motion.div>
      </MotionConfig>
    </div>
    <div
      class="col-span-1 md:col-span-3 w-full md:w-fit min-w-[200px] md:min-w-[400px] mx-auto flex flex-col min-h-[240px] md:min-h-[340px] my-auto items-center">
      <motion.div v-for="(app, index) of applications" :key="app.name" :initial="{ filter: 'blur(10px)', scale: 0.8 }"
        :animate="{ filter: 'blur(0px)', scale: 1 }" :transition="{
          type: 'tween',
          delay: 0.1 * index,
          duration: 0.3,
          ease: 'anticipate',
        }" class="w-full">
        <NuxtLink :to="app.disabled ? '' : app.path" :class="cn(
          'flex gap-2.5 items-center py-3 px-3.5 my-2 rounded-xl bg-gradient-to-r cursor-pointer to-transparent transition duration-100 delay-100',
          app.disabled
            ? 'from-zinc-600/40 opacity-50 cursor-not-allowed'
            : app.color
        )
          ">
          <component :is="app.icon" class="size-8" />
          <div>
            <span class="text-lg">{{ app.name }}</span>
          </div>
        </NuxtLink>
      </motion.div>
    </div>
  </main>
</template>
