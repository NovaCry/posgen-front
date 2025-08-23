<script setup lang="ts">
import createProtectedApiInterface from '@/api/protected';
import Resource from '@/components/layout/Resource.vue';
import Section from '@/components/layout/Section.vue';
import { toLocaleDate } from '@/lib/toLocaleDate';
import { useSelectedShopStore } from '@/store/shop';
import { Badge } from '@/components/ui/badge';
import type { Discount } from '@/types/api/Discount';
import type { BadgeCell, MenuCell, TableData, TextCell } from '@/types/DataTable';
import { Trash } from 'lucide-vue-next';
import { ref } from 'vue';
import { toast } from 'vue-sonner';

definePageMeta({
  name: 'İndirimler',
});

const protectedApiInterface = createProtectedApiInterface();
const selectedShop = useSelectedShopStore();
const resourceVersion = ref(0);

async function populateData(tableData: TableData[], discount: Discount) {
  tableData.push({
    'İndirim Kodu': [
      {
        type: 'text',
        data: discount.name,
      },
    ],
    'Oluşturma Tarihi': [
      {
        type: 'text',
        data: toLocaleDate(new Date(discount.createdAt), true),
      },
    ],
    'Sona Erme Tarihi': [
      {
        type: 'text',
        data: discount.expiry
          ? toLocaleDate(new Date(discount.expiry), true)
          : '-',
      },
    ],
    İndirim: [
      {
        type: 'text',
        data: discount.isRate
          ? discount.discount + '%'
          : (+discount.discount).toLocaleString() + '₺',
      },
    ],
    'Maksimum Kullanım': [
      {
        type: 'badge',
        background: '#5456c0',
        color: 'white',
        data: discount.maxUses ? discount.maxUses.toString() : 'Sınırsız',
      },
    ],
    İşlemler: [makeActionsForDiscount(discount)],
  });
}


function makeActionsForDiscount(discount: Discount): MenuCell {
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
                url: `shop/discounts/${discount.shopId}/${discount.id}/delete`,
                method: 'DELETE',
              })
                .catch(useErrorHandler)
                .then((res) => {
                  if (!res) return;
                  resourceVersion.value += 1;
                  toast('İndirim Silindi', {
                    description: `${discount.name} koduna sahip indirim silindi.`,
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
  <Section>
    <h1 class="text-3xl font-semibold">İndirimler</h1>
    <Resource
      :key="resourceVersion"
      create="/dashboard/shop/discounts/new"
      :fetch="`shop/discounts/${selectedShop.id}/list`"
      @populate="populateData"
    />
  </Section>
</template>
