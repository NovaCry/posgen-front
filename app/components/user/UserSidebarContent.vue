<script setup lang="ts">
import { BadgeCheck, Cog, Shield, User2 } from 'lucide-vue-next';
import type { FunctionalComponent } from 'vue';
import type { RouteLocationRaw } from 'vue-router';

interface SidebarAnchor {
  label: string;
  icon: FunctionalComponent;
  path: RouteLocationRaw;
}

interface SidebarGroup {
  label: string;
  items: SidebarAnchor[];
}

const data: SidebarGroup[] = [
  {
    label: 'Kullanıcı',
    items: [
      {
        label: 'Hesap Detayları',
        icon: User2,
        path: '/user',
      },
      {
        label: 'Abonelik Yönetimi',
        icon: BadgeCheck,
        path: '/user/subscription',
      },
    ],
  },
  {
    label: 'Yönetim',
    items: [
      {
        label: 'Güvenlik Merkezi',
        icon: Shield,
        path: '/user/security',
      },
      {
        label: 'Tercihler',
        icon: Cog,
        path: '/user/preferences',
      },
    ],
  },
];
</script>

<template>
  <div class="flex flex-col gap-2.5 max-w-[300px]">
    <div v-for="group of data" :key="group.label" class="flex flex-col gap-2">
      <span class="text-sm text-muted-foreground">{{ group.label }}</span>
      <div class="flex flex-col gap-0">
        <NuxtLink v-for="link of group.items" :key="link.label" :to="link.path">
          <Button variant="ghost" class="w-full justify-start">
            <component :is="link.icon" />
            <span>{{ link.label }}</span>
          </Button>
        </NuxtLink>
      </div>
    </div>
  </div>
</template>
