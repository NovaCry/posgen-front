<script setup lang="ts">
import createProtectedApiInterface from '@/api/protected';
import Resource from '@/components/layout/Resource.vue';
import Section from '@/components/layout/Section.vue';
import { useSelectedShopStore } from '@/store/shop';
import type { Category } from '@/types/api/Category';
import type { MenuCell, TableData } from '@/types/DataTable';
import { Trash } from 'lucide-vue-next';
import { h, ref } from 'vue';
import { toast } from 'vue-sonner';
import { Icon } from '@iconify/vue';
import SeoMeta from '@/components/seo/SeoMeta.vue';
definePageMeta({
  name: 'Kategoriler',
});

const protectedApiInterface = createProtectedApiInterface();
const selectedShop = useSelectedShopStore();
const resourceVersion = ref(0);

async function populateData(tableData: TableData[], category: Category) {
  tableData.push({
    '': [
      {
        type: 'icon',
        component: h(Icon, { icon: category.icon }),
      },
    ],
    Kategori: category.name,
    İşlemler: [makeActionsForCategory(category)],
  });
}

function makeActionsForCategory(category: Category): MenuCell {
  const res: MenuCell = {
    type: 'menu',
    data: [
      {
        type: 'group',
        title: 'İşlemler',
        items: [
          {
            type: 'item',
            text: 'Sil',
            icon: Trash,
            async action() {
              await protectedApiInterface({
                url: `shop/categories/${category.shopId}/${category.id}/delete`,
                method: 'DELETE',
              })
                .catch(useErrorHandler)
                .then((res) => {
                  if (!res) return;
                  resourceVersion.value += 1;
                  toast('Kategori Silindi', {
                    description: `${category.name} adındaki kategori silindi.`,
                  });
                });
            },
          },
        ],
      },
    ],
  };
  return res;
}
</script>

<template>
  <SeoMeta title="Kategoriler" description="Kategoriler" />
  <Section>
    <h1 class="text-3xl font-semibold">Kategoriler</h1>
    <Resource
      :key="resourceVersion"
      create="/dashboard/categories/new"
      :fetch="`shop/categories/${selectedShop.id}/list`"
      @populate="populateData"
    />
  </Section>
</template>
