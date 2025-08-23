<script setup lang="ts">
import { breakpointsTailwind, useBreakpoints } from '@vueuse/core';
import { AlignLeft } from 'lucide-vue-next';

const breakpoint = useBreakpoints(breakpointsTailwind, {
  ssrWidth: 768,
});

const active = breakpoint.smallerOrEqual('sm');

const open = ref(false);

const router = useRouter();

router.afterEach(() => {
  if (open.value) open.value = false;
});
</script>

<template>
  <Sheet v-if="active" v-model:open="open">
    <SheetTrigger as-child>
      <Button variant="outline" size="sm">
        <AlignLeft />
        <span>Menü</span>
      </Button>
    </SheetTrigger>
    <SheetContent side="left" class="w-full sm:w-[570px]">
      <div class="sm:px-10 py-12 px-6">
        <UserSidebarContent class="max-w-none" />
      </div>
    </SheetContent>
  </Sheet>
  <UserSidebarContent v-else />
</template>
