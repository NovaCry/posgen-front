<script setup lang="ts">
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import DropdownContentUser from '@/components/dropdown/DropdownContentUser.vue';
import { LogIn } from 'lucide-vue-next';
import shortenName from '~/lib/shortenName';

const user = useUser();

defineProps<{
  disabled?: boolean;
}>();
</script>

<template>
  <DropdownMenu>
    <DropdownMenuTrigger :disabled="disabled">
      <Button size="icon" variant="outline" class="rounded-lg">
        <Avatar class="h-8 w-8 rounded-md bg-accent">
          <AvatarFallback v-if="user.data" class="rounded-lg">
            {{ shortenName(user.data.name) }}
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
