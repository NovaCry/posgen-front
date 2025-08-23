<script setup lang="ts">
import createProtectedApiInterface from '@/api/protected';
import Resource from '@/components/layout/Resource.vue';
import Section from '@/components/layout/Section.vue';
import { useSelectedShopStore } from '@/store/shop';
import type { Product } from '@/types/api/Product';
import type { MenuCell, TableData } from '@/types/DataTable';
import { Copy, Edit, Trash } from 'lucide-vue-next';
import { ref } from 'vue';
import SeoMeta from '@/components/seo/SeoMeta.vue';
definePageMeta({
  name: 'Ürünler',
});

const router = useRouter();
const protectedApiInterface = createProtectedApiInterface();
const selectedShop = useSelectedShopStore();
const resourceVersion = ref(0);

async function populateData(tableData: TableData[], product: Product) {
  const totalStock =
    product.stocks?.reduce((sum, stock) => sum + Number(stock.quantity), 0) ||
    0;
  const maxStock =
    product.stocks?.reduce(
      (sum, stock) => sum + Number(stock.maxQuantity),
      0
    ) || 0;

  tableData.push({
    'Ürün Adı': product.name,
    Fiyat: `${(+product.price).toLocaleString()} ₺`,
    Kategori: product.category?.name || 'Kategori Yok',
    Stok: [
      {
        type: 'badge',
        data: maxStock === 0 ? 'Stoksuz' : `${totalStock} Adet`,
        color: 'white',
        background: '#5456c0',
      },
    ],
    İşlemler: [makeActionsForProduct(product)],
  });
}

function makeActionsForProduct(product: Product): MenuCell {
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
                path: '/dashboard/product/new',
                query: {
                  edit: 'true',
                  id: product.id,
                },
              });
            },
          },
          {
            type: 'item',
            text: 'Çoğalt',
            icon: Copy,
            async action() {
              // TODO: Implement product duplication logic
            },
          },
          {
            type: 'item',
            text: 'Sil',
            icon: Trash,
            async action() {
              await protectedApiInterface({
                url: `shop/products/${product.shopId}/${product.id}/delete`,
                method: 'DELETE',
              })
                .catch(useErrorHandler)
                .then((res) => {
                  if (!res) return;
                });
              resourceVersion.value += 1;
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
  <SeoMeta title="Ürünler" description="Ürünler" />
  <Section>
    <h1 class="text-3xl font-semibold">Ürünler</h1>
    <Resource
      :key="resourceVersion"
      create="/dashboard/product/new"
      :fetch="`shop/products/${selectedShop.id}/list`"
      @populate="populateData"
    />
  </Section>
</template>
