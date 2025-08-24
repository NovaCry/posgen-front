<script setup lang="ts">
import DataTable from '@/components/DataTable.vue';
import PaginationSimplified from '@/components/PaginationSimplified.vue';
import { toLocaleDate } from '@/lib/toLocaleDate';
import type { TableData } from '@/types/DataTable';
import { Ban, Edit, History } from 'lucide-vue-next';

useSeo({
  title: 'Rapor İste',
  description: 'Rapor iste',
});

definePageMeta({
  name: 'Rapor İste',
});

const data: TableData[] = [
  {
    Tarih: toLocaleDate(new Date()),
    Dönem: '1. Çeyrek',
    İşlemler: [
      {
        type: 'menu',
        data: [
          {
            type: 'group',
            title: 'İşlemler',
            items: [
              {
                type: 'item',
                text: 'İşlem Geçmişi',
                icon: History,
                action() {},
              },
              {
                type: 'item',
                text: 'Düzenle',
                icon: Edit,
                action() {},
              },
              {
                type: 'item',
                text: 'Askıya Al',
                icon: Ban,
                action() {},
              },
            ],
          },
        ],
      },
    ],
  },
];
</script>

<template>
  <div>
    <div
      class="relative group-has-data-[collapsible=icon]/sidebar-wrapper:min-h-[calc(100vh-4rem)] min-h-[calc(100vh-6rem)] h-full"
    >
      <!-- <div class="absolute w-full h-full top-0 backdrop-blur-md z-1 flex items-center flex-col justify-center">
        <h1 class="text-3xl font-semibold">Bu sayfa halen yapım aşamasında. 😭</h1>
        <p class="mt-1">Dilerseniz diğer sayfalara göz atabilirsiniz.</p>
        <Button @click="router.back()" class="mt-4">
          <ArrowLeft /> Geri Dön
        </Button>
      </div> -->
      <div class="h-full relative p-6">
        <h1 class="text-3xl font-semibold">Rapor İste</h1>
        <DataTable :data="data" class="mt-6" />
        <PaginationSimplified
          class="my-4 w-full flex justify-center"
          :model-value="5"
          :total-items="100"
        />
      </div>
    </div>
  </div>
</template>
