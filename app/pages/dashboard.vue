<template>
  <SidebarProvider v-model:open="sidebarOpenState">
    <Sidebar collapsible="icon" class="z-[5] ease-in-out">
      <SidebarContent />
    </Sidebar>
    <SidebarInset>
      <ScrollArea class="max-h-screen min-h-screen relative">
        <!-- <AnimatePresence :initial="false">
          <motion.div
            v-if="blurViewport"
            :initial="{ opacity: 0 }"
            :animate="{ opacity: 1 }"
            :exit="{ opacity: 0 }"
            :transition="{ duration: 0.1, bounce: 0 }"
            class="absolute pointer-events-none top-1/2 left-1/2 z-50 backdrop-blur-sm w-full h-full flex items-center justify-center -translate-x-1/2 -translate-y-1/2"
          >
            <Icon name="line-md:loading-loop" class="size-10" />
          </motion.div>
        </AnimatePresence> -->
        <SidebarInsetHeader />
        <NuxtPage />
      </ScrollArea>
    </SidebarInset>
  </SidebarProvider>
</template>

<script setup lang="ts">
import {
  Sidebar,
  SidebarInset,
  SidebarProvider,
} from '@/components/ui/sidebar';
import SidebarInsetHeader from '@/components/header/sidebar/SidebarInsetHeader.vue';
import { ScrollArea } from '@/components/ui/scroll-area';
import SidebarContent from '~/components/template/SidebarContent.vue';

definePageMeta({
  meta: {
    hideInBreadcrumb: true,
  },
  middleware: ['auth'],
});

useSeo({
  title: 'Yönetim Paneli',
  description: 'Posgen mağaza yönetim paneli.',
});

const sidebarState = useSidebarStore();

const sidebarOpenState = ref(sidebarState.open);

watch(sidebarOpenState, (n) => {
  sidebarState.open = n;
  sidebarState.save();
});
</script>
