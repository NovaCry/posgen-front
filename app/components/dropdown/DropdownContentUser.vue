<script lang="ts" setup>
import {
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from '../ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import {
  BadgeCheck,
  Bell,
  LogOut,
  Settings,
  Shield,
  Package,
} from 'lucide-vue-next';
import { useUserStore } from '@/store/user';

const user = useUserStore();
</script>

<template>
  <DropdownMenuContent side="bottom" align="end" :side-offset="4">
    <DropdownMenuLabel class="p-0 font-normal">
      <div class="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
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
      </div>
    </DropdownMenuLabel>
    <DropdownMenuSeparator />
    <DropdownMenuGroup>
      <NuxtLink to="/dashboard/user">
        <DropdownMenuItem>
          <BadgeCheck />
          Hesap
        </DropdownMenuItem>
      </NuxtLink>
      <NuxtLink to="/dashboard/user/subscription">
        <DropdownMenuItem>
          <Package />
          Abonelik
        </DropdownMenuItem>
      </NuxtLink>
      <NuxtLink to="/dashboard/user/notifications">
        <DropdownMenuItem>
          <Bell />
          Bildirimler
        </DropdownMenuItem>
      </NuxtLink>
    </DropdownMenuGroup>
    <DropdownMenuSeparator />
    <NuxtLink to="/dashboard/user/security">
      <DropdownMenuItem>
        <Shield />
        Güvenlik
      </DropdownMenuItem>
    </NuxtLink>
    <NuxtLink to="/dashboard/user/preferences">
      <DropdownMenuItem>
        <Settings />
        Tercihler
      </DropdownMenuItem>
    </NuxtLink>
    <DropdownMenuSeparator />
    <DropdownMenuItem @click="user.logout()">
      <LogOut />
      Çıkış Yap
    </DropdownMenuItem>
  </DropdownMenuContent>
</template>
