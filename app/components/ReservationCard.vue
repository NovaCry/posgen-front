<script setup lang="ts">
import { EllipsisVertical } from 'lucide-vue-next';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import DropdownContentReservation from '@/components/dropdown/DropdownContentReservation.vue';
import { toLocaleTime } from '@/lib/toLocaleTime';

defineProps<{
  name: string;
  start: Date;
  end: Date;
  table: number;
}>();
</script>

<template>
  <div
    class="flex border rounded-lg p-4 pl-8 relative transition hover:bg-accent cursor-pointer"
  >
    <div
      class="absolute top-1/2 left-4 -translate-y-1/2 h-full max-h-[calc(100%-2rem)] w-1 bg-primary rounded-full"
    />
    <div>
      <span class="flex items-center gap-2">
        {{ name }}
      </span>
      <span class="text-sm block">
        {{ toLocaleTime(start) }} - {{ toLocaleTime(end) }} /
        <span class="text-sm inline-block"> Masa #{{ table }} </span>
      </span>
    </div>
    <div class="ml-auto my-auto flex gap-2">
      <DropdownMenu>
        <DropdownMenuTrigger as-child>
          <Button size="icon" variant="outline">
            <EllipsisVertical />
          </Button>
        </DropdownMenuTrigger>
        <DropdownContentReservation />
      </DropdownMenu>
    </div>
  </div>
</template>
