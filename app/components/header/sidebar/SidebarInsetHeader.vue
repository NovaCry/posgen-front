<script lang="ts" setup>
import { ref, onMounted, onUnmounted, computed } from 'vue';
import Palette from '@/components/CommandPalette.vue';
import ReportErrorsShortcut from '@/components/dialogs/ReportErrorsDialog.vue';
import RouterAutoBreadcrumb from '@/components/RouterAutoBreadcrumb.vue';
import { Separator } from '@/components/ui/separator';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, Loader2, WifiOff, Wifi } from 'lucide-vue-next';
import { api } from '@/app.conf.json';

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
</script>

<template>
  <header
    class="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
  >
    <div class="container flex h-14 max-w-screen-2xl items-center">
      <div class="flex items-center space-x-2 lg:space-x-4">
        <SidebarTrigger class="h-8 w-8" />
        <Separator orientation="vertical" class="h-4 hidden lg:block" />
        <div class="hidden lg:block">
          <RouterAutoBreadcrumb />
        </div>
      </div>

      <div class="flex flex-1 items-center justify-end space-x-1 sm:space-x-2">
        <!-- Desktop: Badge with text -->
        <Badge
          :variant="syncInfo.variant"
          class="hidden sm:flex items-center gap-1.5 text-xs font-medium cursor-pointer hover:opacity-80 transition-opacity"
          :title="
            lastSyncTime
              ? `Son kontrol: ${lastSyncTime.toLocaleTimeString()}`
              : 'Durum kontrolü'
          "
          @click="fetchHealthStatus"
        >
          <component
            :is="syncInfo.icon"
            :class="['h-3 w-3', syncInfo.iconClass]"
          />
          <span>{{ syncInfo.text }}</span>
        </Badge>

        <!-- Mobile: Just icon button -->
        <Button
          variant="ghost"
          size="sm"
          :title="
            syncInfo.text +
            (lastSyncTime
              ? ` - Son kontrol: ${lastSyncTime.toLocaleTimeString()}`
              : '')
          "
          class="sm:hidden h-8 w-8 p-0"
          @click="fetchHealthStatus"
        >
          <component
            :is="syncInfo.icon"
            :class="[
              'h-4 w-4',
              syncInfo.iconClass,
              {
                'text-green-600': isSynchronized && !isLoading,
                'text-red-600': error !== null && !isLoading,
                'text-yellow-600':
                  !isSynchronized && error === null && !isLoading,
                'text-muted-foreground': isLoading,
              },
            ]"
          />
        </Button>

        <ReportErrorsShortcut />
        <Palette />
      </div>
    </div>
  </header>
</template>
