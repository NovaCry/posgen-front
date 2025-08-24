<script lang="ts" setup>
import Palette from '@/components/CommandPalette.vue';
import ReportErrorsShortcut from '@/components/dialogs/ReportErrorsDialog.vue';
import RouterAutoBreadcrumb from '@/components/RouterAutoBreadcrumb.vue';
import { Separator } from '@/components/ui/separator';
import { SidebarTrigger, useSidebar } from '@/components/ui/sidebar';
import SidebarConnectivityIndicator from './SidebarConnectivityIndicator.vue';
import FullScreenButton from '../app/FullScreenButton.vue';
const sidebar = useSidebar();
</script>

<template>
  <header
    :data-collapsible="sidebar.state.value"
    class="sticky top-0 z-50 w-full border-b h-12 px-2 md:h-14 flex items-center p-2 md:px-4 transition-all duration-150 data-[collapsible=collapsed]:h-14 data-[collapsible=collapsed]:px-2 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
  >
    <div class="container flex h-14 max-w-screen-2xl items-center">
      <div class="flex items-center space-x-2 lg:space-x-2">
        <SidebarTrigger class="h-8 w-8" />
        <Separator orientation="vertical" class="h-4! mr-4 hidden lg:block" />
        <div class="hidden lg:block">
          <RouterAutoBreadcrumb />
        </div>
      </div>

      <div class="flex flex-1 items-center justify-end space-x-1 sm:space-x-2">
        <TooltipProvider>
          <ClientOnly>
            <SidebarConnectivityIndicator />
            <ReportErrorsShortcut />
            <TooltipSimplified content="Tam Ekranı ayarla">
              <FullScreenButton />
            </TooltipSimplified>
          </ClientOnly>
          <Palette />
        </TooltipProvider>
      </div>
    </div>
  </header>
</template>
