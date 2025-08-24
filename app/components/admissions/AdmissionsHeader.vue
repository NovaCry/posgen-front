<template>
  <div
    class="flex items-center justify-between mb-6 animate-in fade-in duration-500"
  >
    <div>
      <h1 class="text-2xl md:text-3xl font-semibold">Adisyonlar</h1>
      <p class="text-muted-foreground mt-1">
        Masa siparişlerini adisyon olarak görüntüleyin ve yönetin
      </p>
    </div>

    <div>
              <Select :model-value="props.filter" @update:model-value="(value: any) => value && emit('update:filter', value as 'all' | 'active')" default-value="all">
        <SelectTrigger>
          <SelectValue as-child>
            <Filter />
            Filtreler
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all"> Tümü </SelectItem>
          <SelectItem value="active"> Sadece Aktif </SelectItem>
        </SelectContent>
      </Select>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Filter } from 'lucide-vue-next';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface Props {
  filter: 'all' | 'active';
}

interface Emits {
  'update:filter': [value: 'all' | 'active'];
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();
</script>
