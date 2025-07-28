<script setup lang="ts">
import { ArrowUpRight, TriangleAlert } from 'lucide-vue-next';
import { Button } from '../ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
</script>

<template>
  <Popover>
    <PopoverTrigger>
      <Button variant="outline">
        <TriangleAlert />
        Hata Bildir!
      </Button>
    </PopoverTrigger>
    <PopoverContent class="w-[400px]">
      <h2 class="text-lg font-semibold">Hatalar Var!</h2>
      <p class="text-sm mt-1">
        Geliştirme aşamasında olan Posgen'de karşılaştığınız hataları bildirerek
        bize yardımcı olabilirsiniz.
      </p>
      <div class="mt-3 flex gap-2">
        <Button>
          Hata Bildir
          <ArrowUpRight />
        </Button>
        <Button variant="outline">
          İletişime Geçin
          <ArrowUpRight />
        </Button>
      </div>
    </PopoverContent>
  </Popover>
</template>
