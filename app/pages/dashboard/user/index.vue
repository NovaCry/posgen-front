<script setup lang="ts">
import Button from '@/components/ui/button/Button.vue';
import { Skeleton } from '@/components/ui/skeleton';

import { ArrowUpRight, Check } from 'lucide-vue-next';

import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import DatePicker from '@/components/calendar/DatePicker.vue';
import ShopCard from '@/components/card/ShopCard.vue';
import { Label } from '@/components/ui/label';

import { application } from '@/app.conf.json';
import Section from '@/components/layout/Section.vue';

definePageMeta({
  name: 'Hesap',
});
</script>

<template>
  <Section>
    <h1 class="text-3xl font-semibold">Kullanıcı Hesabı</h1>
    <div class="mt-6 grid grid-cols-2 w-full gap-6">
      <div class="flex gap-6">
        <div>
          <Skeleton class="size-40 rounded-full" />
        </div>
        <div class="flex flex-col gap-2 w-full">
          <div>
            <Label>Ad</Label>
            <Input placeholder="örn. Eren" class="mt-1" value="Eren" disabled />
          </div>
          <div>
            <Label>Soyad</Label>
            <Input
              placeholder="örn. Kaplan"
              class="mt-1"
              value="Kaplan"
              disabled
            />
          </div>
        </div>
      </div>
      <div>
        <div
          class="h-full flex flex-col border p-4 rounded-lg bg-linear-to-br from-zinc-200 to-zinc-100 dark:from-zinc-800 dark:to-zinc-900"
        >
          <div class="flex">
            <div
              class="flex p-3 bg-primary aspect-square w-fit h-fit rounded-full"
            >
              <Check class="text-background size-6" />
            </div>
            <div class="ml-4">
              <h1 class="text-lg font-semibold">Herşey Tamam!</h1>
              <p class="text-sm text-muted-foreground">
                Hesabınızın kurulumu ve güvenliği tamamlanmış bulunmakta.
              </p>
            </div>
          </div>
          <a :href="application.dev" target="_blank" class="mt-auto w-full">
            <Button class="w-full">
              Uygulamaya Git
              <ArrowUpRight />
            </Button>
          </a>
        </div>
      </div>
    </div>
    <div class="mt-6 grid grid-cols-3 gap-4 items-start">
      <div>
        <Label>Cinsiyet</Label>
        <Select>
          <SelectTrigger class="mt-1">
            <SelectValue placeholder="Cinsiyet seçiniz..." />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="male"> Erkek </SelectItem>
              <SelectItem value="female"> Kadın </SelectItem>
              <SelectItem value="other"> Belirtmek istemiyorum </SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label class="inline-block">Doğum Tarihi</Label>
        <DatePicker class="mt-1 w-full" />
      </div>
      <div>
        <Label>Biyografi</Label>
        <Input placeholder="Kısa açıklayıcı yazı giriniz..." class="mt-1" />
      </div>
    </div>
    <div class="mt-6">
      <h2 class="text-2xl font-semibold">Mağazalar</h2>
      <div class="grid grid-cols-3 mt-4 gap-6">
        <ShopCard v-for="n in 6" :key="n" />
      </div>
    </div>
  </Section>
</template>
