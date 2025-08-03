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
} from '@/components/ui/dropdown-menu';
import type Shop from '@/types/api/Shop';
import { useSelectedShopStore } from '@/store/shop';
import { useMagicKeys } from '@vueuse/core';
import { watch, nextTick, onMounted } from 'vue';
import createProtectedApiInterface from '@/api/protected';

const user = useUser();
const selectedShop = useSelectedShopStore();
const keys = useMagicKeys();
const protectedApiInterface = createProtectedApiInterface();

if (user.data) {
  const shopKeys =
    user.data.shops.map((_, index) => keys[`Ctrl+${index + 1}`]) || [];

  shopKeys.forEach((key, index) => {
    if (!key || !user.data) return;
    watch(key, () => {
      if (key.value && user.data && user.data.shops[index]) {
        setActiveTeam(user.data.shops[index], new Event('keyboard'));
      }
    });
  });
}

async function fetchShopDetails(shopId: string): Promise<Shop | null> {
  const response = await protectedApiInterface({
    url: `shop/${shopId}`,
    method: 'GET',
  }).catch(useErrorHandler);

  if (!response) return null;
  return response.data.shop;
}

onMounted(async () => {
  await selectedShop.load();

  if (!selectedShop.id && user.data) {
    // For employees, fetch and use their working shop
    if (user.data.role === 'EMPLOYEE' && user.data.workingId) {
      const shopDetails = await fetchShopDetails(user.data.workingId);
      if (shopDetails) {
        await setActiveTeam(shopDetails, new Event('init'));
        // Save the shop selection immediately for employees
        await selectedShop.save();
      }
    }
    // For business owners, use their first shop
    else if ((user.data.shops?.length ?? 0) > 0) {
      const firstShop = user.data.shops?.[0];
      if (firstShop) {
        await setActiveTeam(firstShop, new Event('init'));
      }
    }
  }
});

async function setActiveTeam(shop: Shop, e: Event) {
  if (selectedShop.id === shop.id) {
    console.log('Aynı mağaza zaten seçili:', shop.name);
    return;
  }

  console.log('Mağaza değiştiriliyor:', selectedShop.name, '->', shop.name);
  console.log('Seçilen shop objesi:', shop);

  selectedShop.$patch({
    id: shop.id || '',
    name: shop.name || '',
    isSuspended: shop.isSuspended || false,
    closingTime: shop.closingTime || '',
    openingTime: shop.openingTime || '',
    ownerId: shop.ownerId || '',
  });

  // Always save the shop selection
  await selectedShop.save();

  console.log('Kaydedilen shop:', {
    id: selectedShop.id,
    name: selectedShop.name,
    isSuspended: selectedShop.isSuspended,
  });

  // Only reload if this was triggered by a user action (clicking the dropdown)
  if (e.type === 'click') {
    await nextTick();
    window.location.reload();
  }
}
</script>

<template>
  <DropdownMenu>
    <DropdownMenuTrigger>
      <button
        class="inline-flex items-center hover:bg-accent border transition min-w-44 py-1 px-1 pr-2 rounded-md border-b-2 active:scale-[0.98]"
      >
        <div
          class="flex aspect-square mr-3 size-6 rounded-md items-center justify-center bg-primary text-primary-foreground"
        >
          <GalleryVerticalEnd class="size-3.5" />
        </div>
        <div class="grid flex-1 text-left text-sm leading-tight">
          <span class="truncate font-semibold">{{
            selectedShop?.name || 'Mağaza Seçin'
          }}</span>
        </div>
        <ChevronsUpDown class="ml-auto size-3.5" />
      </button>
    </DropdownMenuTrigger>
    <DropdownMenuContent
      v-if="user.data"
      class="w-(--reka-dropdown-menu-trigger-width) min-w-56 rounded-lg"
      align="start"
      side="bottom"
      :side-offset="4"
    >
      <DropdownMenuLabel class="text-xs text-muted-foreground">
        Mağazalar
      </DropdownMenuLabel>
      <DropdownMenuItem
        v-for="(shop, index) in user.data.shops"
        :key="shop.id"
        class="gap-2 p-2 cursor-pointer"
        :class="{ 'bg-accent': selectedShop.id === shop.id }"
        @click="(e) => setActiveTeam(shop, e)"
      >
        <div
          class="flex size-6 items-center justify-center rounded-md bg-primary text-primary-foreground"
        >
          <GalleryVerticalEnd class="size-4 shrink-0" />
        </div>
        <span class="flex-1">{{ shop.name }}</span>
        <DropdownMenuShortcut>⌘{{ index + 1 }}</DropdownMenuShortcut>
      </DropdownMenuItem>
      <DropdownMenuSeparator />
      <button class="w-full" @click="$router.push('/create')">
        <DropdownMenuItem class="gap-2 p-2">
          <div
            class="flex size-6 items-center justify-center rounded-md border bg-background"
          >
            <Plus class="size-4" />
          </div>
          <div class="font-medium text-muted-foreground">Yeni Mağaza</div>
        </DropdownMenuItem>
      </button>
    </DropdownMenuContent>
  </DropdownMenu>
</template>
