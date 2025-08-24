<script setup lang="ts">
import createProtectedApiInterface from '@/api/protected';
import Resource from '@/components/layout/Resource.vue';
import Section from '@/components/layout/Section.vue';
import { useSelectedShopStore } from '@/store/shop';
import type Table from '@/types/api/Table';
import type { MenuCell, TableData } from '@/types/DataTable';
import { Trash, Edit } from 'lucide-vue-next';
import { ref } from 'vue';
import { toast } from 'vue-sonner';

useSeo({
  title: 'Masalar',
  description: 'Masalar',
});

definePageMeta({
  name: 'Masalar',
});

const router = useRouter();
const protectedApiInterface = createProtectedApiInterface();
const selectedShop = useSelectedShopStore();
const resourceVersion = ref(0);

function MakeResourceColumn(tableData: TableData[], column: Table) {
  tableData.push({
    'Masa Adı': column.name,
    Kapasite: `${column.seatSize} Kişi`,
    Durum: [
      {
        type: 'badge',
        data: 'Müsait',
        color: 'white',
        background: '#5456c0',
      },
    ],
    İşlemler: [makeActionsForAdmission(column)],
  });
}

function makeActionsForAdmission(table: Table): MenuCell {
  const res: MenuCell = {
    type: 'menu',
    data: [
      {
        type: 'group',
        title: 'İşlemler',
        items: [
          {
            type: 'item',
            text: 'Düzenle',
            icon: Edit,
            async action() {
              router.push({
                path: '/dashboard/tables/new',
                query: {
                  edit: 'true',
                  id: table.id,
                },
              });
            },
          },
          {
            type: 'item',
            text: 'Sil',
            icon: Trash,
            async action() {
              await protectedApiInterface({
                url: `shop/tables/${table.shopId}/${table.id}/delete`,
                method: 'DELETE',
              })
                .catch(useErrorHandler)
                .then((res) => {
                  if (!res) return;
                  resourceVersion.value += 1;
                  toast('Masa Silindi', {
                    description: `${table.name} adındaki masa silindi.`,
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
  <div>
    <Section>
      <h1 class="text-3xl font-semibold">Masalar</h1>
      <Resource
        :key="resourceVersion"
        create="/dashboard/tables/new"
        :fetch="`shop/tables/${selectedShop.id}/list`"
        @populate="MakeResourceColumn"
      />
    </Section>
  </div>
</template>
