<script setup lang="ts">
import Section from '@/components/layout/Section.vue';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { BadgeCheck, Search } from 'lucide-vue-next';

definePageMeta({
  name: 'Entegrasyonlar',
});
</script>

<template>
  <Section>
    <div class="flex items-center">
      <h1 class="text-3xl font-semibold">Entegrasyonlar</h1>
      <div class="ml-auto flex gap-4 items-center">
        <Button>Filtreler</Button>
        <div class="relative">
          <Search
            class="absolute top-1/2 left-2 -translate-y-1/2 size-4 text-muted-foreground"
          />
          <Input class="pl-7" placeholder="Entegrasyonlarda Ara..." />
        </div>
      </div>
    </div>
    <div class="flex gap-4 mt-4">
      <div
        v-for="n in 2"
        :key="n"
        data-active="true"
        class="rounded-md px-3 py-1 border transition hover:bg-secondary data-[active=true]:border-none data-[active=true]:bg-primary data-[active=true]:text-primary-foreground"
      >
        <span class="text-sm">Not Active</span>
      </div>
      <div
        v-for="n in 4"
        :key="n"
        class="rounded-md px-3 py-1 border transition hover:bg-secondary data-[active=true]:border-none data-[active=true]:bg-primary data-[active=true]:text-primary-foreground"
      >
        <span class="text-sm">Not Active</span>
      </div>
    </div>
    <div class="grid grid-cols-3 gap-4 mt-4">
      <div v-for="n in 6" :key="n" class="border rounded-lg overflow-hidden">
        <div class="border-b">
          <Skeleton class="aspect-16/8 rounded-none" />
        </div>
        <div class="p-4 flex gap-3 items-center">
          <div>
            <Skeleton class="size-10" />
          </div>
          <div>
            <span class="text-md font-semibold">Yemeksepeti</span>
            <span class="text-sm text-muted-foreground flex gap-1 items-center"
              >Posgen
              <BadgeCheck class="size-4" />
            </span>
          </div>
        </div>
      </div>
    </div>
  </Section>
</template>
