<script setup lang="ts">
import { ChevronsUpDown, GalleryVerticalEnd, Plus } from 'lucide-vue-next';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { SidebarMenuButton, SidebarMenuItem } from '../ui/sidebar';
import type Shop from '@/types/api/Shop';
import { useSelectedShopStore } from '@/store/shop';
import { onBeforeMount } from 'vue';

const user = useUser();
const selectedShop = useSelectedShopStore();

const emit = defineEmits(['update']);

onBeforeMount(() => {
  if (!user.data) return;
  if (!user.data.shops || user.data.shops.length === 0 || !user.data.shops[0])
    return;

  if (selectedShop.id === '') {
    selectedShop.$state = user.data.shops[0];
    selectedShop.save();
    emit('update');
  }
});

function setActiveTeam(shop: Shop) {
  selectedShop.$state = shop;
  selectedShop.save();
  emit('update');
}
</script>

<template>
  <SidebarMenuItem
    v-if="user.data"
    class="hover:bg-accent rounded-md transition duration-200"
  >
    <NuxtLink v-if="user.data.shops.length == 0" to="/create">
      <SidebarMenuButton
        size="lg"
        class="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
      >
        <div
          class="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground"
        >
          <Plus class="size-4" />
        </div>
        <div class="font-medium text-muted-foreground">Yeni Mağaza</div>
      </SidebarMenuButton>
    </NuxtLink>
    <DropdownMenu v-else>
      <DropdownMenuTrigger as-child>
        <SidebarMenuButton
          size="lg"
          class="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
        >
          <div
            class="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary text-sidebar-primary-foreground"
          >
            <GalleryVerticalEnd class="size-4 text-primary-foreground" />
          </div>
          <div class="grid flex-1 text-left text-sm leading-tight">
            <span class="truncate font-semibold">{{ selectedShop.name }}</span>
            <span class="truncate text-xs">Enterprise</span>
          </div>
          <ChevronsUpDown class="ml-auto" />
        </SidebarMenuButton>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        class="w-(--reka-dropdown-menu-trigger-width) min-w-56 rounded-lg"
        align="start"
        side="bottom"
        :side-offset="4"
      >
        <DropdownMenuLabel class="text-xs text-muted-foreground">
          Mağazalar
        </DropdownMenuLabel>
        <DropdownMenuItem
          v-for="(team, index) in user.data.shops"
          :key="team.name"
          class="gap-2 p-2"
          @click="setActiveTeam(team)"
        >
          <div
            class="flex size-6 items-center justify-center rounded-md bg-primary"
          >
            <GalleryVerticalEnd
              class="size-4 shrink-0 text-primary-foreground"
            />
          </div>
          {{ team.name }}
          <DropdownMenuShortcut>⌘{{ index + 1 }}</DropdownMenuShortcut>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <NuxtLink to="/create">
          <DropdownMenuItem class="gap-2 p-2">
            <div
              class="flex size-6 items-center justify-center rounded-md border bg-background"
            >
              <Plus class="size-4" />
            </div>
            <div class="font-medium text-muted-foreground">Yeni Mağaza</div>
          </DropdownMenuItem>
        </NuxtLink>
      </DropdownMenuContent>
    </DropdownMenu>
  </SidebarMenuItem>
</template>
