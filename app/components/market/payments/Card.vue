<script setup lang="ts">
import { ArrowRight } from 'lucide-vue-next';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
</script>

<template>
  <div class="mt-2 flex items-center gap-4">
    <Select>
      <SelectTrigger>
        <SelectValue placeholder="Terminal Seçiniz..." />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectItem value="beko_hand_b2"> Beko Hand B2 </SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
    <Button>
      Terminal Arayüzü
      <ArrowRight />
    </Button>
  </div>
</template>
