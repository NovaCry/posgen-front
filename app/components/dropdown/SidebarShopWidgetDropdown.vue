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
import type Shop from '@/types/api/Shop';
import type { PropType } from 'vue';
import { Button } from '../ui/button';
import { Separator } from '../ui/separator';

defineProps<{
  shops: Shop[];
}>();

const selectedModel = defineModel('selected', {
  type: Object as PropType<Shop>,
});
</script>

<template>
  <DropdownMenu>
    <DropdownMenuTrigger as-child>
      <Button
        variant="outline"
        class="flex h-14 items-center min-w-[280px] px-2 justify-between data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
      >
        <div
          class="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary text-sidebar-primary-foreground"
        >
          <GalleryVerticalEnd class="size-4 text-primary-foreground" />
        </div>
        <div class="grid flex-1 text-left text-sm leading-tight">
          <span class="truncate font-semibold">{{ selected?.name }}</span>
          <span class="text-xs text-muted-foreground">Enterprise</span>
        </div>
        <Separator orientation="vertical" class="h-6! mx-1" />
        <ChevronsUpDown class="ml-auto" />
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent
      class="w-(--reka-dropdown-menu-trigger-width) min-w-56 rounded-lg"
      align="center"
      side="top"
      :side-offset="4"
    >
      <DropdownMenuLabel class="text-xs text-muted-foreground">
        Mağazalar
      </DropdownMenuLabel>
      <DropdownMenuItem
        v-for="(team, index) in shops"
        :key="team.name"
        class="gap-2 p-2"
        @click="selectedModel = team"
      >
        <div
          class="flex size-6 items-center justify-center rounded-md bg-primary"
        >
          <GalleryVerticalEnd class="size-4 shrink-0 text-primary-foreground" />
        </div>
        {{ team.name }}
        <DropdownMenuShortcut>⌘{{ index + 1 }}</DropdownMenuShortcut>
      </DropdownMenuItem>
      <DropdownMenuSeparator />
      <DropdownMenuItem class="gap-2 p-2">
        <div
          class="flex size-6 items-center justify-center rounded-md border bg-background"
        >
          <Plus class="size-4" />
        </div>
        <div class="font-medium text-muted-foreground">Yeni Mağaza</div>
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
</template>
