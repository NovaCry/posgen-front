<script setup lang="ts">
import { Check, Clock3 } from 'lucide-vue-next';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Skeleton } from '../ui/skeleton';
import { Button } from '../ui/button';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import { Icon } from '@iconify/vue';
</script>

<template>
  <div class="border rounded-lg">
    <div class="p-4 px-6 flex items-center border-b">
      <div>
        <span class="flex gap-2 items-center text-xl"> <Clock3 /> 22 dk. </span>
        <span>14:32</span>
      </div>
      <div class="ml-auto flex flex-col items-end">
        <div class="text-xl">John Doe</div>
        <div class="flex gap-2 items-center">
          <Avatar class="size-8 border-2 border-background">
            <AvatarImage src="" />
            <AvatarFallback>AS</AvatarFallback>
          </Avatar>
          Adam Smitt
        </div>
      </div>
    </div>
    <div class="grid grid-cols-2 gap-3 p-4 border-b">
      <div v-for="n in 8" :key="n" class="flex items-center gap-2">
        <Skeleton class="size-10" />
        <div class="flex flex-col">
          <span>Tereyağlı İskender</span>
          <span class="text-sm">1 Adet</span>
        </div>
      </div>
    </div>
    <div class="flex p-4 w-full gap-4 items-center">
      <div class="flex items-stretch w-full">
        <Button class="h-auto rounded-r-none"> <Clock3 /> Ertele </Button>
        <Select>
          <SelectTrigger class="rounded-l-none">
            <SelectValue placeholder="Select a fruit" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Fruits</SelectLabel>
              <SelectItem value="apple"> Apple </SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
      <Button class="w-full" variant="destructive">
        <Icon icon="material-symbols:close" /> Reddet
      </Button>
      <Button class="w-full"> <Check /> Kabul Et </Button>
    </div>
  </div>
</template>
