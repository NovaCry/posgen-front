<script setup lang="ts">
import { computed } from 'vue';
import {
  Breadcrumb,
  BreadcrumbEllipsis,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '../ui/breadcrumb';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import type { RouteRecordNameGeneric } from 'vue-router';

const router = useRouter();

const routerPathHistory = computed(() => {
  let list = [];
  const includes: RouteRecordNameGeneric[] = [];
  for (const route of router.getRoutes()) {
    const isInHistory = router.currentRoute.value.fullPath.includes(route.path);
    if (
      isInHistory &&
      !includes.includes(route.name) &&
      route.name &&
      !route.meta.hideInBreadcrumb
    ) {
      list.push({
        path: route.path,
        name: route.name,
      });
      includes.push(route.name);
    }
  }

  list = list.reverse();

  return {
    first: list.shift(),
    last: list.pop(),
    list,
  };
});
</script>

<template>
  <Breadcrumb>
    <BreadcrumbList>
      <BreadcrumbItem>
        <RouterLink
          class="hover:text-primary transition duration-150"
          :to="routerPathHistory.first?.path || ''"
        >
          {{ routerPathHistory.first?.name }}
        </RouterLink>
      </BreadcrumbItem>
      <BreadcrumbSeparator v-if="routerPathHistory.list.length >= 1" />
      <BreadcrumbItem v-if="routerPathHistory.list.length >= 1">
        <DropdownMenu>
          <DropdownMenuTrigger class="flex items-center gap-1">
            <BreadcrumbEllipsis class="h-4 w-4" />
            <span class="sr-only">Toggle menu</span>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start">
            <DropdownMenuItem
              v-for="route of routerPathHistory.list"
              :key="route.path"
              @click="router.push(route.path)"
            >
              {{ route.name }}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </BreadcrumbItem>
      <BreadcrumbSeparator v-if="routerPathHistory.last" />
      <BreadcrumbItem>
        <BreadcrumbPage>{{ routerPathHistory.last?.name }}</BreadcrumbPage>
      </BreadcrumbItem>
    </BreadcrumbList>
  </Breadcrumb>
</template>
