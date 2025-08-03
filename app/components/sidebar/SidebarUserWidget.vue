<script setup lang="ts">
import { ChevronsUpDown } from 'lucide-vue-next';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { DropdownMenu, DropdownMenuTrigger } from '../ui/dropdown-menu';
import { SidebarMenuButton } from '../ui/sidebar';
import DropdownContentUser from '../dropdown/DropdownContentUser.vue';
import shortenName from '~/lib/shortenName';

const user = useUser();
</script>

<template>
  <DropdownMenu>
    <DropdownMenuTrigger as-child>
      <SidebarMenuButton
        v-if="user.data"
        size="lg"
        class="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
      >
        <Avatar class="h-8 w-8 rounded-lg">
          <AvatarImage :src="user.data.id" :alt="user.data.name" />
          <AvatarFallback class="rounded-lg">
            {{ shortenName(user.data.name) }}
          </AvatarFallback>
        </Avatar>
        <div class="grid flex-1 text-left text-sm leading-tight">
          <span class="truncate font-semibold">{{ user.data.name }}</span>
          <span class="truncate text-xs">{{ user.data.email }}</span>
        </div>
        <ChevronsUpDown class="ml-auto size-4" />
      </SidebarMenuButton>
    </DropdownMenuTrigger>
    <DropdownContentUser
      class="w-(--reka-dropdown-menu-trigger-width) min-w-56 rounded-lg"
    />
  </DropdownMenu>
</template>
