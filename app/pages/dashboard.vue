<template>
  <SidebarProvider v-model:open="sidebarOpenState">
    <Sidebar collapsible="icon" class="z-[5]">
      <SidebarHeader
        class="border-b h-16 group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12 transition-[width,height]"
      >
        <SidebarMenu>
          <SidebarShopWidget @update="onSelectedUpdate" />
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <ScrollArea>
          <SidebarGroup v-for="group of sidebarState.data" :key="group.name">
            <SidebarGroupLabel>{{ group.name }}</SidebarGroupLabel>
            <SidebarMenu v-for="item in group.data" :key="item.title">
              <Collapsible
                v-if="item.type == 'collapsible'"
                class="group/collapsible"
              >
                <SidebarMenuItem>
                  <div class="flex items-center gap-2">
                    <RouterLink :to="item.url" class="w-full">
                      <SidebarMenuButton
                        :data-active="
                          item.url == router.currentRoute.value.path
                        "
                        :tooltip="item.title"
                      >
                        <component :is="item.icon" />
                        <span>{{ item.title }}</span>
                      </SidebarMenuButton>
                    </RouterLink>
                    <Separator class="h-4!" orientation="vertical" />
                    <CollapsibleTrigger as-child class="">
                      <Button variant="ghost" size="sm">
                        <ChevronRight
                          class="transition-transform size-4 group-data-[state=open]/collapsible:rotate-90"
                        />
                      </Button>
                    </CollapsibleTrigger>
                  </div>
                  <CollapsibleContent>
                    <SidebarMenuSub>
                      <SidebarMenuSubItem
                        v-for="subItem in item.items"
                        :key="subItem.title"
                        class="hover:bg-accent rounded-md transition duration-200"
                      >
                        <SidebarMenuSubButton as-child>
                          <RouterLink
                            :to="subItem.url"
                            :data-active="
                              subItem.url == router.currentRoute.value.path
                            "
                          >
                            <span>{{ subItem.title }}</span>
                          </RouterLink>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    </SidebarMenuSub>
                  </CollapsibleContent>
                </SidebarMenuItem>
              </Collapsible>
              <SidebarMenuItem v-if="item.type == 'direct'" :key="item.title">
                <RouterLink :to="item.url" class="w-full">
                  <SidebarMenuButton
                    :data-active="item.url == router.currentRoute.value.path"
                    :tooltip="item.title"
                  >
                    <component :is="item.icon" />
                    <span>{{ item.title }}</span>
                  </SidebarMenuButton>
                </RouterLink>
              </SidebarMenuItem>
              <SidebarMenuItem v-if="item.type == 'action'" :key="item.title">
                <SidebarMenuButton :tooltip="item.title" @click="item.action">
                  <component :is="item.icon" />
                  <span>{{ item.title }}</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroup>
        </ScrollArea>
      </SidebarContent>
      <SidebarFooter class="border-t">
        <SidebarMenu>
          <SidebarMenuItem
            class="hover:bg-accent rounded-md transition duration-200"
          >
            <SidebarUserWidget />
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
    <SidebarInset>
      <ScrollArea
        :no-scroll="blurViewport"
        class="max-h-screen min-h-screen relative"
      >
        <AnimatePresence :initial="false">
          <motion.div
            v-if="blurViewport"
            :initial="{ opacity: 0 }"
            :animate="{ opacity: 1 }"
            :exit="{ opacity: 0 }"
            :transition="{ duration: 0.2, bounce: 0 }"
            class="absolute pointer-events-none top-1/2 left-1/2 z-50 backdrop-blur-sm w-full h-full flex items-center justify-center -translate-x-1/2 -translate-y-1/2"
          >
            <Loader2 class="animate-spin size-8" />
          </motion.div>
        </AnimatePresence>
        <SidebarInsetHeader />
        <RouterView />
      </ScrollArea>
    </SidebarInset>
  </SidebarProvider>
</template>

<script setup lang="ts">
import { AnimatePresence, motion } from 'motion-v';

import SidebarShopWidget from '@/components/sidebar/SidebarShopWidget.vue';
import SidebarUserWidget from '@/components/sidebar/SidebarUserWidget.vue';

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarProvider,
  SidebarRail,
} from '@/components/ui/sidebar';
import { ChevronRight, Loader2 } from 'lucide-vue-next';
import SidebarInsetHeader from '@/components/sidebar/SidebarInsetHeader.vue';
import { useSidebarStore } from '@/store/sidebar';
import { useUserStore } from '@/store/user';
import { onBeforeMount, ref, watch } from 'vue';
import { ScrollArea } from '@/components/ui/scroll-area';
import Separator from '@/components/ui/separator/Separator.vue';
import { Button } from '@/components/ui/button';

const router = useRouter();

definePageMeta({
  meta: {
    hideInBreadcrumb: true,
  },
});

const user = useUserStore();
const sidebarState = useSidebarStore();

const blurViewport = ref(false);

const sidebarOpenState = ref(sidebarState.open);

router.beforeResolve(async (to, from, next) => {
  if ((await user.requireToLogin()) && !to.meta.dontAuthorize) next('/login');
  else next();
});

onBeforeMount(async () => {
  if (await user.requireToLogin()) router.push('/login');
});

watch(sidebarOpenState, (n) => {
  sidebarState.open = n;
  sidebarState.save();
});

function onSelectedUpdate() {
  blurViewport.value = true;
  setTimeout(() => {
    blurViewport.value = false;
  }, 2000);
}
</script>
