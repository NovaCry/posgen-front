<script setup lang="ts">
import { cn } from '@/lib/utils';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const banknotes = [
  {
    value: 200,
    style: 'bg-indigo-700/20 hover:bg-indigo-700/50 border-violet-800',
  },
  {
    value: 100,
    style: 'bg-sky-700/20 hover:bg-sky-700/50 border-sky-800',
  },
  {
    value: 50,
    style: 'bg-amber-700/20 hover:bg-amber-700/50 border-amber-800',
  },
  {
    value: 20,
    style: 'bg-emerald-800/20 hover:bg-emerald-800/50 border-emerald-900',
  },
  {
    value: 10,
    style: 'bg-rose-900/20 hover:bg-rose-900/50 border-rose-900',
  },
  {
    value: 5,
    style: 'bg-indigo-950/20 hover:bg-indigo-950/50 border-indigo-900',
  },
];
</script>

<template>
  <div class="my-2">
    <Select default-value="try">
      <SelectTrigger>
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectItem value="try"> Türk Lirası (TRY) </SelectItem>
          <SelectItem value="eur"> Euro (EUR) </SelectItem>
          <SelectItem value="usd"> Amerikan Doları (USD) </SelectItem>
          <SelectItem value="azn"> Azerbeycan Manatı (AZN) </SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  </div>
  <div class="grid grid-cols-3 gap-4">
    <button
      v-for="banknote of banknotes"
      :key="banknote.value"
      :class="
        cn(
          `aspect-video border flex items-center cursor-pointer justify-center rounded-lg font-semibold transition`,
          banknote.style
        )
      "
    >
      {{ banknote.value }} TRY
    </button>
  </div>
</template>
