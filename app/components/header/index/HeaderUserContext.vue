<script setup lang="ts">
import { ChevronDown } from 'lucide-vue-next';
import shortenName from '~/lib/shortenName';

const user = useUser();
</script>

<template>
  <div v-if="user.data.value" class="flex items-center">
    <DropdownMenu>
      <DropdownMenuTrigger as-child>
        <Button variant="outline" size="lg" class="px-2.5!">
          <Avatar>
            <AvatarImage src="" />
            <AvatarFallback>
              {{ shortenName(user.data.value.name) }}
            </AvatarFallback>
          </Avatar>
          <span>{{ user.data.value.name }}</span>
          <ChevronDown />
        </Button>
      </DropdownMenuTrigger>
      <DropdownContentUser />
    </DropdownMenu>
  </div>
</template>
