<script setup lang="ts">
import LazyImage from '@/components/img/LazyImage.vue';
import { ArrowRight } from 'lucide-vue-next';

useSeo({
  title: 'Cihazlar',
  description: 'Cihazlar',
});

definePageMeta({
  name: 'Cihazlar',
});

type ConnectionStatus = 'connected' | 'disconnected' | 'pending';

interface PaymentTerminal {
  type: string;
  name: string;
  status: ConnectionStatus;
}

const statusTextMap: Record<ConnectionStatus, string> = {
  connected: 'Bağlantı Kurulu',
  disconnected: 'Bağlı Değil',
  pending: 'Bağlantı Bekleniyor',
};

const paymentTerminals: PaymentTerminal[] = [
  {
    type: 'beko',
    name: 'Beko 400 TR',
    status: 'connected',
  },
  {
    type: 'ingenico',
    name: 'Desk/1600 TETRA',
    status: 'disconnected',
  },
  {
    type: 'verifone',
    name: 'Verifone V400c',
    status: 'pending',
  },
];
</script>

<template>
  <div>
    <div class="grid grid-cols-9 w-full h-full max-h-[calc(100vh-3rem)]">
      <div class="border-r col-span-5 max-h-full overflow-auto">
        <div class="p-4 border-b">
          <h2 class="font-semibold">Ödeme Terminalleri</h2>
        </div>
        <div class="flex flex-col border-b">
          <div
            v-for="terminal of paymentTerminals"
            :key="terminal.name"
            class="flex items-center gap-4 p-4 cursor:pointer hover:bg-secondary"
          >
            <LazyImage
              :src="`/${terminal.type}.png`"
              alt="beko"
              class="size-14"
            />
            <div class="flex flex-col">
              <span class="text-md">{{ terminal.name }}</span>
              <span class="text-sm text-muted-foreground">{{
                statusTextMap[terminal.status]
              }}</span>
            </div>
            <ArrowRight class="size-4 ml-auto mr-4" />
          </div>
        </div>
      </div>
      <div class="col-span-4">
        <div class="p-4 border-b">
          <span class="font-semibold">Cihaz Ayarları</span>
        </div>
      </div>
    </div>
  </div>
</template>
