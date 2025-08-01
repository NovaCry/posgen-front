<script setup lang="ts">
import {
  ClockArrowDown,
  ClockArrowUp,
  Eye,
  History,
  PenLine,
  X,
} from 'lucide-vue-next';
import {
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from '../ui/dropdown-menu';
</script>

<template>
  <DropdownMenuContent side="right" align="start">
    <DropdownMenuLabel> Rezervasyon </DropdownMenuLabel>
    <DropdownMenuSeparator />
    <DropdownMenuGroup>
      <DropdownMenuItem> <Eye /> Görüntüle </DropdownMenuItem>
      <DropdownMenuItem> <PenLine /> Düzenle </DropdownMenuItem>
      <DropdownMenuItem> <History /> İşlem Geçmişi </DropdownMenuItem>
    </DropdownMenuGroup>
    <DropdownMenuSeparator />
    <DropdownMenuGroup>
      <DropdownMenuItem> <ClockArrowUp /> İleri Al </DropdownMenuItem>
      <DropdownMenuItem> <ClockArrowDown /> Geri Al </DropdownMenuItem>
    </DropdownMenuGroup>
    <DropdownMenuSeparator />
    <DropdownMenuGroup>
      <DropdownMenuItem> <X /> İptal Et </DropdownMenuItem>
    </DropdownMenuGroup>
  </DropdownMenuContent>
</template>
