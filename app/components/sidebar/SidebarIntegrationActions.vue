<script setup lang="ts">
import {
  LayoutDashboard,
  MoreHorizontal,
  Settings2,
  Trash2,
} from 'lucide-vue-next';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { SidebarMenuAction } from '../ui/sidebar';
</script>

<template>
  <DropdownMenu>
    <DropdownMenuTrigger as-child>
      <SidebarMenuAction show-on-hover>
        <MoreHorizontal />
      </SidebarMenuAction>
    </DropdownMenuTrigger>
    <DropdownMenuContent class="w-48 rounded-lg" side="bottom" align="end">
      <DropdownMenuItem>
        <LayoutDashboard class="text-muted-foreground" />
        <span>Entegrasyon</span>
      </DropdownMenuItem>
      <DropdownMenuItem>
        <Settings2 class="text-muted-foreground" />
        <span>Ayarlar</span>
      </DropdownMenuItem>
      <DropdownMenuSeparator />
      <DropdownMenuItem>
        <Trash2 class="text-muted-foreground" />
        <span>Kaldır</span>
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
</template>
