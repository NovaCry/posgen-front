<script setup lang="ts">
import {
  ChevronDown,
  GalleryVerticalEnd,
  Plus,
  ShoppingBag,
} from 'lucide-vue-next';
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
  if (!user.data.value) return;
  if (
    !user.data.value.shops ||
    user.data.value.shops.length === 0 ||
    !user.data.value.shops[0]
  )
    return;

  if (selectedShop.id === '') {
    selectedShop.$state = user.data.value.shops[0];
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
    v-if="user.data.value"
    class="hover:bg-accent rounded-md transition duration-200"
  >
    <DropdownMenu>
      <DropdownMenuTrigger as-child>
        <SidebarMenuButton
          class="w-fit h-9 group-data-[collapsible=icon]:px-1.5!"
        >
          <div
            class="flex aspect-square size-6 items-center justify-center rounded-md bg-primary text-sidebar-primary-foreground"
          >
            <ShoppingBag class="size-4" />
          </div>
          <span class="truncate font-semibold">{{ selectedShop.name }}</span>
          <ChevronDown class="opacity-50" />
        </SidebarMenuButton>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        v-if="user.data.value"
        class="w-(--reka-dropdown-menu-trigger-width) min-w-56 rounded-lg"
        align="start"
        side="bottom"
        :side-offset="4"
      >
        <DropdownMenuLabel class="text-xs text-muted-foreground">
          Mağazalar
        </DropdownMenuLabel>
        <DropdownMenuItem
          v-for="(team, index) in user.data.value?.shops"
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
