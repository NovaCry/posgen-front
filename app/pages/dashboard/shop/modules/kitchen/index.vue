<script setup lang="ts">
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-vue-next';

const router = useRouter();

definePageMeta({
  name: 'Mutfak Yönetimi',
});
</script>

<template>
  <div
    class="fixed inset-0 flex flex-col items-center justify-center backdrop-blur-md z-1"
  >
    <h1 class="text-3xl font-semibold text-center">
      Bu sayfa halen yapım aşamasında. 😭
    </h1>
    <p class="mt-1 text-center">
      Dilerseniz diğer sayfalara göz atabilirsiniz.
    </p>
    <Button class="mt-4 flex items-center gap-2" @click="router.back()">
      <ArrowLeft /> Geri Dön
    </Button>
  </div>
</template>
