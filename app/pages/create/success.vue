<script setup lang="ts">
import { Button } from '@/components/ui/button';
import Skeleton from '@/components/ui/skeleton/Skeleton.vue';
import { ArrowRight, ArrowUpRight } from 'lucide-vue-next';
import SeoMeta from '@/components/seo/SeoMeta.vue';
import Header from '@/components/header/index/IndexHeader.vue';

definePageMeta({
  name: 'Mağaza Oluşturuldu',
});
</script>

<template>
  <div>
    <SeoMeta title="Mağaza Oluşturuldu" description="Mağaza oluşturuldu" />
    <div class="flex items-center justify-center w-screen h-screen">
      <Header />
      <div
        class="max-w-[55%] border max-h-[90%] w-full min-h-[50%] h-auto rounded-xl p-8 flex flex-col gap-6"
      >
        <div>
          <h1 class="text-2xl font-semibold">Mağazanız Oluşturuldu!</h1>
          <p class="text-pretty text-muted-foreground">
            Posgen yardım sayfasından yönetim paneli ve uygulama hakkında detaylı
            bilgi edinebilirsiniz.
          </p>
        </div>
        <div
          class="w-[95%] mx-auto flex gap-4 py-4 px-6 hover:bg-secondary rounded-lg items-center"
        >
          <Skeleton class="size-20 rounded-lg border" />
          <div class="flex flex-col">
            <span class="text-xl font-semibold">Acme Inc.</span>
            <span>Enterprise</span>
          </div>
          <ArrowRight class="size-5 ml-auto" />
        </div>
        <div>
          <p />
        </div>
        <div class="flex w-full items-center justify-center gap-6">
          <Button size="lg">
            Yönetim Paneline Git
            <ArrowRight />
          </Button>
          <NuxtLink to="/app" target="_blank">
            <Button size="lg" variant="outline">
              Uygulamaya Git
              <ArrowUpRight />
            </Button>
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>
