<script setup lang="ts">
import type { CartCategory, CartItem } from '@/components/cafe';
import Catalog from '@/components/layout/Catalog.vue';
import InputField from '@/components/market/InputField.vue';
import Summary from '@/components/market/Summary.vue';
import Card from '@/components/market/payments/Card.vue';
import Cash from '@/components/market/payments/Cash.vue';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  ArrowBigRightIcon,
  ArrowRightLeft,
  Asterisk,
  Delete,
  Minus,
} from 'lucide-vue-next';
import { computed, onMounted, onUnmounted, ref } from 'vue';
import type { DefineComponent, FunctionalComponent, VNode } from 'vue';

const productList = ref<CartCategory[]>([
  {
    id: 'laptops',
    title: 'Dizüstü Bilgisayarlar',
    items: [
      {
        productId: '0',
        image: '/macbook0.jpg',
        title: 'Macbook Pro M4 18 inç',
        price: 49999,
        maxQuantity: 24,
        state: {
          quantity: 1,
          selected: false,
        },
      },
      {
        productId: '1',
        image: '/macbook0.jpg',
        title: 'Macbook Pro M4 18 inç',
        price: 49999,
        maxQuantity: 24,
        state: {
          quantity: 1,
          selected: false,
        },
      },
    ],
  },
]);

const selectedItemsList = computed(() => {
  const res: CartItem[] = [];
  for (const cat of productList.value) {
    for (const itm of cat.items) {
      if (itm.state.selected) res.push(itm);
    }
  }
  return res;
});

const selectedInputField = ref('barcode');

interface NumItem {
  id: string;
  size: number;
  data: string | number | FunctionalComponent | DefineComponent | VNode;
}

const numPad: Array<Array<NumItem | string | number>> = [
  [
    { id: 'Tab', size: 1, data: ArrowRightLeft },
    { id: '*', size: 1, data: Asterisk },
    { id: 'Delete', size: 2, data: Delete },
  ],
  [7, 8, 9, '+'],
  [4, 5, 6, { id: '-', size: 1, data: Minus }],
  [1, 2, 3, ','],
  ['00', '0', { id: 'Enter', size: 2, data: ArrowBigRightIcon }],
];

const numPadKeysMap = numPad
  .map((row) => {
    return row.map((key) => {
      if (typeof key != 'object') return key + '';
      return key.id;
    });
  })
  .flat();

const sideTab = ref<'payment' | 'barcode'>('barcode');

function barcodeKeyPressListener(e: KeyboardEvent) {
  console.log(numPadKeysMap.includes(e.key));
}

onMounted(() => {
  window.addEventListener('keydown', barcodeKeyPressListener);
});

onUnmounted(() => {
  window.removeEventListener('keydown', barcodeKeyPressListener);
});
</script>

<template>
  <div class="w-full max-h-[calc(100vh-3rem)] h-screen grid grid-cols-10">
    <Tabs
      v-if="true"
      :data-wide="sideTab == 'barcode'"
      default-value="summary"
      class="data-[wide=true]:col-span-7 col-span-6 max-h-[calc(100vh-3rem)] flex flex-col p-2 h-full"
    >
      <TabsList>
        <TabsTrigger value="summary"> Satış Özeti </TabsTrigger>
        <TabsTrigger value="catalog"> Ürün Kataloğu </TabsTrigger>
      </TabsList>
      <TabsContent
        value="catalog"
        class="h-full overflow-auto border rounded-xl"
      >
        <Catalog v-model="productList" />
      </TabsContent>
      <TabsContent
        value="summary"
        class="h-full overflow-auto border rounded-xl"
      >
        <Summary v-model="selectedItemsList" />
      </TabsContent>
    </Tabs>
    <Tabs
      v-model="sideTab"
      :data-small="sideTab == 'barcode'"
      class="col-span-4 transition data-[small=true]:col-span-3 m-2 max-h-[calc(100vh-3rem)] rounded-xl flex-col gap-2"
    >
      <TabsList>
        <TabsTrigger value="barcode"> Barkod Tarayıcı </TabsTrigger>
        <TabsTrigger value="payment"> Ödeme </TabsTrigger>
      </TabsList>
      <TabsContent value="barcode" class="flex flex-col gap-4">
        <div class="border rounded-xl p-2 flex gap-2 group mt-auto">
          <!-- Barkod view field -->
          <InputField
            v-model:selection="selectedInputField"
            class="w-full"
            selection-id="barcode"
            @click="selectedInputField = 'barcode'"
          >
            00000000
          </InputField>
          <InputField
            v-model:selection="selectedInputField"
            class="shrink-0"
            selection-id="quantity"
          >
            1/<small class="inline">adet</small>
          </InputField>
        </div>
        <div class="border rounded-xl grid gap-2 p-2">
          <div
            v-for="(row, rindex) of numPad"
            :key="rindex"
            class="grid grid-cols-4 gap-2"
          >
            <Button
              v-for="(col, cindex) of row"
              :key="cindex"
              variant="outline"
              size="lg"
              :class="typeof col == 'object' ? `col-span-${col.size}` : ''"
              class="text-lg h-16"
            >
              <template v-if="typeof col == 'object'">
                <component
                  :is="col.data"
                  v-if="!['string', 'number'].includes(typeof col.data)"
                  class="size-5!"
                />
                <template v-else>
                  {{ col.data }}
                </template>
              </template>
              <template v-else>
                {{ col }}
              </template>
            </Button>
          </div>
        </div>
      </TabsContent>
      <TabsContent value="payment" class="border rounded-xl p-4">
        <h2 class="text-xl font-semibold">Nakit</h2>
        <Cash class="mt-2" />
        <h2 class="text-xl font-semibold mt-4">Terminal</h2>
        <Card />
      </TabsContent>
    </Tabs>
  </div>
</template>
