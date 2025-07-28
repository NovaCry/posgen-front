<script setup lang="ts">
import { AlignRight } from 'lucide-vue-next';
import { Button } from '../ui/button';
import { Drawer, DrawerContent, DrawerTrigger } from '../ui/drawer';
</script>

<template>
  <Drawer>
    <DrawerTrigger>
      <Button variant="outline" size="icon">
        <AlignRight />
      </Button>
    </DrawerTrigger>
    <DrawerContent>
      <div class="flex flex-col p-8 gap-12">
        <div class="flex flex-col gap-1.5">
          <h3 class="text-lg text-muted-foreground">Temel Sayfalar</h3>
          <div class="flex flex-col gap-2.5">
            <RouterLink class="text-xl" to="/"> Ana Sayfa </RouterLink>
            <RouterLink class="text-xl" to="/"> Hizmetler </RouterLink>
            <RouterLink class="text-xl" to="/pricing">
              Ücretlendirme
            </RouterLink>
            <RouterLink class="text-xl" to="/"> Yardım </RouterLink>
            <RouterLink class="text-xl" to="/"> Hakkımızda </RouterLink>
          </div>
        </div>
        <div class="flex flex-col gap-1.5">
          <h3 class="text-lg text-muted-foreground">Hareket Alın</h3>
          <div class="flex flex-col gap-2.5">
            <RouterLink class="text-xl" to="/login"> Giriş Yap </RouterLink>
            <RouterLink class="text-xl" to="/register">
              Hemen Başla
            </RouterLink>
          </div>
        </div>
      </div>
    </DrawerContent>
  </Drawer>
</template>
