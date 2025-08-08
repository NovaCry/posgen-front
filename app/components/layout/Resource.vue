<script setup lang="ts" generic="T">
import createProtectedApiInterface from '@/api/protected';
import DataTable from '@/components/DataTable.vue';
import PaginationSimplified from '@/components/PaginationSimplified.vue';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import type Pagination from '@/types/api/Pagination';
import type { TableData } from '@/types/DataTable';
import { ArrowRight, ListFilter } from 'lucide-vue-next';
import { ref, watchEffect, watch } from 'vue';
import type { RouteLocationRaw } from 'vue-router';

const router = useRouter();

const props = defineProps<{
  fetch: string;
  create?: RouteLocationRaw;
  disableNew?: boolean;
}>();

const emit = defineEmits(['populate']);

const protectedApiInterface = createProtectedApiInterface();

const page = ref(1);
const search = ref('');
const composedPagination = ref<Pagination<TableData>>({
  data: [],
  meta: { maxItems: 0, page: 0, totalCount: 0, totalPages: 0 },
});
const ITEMS_PER_PAGE = 10;

async function getData() {
  const res = await protectedApiInterface<Pagination<T>>({
    url: `${props.fetch}?page=${page.value
      }&limit=${ITEMS_PER_PAGE}&search=${encodeURIComponent(search.value)}`,
    method: 'GET',
  }).catch(useErrorHandler);
  if (!res || !res.data || !Array.isArray(res.data.data)) {
    composedPagination.value = {
      data: [],
      meta: {
        page: 0,
        maxItems: 0,
        totalCount: 0,
        totalPages: 0,
      },
    };
    return;
  }
  const tableData: TableData[] = [];
  for (const column of res.data.data) {
    emit('populate', tableData, column);
  }
  composedPagination.value = {
    data: tableData,
    meta: res.data.meta,
  };
}

onBeforeMount(() => {
  watchEffect(() => {
    getData();
  });

  watch([page, search], () => {
    getData();
  });
})
</script>

<template>
  <div class="flex items-center my-4">
    <div class="flex items-center mr-auto gap-4">
      <Input v-model="search" placeholder="Kaynakta Arama Yap..." />
      <Button disabled variant="outline">
        <ListFilter />
        Sırala
      </Button>
    </div>
    <NuxtLink v-if="!disableNew" :to="create || router.currentRoute.value.path">
      <Button :disabled="disableNew">
        Yeni Kayıt
        <ArrowRight />
      </Button>
    </NuxtLink>
  </div>
  <DataTable :data="composedPagination?.data || []" />
  <PaginationSimplified
v-model="page" class="my-4 w-full flex justify-center" :items-per-page="ITEMS_PER_PAGE"
    :total-items="composedPagination?.meta.totalCount" />
</template>
