<script setup lang="ts">
import {
  ArrowRight,
  Box,
  Images,
  Paperclip,
  ScanQrCode,
  X,
} from 'lucide-vue-next';
import { Button } from './ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import { Separator } from './ui/separator';
import TextEditor from './TextEditor.vue';

const message = ref<string>('');
</script>

<template>
  <div class="flex flex-col border rounded-4xl relative min-w-[640px] w-full">
    <div class="px-2 py-3 pb-0 flex items-center gap-2">
      <Select model-value="gpt-5">
        <SelectTrigger class="bg-transparent! border-0">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="gpt-5"> GPT-5 </SelectItem>
          <SelectItem value="gpt-4.5"> GPT-4.5 </SelectItem>
          <SelectItem value="o4"> o4 </SelectItem>
          <SelectItem value="sonnet-3.5"> Sonnet 3.5 </SelectItem>
        </SelectContent>
      </Select>
      <Separator orientation="vertical" class="h-4!" />
      <Button variant="ghost" size="sm"> <Paperclip /> Bağıntı Ekle </Button>
      <Button variant="ghost" size="sm"> <Box /> Ürünler <X /> </Button>
      <Button variant="ghost" size="sm">
        <ScanQrCode /> QR Modülü <X />
      </Button>
    </div>
    <div class="px-4 py-3 flex items-center gap-2">
      <Button size="icon" variant="outline" class="rounded-full">
        <Images />
      </Button>
      <TextEditor
        v-model="message"
        placeholder="İstediğinizi sorabilirsiniz..."
      />
      <Button class="rounded-full" size="icon" variant="outline">
        <ArrowRight />
      </Button>
    </div>
  </div>
</template>
