<script setup lang="ts">
import DataTable from '@/components/DataTable.vue';
import Section from '@/components/layout/Section.vue';
import type { TableData } from '@/types/DataTable';
import { ArrowUpFromLine, Eye, Trash } from 'lucide-vue-next';

definePageMeta({
  name: 'Bildirimler',
});

function limitString(text: string, limit: number) {
  return text.slice(0, limit) + '...';
}

const data: TableData[] = [
  {
    '': [
      {
        type: 'icon',
        component: ArrowUpFromLine,
      },
    ],
    Başlık: 'Yetkin yükseltildi!',
    Açıklama: limitString(
      'Mevcut erişim yetkin "Depo Görevlisi" rolünden "Depo Müdürü" rolüne yükseltildi.',
      42
    ),
    Gönderen: [
      {
        type: 'image',
        alt: 'AC',
        uri: '',
      },
      {
        type: 'text',
        data: 'Albert Collar',
      },
    ],
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
                text: 'Görüldü',
                icon: Eye,
                action() {},
              },
              {
                type: 'item',
                text: 'Sil',
                icon: Trash,
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
  <Section>
    <h1 class="text-3xl font-semibold">Bildirimler</h1>
    <DataTable class="mt-4" :data="data" />
  </Section>
</template>
