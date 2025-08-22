<script lang="ts" setup>
import {
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from '../ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { BadgeCheck, LogOut, Shield, User2, Cog } from 'lucide-vue-next';
import shortenName from '~/lib/shortenName';

const user = useUser();
const session = useSession();
</script>

<template>
  <DropdownMenuContent side="bottom" align="end" :side-offset="4">
    <DropdownMenuLabel class="p-0 font-normal">
      <ClientOnly>
        <div
          v-if="user.data.value"
          class="flex items-center gap-2 px-1 py-1.5 text-left text-sm"
        >
          <Avatar class="h-8 w-8 rounded-lg">
            <AvatarImage
              :src="user.data.value.id"
              :alt="user.data.value.name"
            />
            <AvatarFallback class="rounded-lg">
              {{ shortenName(user.data.value.name) }}
            </AvatarFallback>
          </Avatar>
          <div class="grid flex-1 text-left text-sm leading-tight">
            <span class="truncate font-semibold">{{
              user.data.value.name
            }}</span>
            <span class="truncate text-xs">{{ user.data.value.email }}</span>
          </div>
        </div>
      </ClientOnly>
    </DropdownMenuLabel>
    <DropdownMenuSeparator />
    <DropdownMenuGroup>
      <NuxtLink to="/user">
        <DropdownMenuItem>
          <User2 />
          Hesap
        </DropdownMenuItem>
      </NuxtLink>
      <NuxtLink to="/user/subscription">
        <DropdownMenuItem>
          <BadgeCheck />
          Abonelik
        </DropdownMenuItem>
      </NuxtLink>
    </DropdownMenuGroup>
    <DropdownMenuSeparator />
    <NuxtLink to="/user/security">
      <DropdownMenuItem>
        <Shield />
        Güvenlik
      </DropdownMenuItem>
    </NuxtLink>
    <NuxtLink to="/user/preferences">
      <DropdownMenuItem>
        <Cog />
        Tercihler
      </DropdownMenuItem>
    </NuxtLink>
    <DropdownMenuSeparator />
    <DropdownMenuItem @click="session.logout()">
      <LogOut />
      Çıkış Yap
    </DropdownMenuItem>
  </DropdownMenuContent>
</template>
