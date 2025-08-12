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
import shortenName from '~/lib/shortenName';

const user = useUser();
const session = useSession();
</script>

<template>
  <DropdownMenuContent side="bottom" align="end" :side-offset="4">
    <DropdownMenuLabel class="p-0 font-normal">
      <ClientOnly>
        <div
          v-if="user.data"
          class="flex items-center gap-2 px-1 py-1.5 text-left text-sm"
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
        </div>
      </ClientOnly>
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
    <DropdownMenuItem @click="session.logout">
      <LogOut />
      Çıkış Yap
    </DropdownMenuItem>
  </DropdownMenuContent>
</template>
