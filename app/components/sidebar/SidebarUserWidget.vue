<script setup lang="ts">
import { ChevronsUpDown } from 'lucide-vue-next';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { DropdownMenu, DropdownMenuTrigger } from '../ui/dropdown-menu';
import { SidebarMenuButton } from '../ui/sidebar';
import DropdownContentUser from '../dropdown/DropdownContentUser.vue';
import { useUserStore } from '@/store/user';

const user = useUserStore();
</script>

<template>
  <DropdownMenu>
    <DropdownMenuTrigger as-child>
      <SidebarMenuButton
        size="lg"
        class="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
      >
        <Avatar class="h-8 w-8 rounded-lg">
          <AvatarImage
            :src="user.user?.id || ''"
            :alt="user.user?.firstName + ' ' + user.user?.lastName"
          />
          <AvatarFallback class="rounded-lg">
            {{
              (user.user?.firstName || 'N')[0].toUpperCase() +
              (user.user?.lastName || 'N')[0].toUpperCase()
            }}
          </AvatarFallback>
        </Avatar>
        <div class="grid flex-1 text-left text-sm leading-tight">
          <span class="truncate font-semibold">{{
            user.user?.firstName + ' ' + user.user?.lastName
          }}</span>
          <span class="truncate text-xs">{{ user.user?.email }}</span>
        </div>
        <ChevronsUpDown class="ml-auto size-4" />
      </SidebarMenuButton>
    </DropdownMenuTrigger>
    <DropdownContentUser
      class="w-(--reka-dropdown-menu-trigger-width) min-w-56 rounded-lg"
    />
  </DropdownMenu>
</template>
