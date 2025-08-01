<script setup lang="ts">
import LazyImage from '@/components/img/LazyImage.vue';
import BooleanSimplified from '@/components/input/BooleanSimplified.vue';
import InputSimplified from '@/components/input/InputSimplified.vue';
import NumberFieldSimplified from '@/components/input/NumberFieldSimplified.vue';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ChevronRight } from 'lucide-vue-next';
import { ref } from 'vue';

type deviceStatus = 'connected' | 'pending' | 'failed';

interface Device {
  id: number;
  icon: string;
  name: string;
  status: deviceStatus;
}

const deviceStatusLanguageMap: Record<deviceStatus, string> = {
  connected: 'Bağlı',
  pending: 'Bekleniyor',
  failed: 'Başarısız',
};

const devices: Device[] = [
  {
    id: 0,
    icon: '/verifone.png',
    name: 'Verifone D300',
    status: 'connected',
  },
  {
    id: 1,
    icon: '/beko.png',
    name: 'Beko Hand B2',
    status: 'pending',
  },
  {
    id: 2,
    icon: '/ingenico.png',
    name: 'Ingenico B29AHF',
    status: 'failed',
  },
];

const selectedDevice = ref<Device>(devices[0]);
</script>

<template>
  <div class="container py-6 max-h-[calc(100dvh-3rem)] h-full relative">
    <h1 class="text-3xl font-semibold">Cihazlar</h1>
    <div class="grid grid-cols-2 h-full mt-4 gap-4">
      <div class="flex flex-col gap-4">
        <div
          v-for="device of devices"
          :key="device.name"
          :data-selected="selectedDevice.id === device.id"
          class="transition flex items-center gap-4 p-4 hover:bg-secondary data-[selected=true]:bg-secondary rounded-xl border"
          @click="selectedDevice = device"
        >
          <LazyImage :src="device.icon" alt="verifone" class="size-10" />
          <div class="flex flex-col">
            <span>{{ device.name }}</span>
            <span class="text-sm text-muted-foreground">{{
              deviceStatusLanguageMap[device.status]
            }}</span>
          </div>
          <ChevronRight class="size-4 ml-auto" />
        </div>
      </div>
      <Card>
        <CardHeader>
          <CardTitle> Cihaz Ayarları </CardTitle>
          <CardDescription>
            {{ selectedDevice.name }} cihazının ayarları
          </CardDescription>
        </CardHeader>
        <CardContent class="h-full overflow-auto flex flex-col gap-4 relative">
          <InputSimplified label="Adress" placeholder="192.168.2.23" />
          <NumberFieldSimplified label="Port" :model-value="2240" />
          <InputSimplified label="Net Mask" placeholder="255.255.255.0" />
          <NumberFieldSimplified
            label="Payload Size (bytes)"
            :model-value="64"
          />
          <BooleanSimplified
            label="Network Encryption"
            placeholder="255.255.255.0"
          />
          <div>
            <Label>Compression</Label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Select Method" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none"> None </SelectItem>
                <SelectItem value="gzip"> Gzip </SelectItem>
                <SelectItem value="brotli"> Brotli </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>
    </div>
  </div>
</template>
