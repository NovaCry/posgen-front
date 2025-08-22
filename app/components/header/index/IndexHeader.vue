<script setup lang="ts">
import { Button } from '@/components/ui/button';
const session = useSession();
</script>

<template>
  <header
    class="z-50 w-full p-2.5 fixed top-0 left-0 flex items-center justify-center md:px-12 px-4"
  >
    <div
      class="h-14 bg-background/40 px-4 rounded-xl backdrop-blur-sm border max-w-[1300px] w-full flex justify-between"
    >
      <div class="flex items-center gap-6">
        <div class="flex gap-2.5 items-center">
          <img
            src="/resources/infill/512x512-infill.svg"
            alt="posgen-logo"
            class="size-8"
          />
          <NuxtLink to="/"
            ><span class="font-bold text-xl font-header">POSGEN</span></NuxtLink
          >
        </div>
        <div class="hidden gap-2.5 md:flex">
          <Button variant="ghost"> Hizmetler </Button>
          <Button variant="ghost"> Yardım </Button>
          <Button variant="ghost"> Hakkımızda </Button>
        </div>
      </div>
      <HeaderIndexHeaderUserContext v-if="session.isLoggedIn()" />
      <HeaderIndexHeaderNoUserContext v-else />
    </div>
  </header>
</template>
