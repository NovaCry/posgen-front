<script setup lang="ts">
import SidebarShopWidget from '@/components/sidebar/SidebarShopWidget.vue';
import SidebarUserWidget from '@/components/sidebar/SidebarUserWidget.vue';

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';

import {
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarRail,
  SidebarTrigger,
  useSidebar,
} from '@/components/ui/sidebar';
import { ChevronRight } from 'lucide-vue-next';
import { ScrollArea } from '@/components/ui/scroll-area';
import Separator from '@/components/ui/separator/Separator.vue';
import { Button } from '@/components/ui/button';

const router = useRouter();

const sidebarUtil = useSidebar();
const sidebarState = useSidebarStore();
</script>

<template>
  <SidebarHeader
    class="border-b h-16 group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12 transition-[width,height]"
  >
    <SidebarMenu>
      <div class="flex items-center w-full gap-2">
        <SidebarShopWidget class="w-full" />
        <SidebarTrigger v-if="sidebarUtil.isMobile.value"></SidebarTrigger>
      </div>
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
                <NuxtLink :to="item.url" class="w-full">
                  <SidebarMenuButton
                    :data-active="item.url == router.currentRoute.value.path"
                    :tooltip="item.title"
                    :data-mobile="sidebarUtil.isMobile.value"
                    class="data-[mobile=true]:h-10"
                  >
                    <Icon :name="item.icon" />
                    <span>{{ item.title }}</span>
                  </SidebarMenuButton>
                </NuxtLink>
                <Separator class="h-4!" orientation="vertical" />
                <CollapsibleTrigger as-child class="">
                  <Button variant="ghost" size="sm">
                    <ChevronRight
                      class="transition-transform size-4 group-data-[state=open]/collapsible:rotate-90"
                    />
                  </Button>
                </CollapsibleTrigger>
              </div>
              <ClientOnly>
                <CollapsibleContent>
                  <SidebarMenuSub>
                    <SidebarMenuSubItem
                      v-for="subItem in item.items"
                      :key="subItem.title"
                      class="hover:bg-accent rounded-md transition duration-200"
                    >
                      <SidebarMenuSubButton
                        :data-mobile="sidebarUtil.isMobile.value"
                        class="data-[mobile=true]:h-10"
                        as-child
                      >
                        <NuxtLink
                          :to="subItem.url"
                          :data-active="
                            subItem.url == router.currentRoute.value.path
                          "
                        >
                          <span>{{ subItem.title }}</span>
                        </NuxtLink>
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                  </SidebarMenuSub>
                </CollapsibleContent>
              </ClientOnly>
            </SidebarMenuItem>
          </Collapsible>
          <SidebarMenuItem v-if="item.type == 'direct'" :key="item.title">
            <NuxtLink :to="item.url" class="w-full">
              <SidebarMenuButton
                :data-active="item.url == router.currentRoute.value.path"
                :tooltip="item.title"
                :data-mobile="sidebarUtil.isMobile.value"
                class="data-[mobile=true]:h-10"
              >
                <Icon :name="item.icon" />
                <span>{{ item.title }}</span>
              </SidebarMenuButton>
            </NuxtLink>
          </SidebarMenuItem>
          <SidebarMenuItem v-if="item.type == 'action'" :key="item.title">
            <SidebarMenuButton
              :data-mobile="sidebarUtil.isMobile.value"
              class="data-[mobile=true]:h-10"
              :tooltip="item.title"
              @click="item.action"
            >
              <Icon :name="item.icon" />
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
</template>
