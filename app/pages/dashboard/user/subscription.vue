<script setup lang="ts">
import UpgradeSubscription from '@/components/banners/UpgradeSubscription.vue';
import Section from '@/components/layout/Section.vue';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  ArrowRight,
  CreditCard,
  Users,
  ShoppingCart,
  Calendar,
} from 'lucide-vue-next';

definePageMeta({
  name: 'Abonelik',
});

const limits = [
  {
    name: 'Satışlar',
    icon: ShoppingCart,
    usage: 50,
    current: 125,
    max: 250,
    link: '/dashboard/shop/sells',
  },
  {
    name: 'Çalışanlar',
    icon: Users,
    usage: 75,
    current: 15,
    max: 20,
    link: '/dashboard/shop/settings/employees',
  },
  {
    name: 'Adisyonlar',
    icon: CreditCard,
    usage: 30,
    current: 300,
    max: 1000,
    link: '/dashboard/shop/admissions',
  },
  {
    name: 'Raporlar',
    icon: Calendar,
    usage: 10,
    current: 5,
    max: 50,
    link: '/dashboard/shop/analytics/reports',
  },
];
</script>

<template>
  <Section>
    <h1 class="text-3xl font-semibold">Abonelik</h1>
    <div class="grid grid-cols-10 gap-6 mt-4">
      <div
        class="flex flex-col gap-4 col-span-6 bg-linear-to-br from-zinc-200 to-zinc-100 dark:from-zinc-800 dark:to-zinc-900 p-4 border rounded-lg"
      >
        <div class="flex justify-between">
          <div class="flex flex-col">
            <h2 class="text-2xl">Profesyonel</h2>
            <span class="text-3xl">1600₺/<span class="text-xl">ay</span></span>
          </div>
          <div>
            <NuxtLink
              to="/pricing"
              class="flex gap-2 items-center text-sm hover:underline"
            >
              Abonelik Detayları
              <ArrowRight class="size-4" />
            </NuxtLink>
          </div>
        </div>
        <div class="mt-auto">
          <Label class="flex mb-2"
            >Kullanım Oranı <span class="ml-auto">25%</span></Label
          >
          <Progress :model-value="25" />
        </div>
      </div>
      <UpgradeSubscription class="col-span-4" />
    </div>

    <div class="flex items-center justify-between mt-8 mb-4">
      <h2 class="text-3xl font-semibold">Limitler</h2>
      <Button variant="outline" size="sm"> Tüm Limitleri Görüntüle </Button>
    </div>

    <div class="grid grid-cols-2 gap-6">
      <Card v-for="(limit, index) in limits" :key="index" class="border">
        <CardHeader class="pb-2">
          <div class="flex items-center gap-2">
            <component :is="limit.icon" class="size-5" />
            <h3 class="text-xl font-medium">
              {{ limit.name }}
            </h3>
            <NuxtLink
              :to="limit.link"
              class="text-sm ml-auto flex gap-2 items-center hover:underline"
            >
              Daha Fazla
              <ArrowRight class="size-4" />
            </NuxtLink>
          </div>
        </CardHeader>
        <CardContent>
          <div class="flex justify-between text-sm mb-1">
            <span>{{ limit.current }} / {{ limit.max }}</span>
            <span>{{ limit.usage }}%</span>
          </div>
          <Progress class="h-2" :model-value="limit.usage" />
        </CardContent>
        <CardFooter class="pt-0 text-sm text-muted-foreground">
          <div v-if="limit.usage > 70" class="text-destructive">
            Limitinize yaklaşıyorsunuz
          </div>
          <div
            v-else-if="limit.usage > 50"
            class="text-amber-500 dark:text-amber-400"
          >
            Orta seviyede kullanım
          </div>
          <div v-else>İyi durumdasınız</div>
        </CardFooter>
      </Card>
    </div>
  </Section>
</template>
