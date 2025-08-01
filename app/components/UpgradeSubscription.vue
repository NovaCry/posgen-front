<script setup lang="ts">
import { ArrowRight } from 'lucide-vue-next';
import Button from '@/components/ui/button/Button.vue';
</script>

<template>
  <div class="bg-background border rounded-lg p-4">
    <h3 class="text-2xl font-semibold mb-1">Sınırlamalardan Kurtulun!</h3>
    <span class="mt-2 text-pretty text-sm"
      >Bugün satış temsilcimizle konuşun, size uygun bir plan yaratalım!</span
    >
    <Button class="mt-6 w-full">
      Satış Temsilcimizle Konuşun
      <ArrowRight />
    </Button>
  </div>
</template>
