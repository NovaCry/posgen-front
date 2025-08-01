<script setup lang="ts">
import DataTable from '@/components/DataTable.vue';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { TableData } from '@/types/DataTable';
import { ArrowLeft } from 'lucide-vue-next';

const router = useRouter();

definePageMeta({
  name: 'Roller',
});

const permissions: TableData[] = [
  {
    'Rol Adı': 'Tam Erişim',
    Durum: [
      {
        type: 'button',
        text: 'Ret',
        variant: 'destructive',
        action() {},
      },
      {
        type: 'button',
        text: 'Onay',
        variant: 'outline',
        action() {},
      },
    ],
  },
];
</script>

<template>
  <div class="grid grid-cols-3 w-full h-full relative">
    <div
      class="absolute w-full h-full top-0 backdrop-blur-md z-1 flex items-center flex-col justify-center"
    >
      <h1 class="text-3xl font-semibold">
        Bu sayfa halen yapım aşamasında. 😭
      </h1>
      <p class="mt-1">Dilerseniz diğer sayfalara göz atabilirsiniz.</p>
      <Button class="mt-4" @click="router.back()">
        <ArrowLeft /> Geri Dön
      </Button>
    </div>
    <div class="border-r p-4 flex flex-col gap-2">
      <Label>Roller</Label>
      <div
        v-for="n in 3"
        :key="n"
        class="px-4 py-2 rounded-md hover:bg-secondary flex items-center gap-3"
      >
        <div class="rounded-full size-3 bg-sky-500" />
        <div class="text-md">Yönetici</div>
      </div>
    </div>
    <div class="col-span-2 p-4">
      <div class="grid grid-cols-4 items-center gap-4">
        <div class="col-span-3">
          <Label>Rol Adı</Label>
          <Input placeholder="örn. Garson" class="mt-1" />
        </div>
        <div class="flex flex-col gap-3">
          <Label>Renk</Label>
          <Button variant="outline" size="lg">
            <div class="size-3 rounded-full bg-sky-500" />
            #0ea5e9
          </Button>
        </div>
      </div>
      <div class="mt-8">
        <Label>Yetkiler</Label>
        <DataTable :data="permissions" />
      </div>
    </div>
  </div>
</template>
