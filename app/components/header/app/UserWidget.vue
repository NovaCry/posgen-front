<script setup lang="ts">
import { useUserStore } from '@/store/user';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import DropdownContentUser from '@/components/dropdown/DropdownContentUser.vue';
import { LogIn } from 'lucide-vue-next';

const user = useUserStore();

defineProps<{
  disabled?: boolean;
}>();
</script>

<template>
  <DropdownMenu>
    <DropdownMenuTrigger :disabled="disabled">
      <Button size="icon" variant="outline" class="rounded-lg">
        <Avatar class="h-8 w-8 rounded-md bg-accent">
          <AvatarFallback v-if="user.user" class="rounded-lg">
            {{
              (user.user?.firstName || 'N')[0].toUpperCase() +
              (user.user?.lastName || 'N')[0].toUpperCase()
            }}
          </AvatarFallback>
          <AvatarFallback v-else>
            <LogIn />
          </AvatarFallback>
        </Avatar>
      </Button>
    </DropdownMenuTrigger>
    <DropdownContentUser />
  </DropdownMenu>
</template>
