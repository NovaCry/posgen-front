<template>
  <div class="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
    <AdmissionWidget
      :icon="Receipt"
      name="Aktif Adisyon"
      :value="stats.active.toLocaleString()"
      value-subfix="Adet"
      state="normal"
    />
    <AdmissionWidget
      :icon="Receipt"
      name="Net Gelir"
      :value="stats.netRevenue.toLocaleString()"
      value-subfix="₺"
      state="success"
    />
    <AdmissionWidget
      :icon="Receipt"
      name="Vergi Toplamı"
      :value="stats.totalTax.toLocaleString()"
      value-subfix="₺"
      state="danger"
    />
    <AdmissionWidget
      :icon="Receipt"
      name="Toplam Ciro"
      :value="stats.totalRevenue.toLocaleString()"
      value-subfix="₺"
      state="normal"
    />
  </div>
</template>

<script setup lang="ts">
import { Receipt } from 'lucide-vue-next';
import AdmissionWidget from '@/components/card/AdmissionWidget.vue';

interface Stats {
  active: number;
  netRevenue: number;
  totalTax: number;
  totalRevenue: number;
}

defineProps<{
  stats: Stats;
}>();
</script>
