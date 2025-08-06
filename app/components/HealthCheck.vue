<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { Loader2, WifiOff, AlertCircle, Wifi } from 'lucide-vue-next';

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
    <div :class="['inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium',
        syncInfo.variant === 'secondary' ? 'bg-gray-200 text-gray-700' :
            syncInfo.variant === 'destructive' ? 'bg-red-100 text-red-700' :
                'bg-green-100 text-green-700']">
        <component :is="syncInfo.icon" :class="['w-4 h-4', syncInfo.iconClass]" />
        <span>{{ syncInfo.text }}</span>
    </div>
</template>