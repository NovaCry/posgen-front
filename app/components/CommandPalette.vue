<script lang="ts" setup>
import { useMagicKeys } from '@vueuse/core';
import { ref, watch } from 'vue';
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { ArrowRight, Search } from 'lucide-vue-next';
import type { Command, CommandGroup as ICommandGroup } from '@/types/Palette';
import { useSidebarStore } from '~/store/sidebar';

const router = useRouter();

const user = useUser();
const open = ref(false);

const { Meta_K, Ctrl_K } = useMagicKeys({
  passive: false,
  onEventFired(e) {
    if (e.key === 'k' && (e.metaKey || e.ctrlKey)) e.preventDefault();
  },
});

watch([Meta_K, Ctrl_K], (v) => {
  if (v[0] || v[1]) handleOpenChange();
});

function handleOpenChange() {
  open.value = !open.value;
}

const sidebarState = useSidebarStore();

let groups: ICommandGroup[] = [];

const addionalGroups: ICommandGroup[] = [
  {
    title: 'Ayarlar',
    commands: [
      {
        type: 'link',
        id: 'security',
        icon: 'lucide:shield',
        name: 'Güvenlik',
        href: '/dashboard/user/security',
      },
      {
        type: 'link',
        id: 'account',
        icon: 'lucide:settings',
        name: 'Tercihler',
        href: '/dashboard/user/preferences',
      },
    ],
  },
  {
    title: 'Kullanıcı',
    commands: [
      {
        type: 'link',
        id: 'account',
        icon: 'lucide:badge-check',
        name: 'Hesap',
        href: '/dashboard/user',
      },
      {
        type: 'link',
        id: 'notifications',
        icon: 'lucide:bell',
        name: 'Bildirimler',
        href: '/dashboard/user/notifications',
      },
      {
        type: 'action',
        id: 'logout',
        icon: 'lucide:log-out',
        name: 'Çıkış Yap',
        action: user.logout,
      },
    ],
  },
];

function sidebarDataToCommand() {
  for (const group of sidebarState.data) {
    const groupData: Command[] = [];
    for (const item of group.data) {
      if (item.type == 'collapsible') {
        let computed: Command[] = [];
        computed.push({
          id: item.title.toLowerCase(),
          type: 'link',
          href: item.url,
          name: item.title,
          icon: item.icon,
        } as Command);
        computed = computed.concat(
          item.items.map((subItem) => {
            return {
              type: 'link',
              name: subItem.title,
              href: subItem.url,
              id: subItem.title.toLowerCase(),
              icon: subItem.icon,
            } as Command;
          })
        );
        groups.push({
          title: item.title,
          commands: computed,
        });
      }
      if (item.type == 'direct') {
        groupData.push({
          id: item.title.toLowerCase(),
          type: 'link',
          href: item.url,
          name: item.title,
          icon: item.icon,
        } as Command);
      }
    }
    if (groupData.length > 0) {
      groups.push({
        title: group.name,
        commands: groupData,
      });
    }
  }
  groups = groups.concat(addionalGroups);
}

sidebarDataToCommand();

function HandleSelection(command: Command) {
  if (command.type == 'link') router.push(command.href);
  else command.action();
  handleOpenChange();
}
</script>

<template>
  <!-- Desktop/Tablet View -->
  <div class="hidden sm:block min-w-64 w-auto max-w-[35%]">
    <button
      class="border rounded-md flex items-center gap-2 px-2 w-full py-1.5 transition hover:bg-secondary cursor-pointer"
      @click="handleOpenChange"
    >
      <Search class="text-muted-foreground size-4" />
      <p class="text-sm text-muted-foreground">Posgen'de arayın...</p>
      <kbd
        class="ml-auto pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100"
      >
        <span class="text-xs">⌘</span>K
      </kbd>
    </button>
  </div>

  <!-- Mobile View - Just Icon -->
  <div class="sm:hidden">
    <button
      class="h-8 w-8 p-0 flex items-center justify-center rounded-md hover:bg-secondary cursor-pointer"
      title="Posgen'de arayın... (⌘K)"
      @click="handleOpenChange"
    >
      <Search class="text-muted-foreground size-4" />
    </button>
  </div>

  <!-- Command Dialog - Same for all screen sizes -->
  <CommandDialog :open="open" @update:open="handleOpenChange">
    <div class="sr-only">
      <h2>Komut Paleti</h2>
      <p>Uygulamada hızlı navigasyon ve arama yapın</p>
    </div>
    <CommandInput placeholder="Bir komut girin veya arama yapın..." />
    <CommandList>
      <CommandEmpty>Sonuç bulunamadı.</CommandEmpty>
      <CommandGroup
        v-for="group of groups"
        :key="group.title"
        :heading="group.title"
      >
        <CommandItem
          v-for="command of group.commands"
          :key="command.id"
          class="group"
          :value="command.id"
          @select="HandleSelection(command)"
        >
          <Icon v-if="command.icon" :name="command.icon" class="size-4" />
          <!-- <component :is="command.icon" v-if="command.icon" class="size-4" /> -->
          {{ command.name }}
          <ArrowRight
            class="size-4 ml-auto fill-mode-forwards group-data-highlighted:animate-in animate-out fade-in fade-out duration-100"
          />
        </CommandItem>
      </CommandGroup>
    </CommandList>
  </CommandDialog>
</template>
