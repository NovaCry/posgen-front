<script setup lang="ts">
import {
  MailPlus,
  Mails,
  Plus,
  ShoppingBag,
  UserPlus2,
  Users2,
} from 'lucide-vue-next';
import type { FunctionalComponent } from 'vue';
import type { RouteLocationRaw } from 'vue-router';

interface SidebarItem {
  label: string;
  icon: FunctionalComponent;
  path: RouteLocationRaw;
}

interface SidebarGroup {
  label: string;
  content: SidebarItem[];
}

const data: SidebarGroup[] = [
  {
    label: 'Kullanıcı',
    content: [
      {
        label: 'Kullanıcılar',
        icon: Users2,
        path: '/admin/user',
      },
      {
        label: 'Yeni Kullanıcı',
        icon: UserPlus2,
        path: '/admin/user/new',
      },
    ],
  },
  {
    label: 'Davet',
    content: [
      {
        label: 'Davetler',
        icon: Mails,
        path: '/admin/invite',
      },
      {
        label: 'Yeni Davet',
        icon: MailPlus,
        path: '/admin/invite/new',
      },
    ],
  },
  {
    label: 'Mağaza',
    content: [
      {
        label: 'Mağazalar',
        icon: ShoppingBag,
        path: '/admin/shop',
      },
      {
        label: 'Yeni Mağaza',
        icon: Plus,
        path: '/admin/shop/new',
      },
    ],
  },
];
</script>

<template>
  <SidebarProvider>
    <Sidebar>
      <SidebarContent>
        <SidebarMenu>
          <SidebarGroup v-for="group of data" :key="group.label">
            <SidebarGroupLabel>
              {{ group.label }}
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenuItem v-for="item in group.content" :key="item.label">
                <NuxtLink :to="item.path">
                  <SidebarMenuButton>
                    <component :is="item.icon" />
                    <span>
                      {{ item.label }}
                    </span>
                  </SidebarMenuButton>
                </NuxtLink>
              </SidebarMenuItem>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarMenu>
      </SidebarContent>
    </Sidebar>
    <SidebarInset>
      <NuxtPage />
    </SidebarInset>
  </SidebarProvider>
</template>
