<script setup lang="ts">
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  ArrowRight,
  UtensilsCrossed,
  Split,
  CreditCard,
  Banknote,
} from 'lucide-vue-next';
import SideCafeProduct from './SideCafeProduct.vue';
import TableInfo from './TableInfo.vue';
import PaymentSplitter from './PaymentSplitter.vue';
import PaymentMethodSelector from './PaymentMethodSelector.vue';
import type { CartItem } from '@/components/cafe';
import type Table from '@/types/api/Table';

interface Props {
  showMobileOrders: boolean;
  selectedTable: Table | null;
  hasActiveOrder: boolean;
  isLoading: boolean;
  selectedItemsList: CartItem[];
  tableId: string;
  splitPayment: boolean;
  numberOfPeople: number;
  splitMode: 'equal' | 'custom';
  customSplitAmounts: number[];
  splitPaymentMethods: Array<'cash' | 'card'>;
  paymentMethod: 'cash' | 'card';
  totalPrice: number;
  taxAmount: number;
  finalPrice: number;
  splitDifference: number;
}

interface Emits {
  (e: 'update:showMobileOrders', value: boolean): void;
  (e: 'changeTable'): void;
  (e: 'update:splitPayment', value: boolean): void;
  (e: 'update:numberOfPeople', value: number): void;
  (e: 'update:splitMode', value: 'equal' | 'custom'): void;
  (e: 'update:customSplitAmounts', value: number[]): void;
  (e: 'update:splitPaymentMethods', value: Array<'cash' | 'card'>): void;
  (e: 'update:paymentMethod', value: 'cash' | 'card'): void;
  (e: 'completeOrder'): void;
  (e: 'itemDelete'): void;
}

defineProps<Props>();
defineEmits<Emits>();
</script>

<template>
  <div
    v-if="showMobileOrders"
    class="lg:hidden fixed inset-0 z-50 bg-background"
  >
    <div class="flex flex-col h-full">
      <div class="border-b p-4 flex items-center justify-between">
        <h2 class="text-lg font-semibold">Masa Siparişi</h2>
        <Button
          variant="ghost"
          size="icon"
          @click="$emit('update:showMobileOrders', false)"
        >
          <ArrowRight class="h-5 w-5 rotate-180" />
        </Button>
      </div>

      <ScrollArea class="flex-1">
        <div class="p-4 space-y-6">
          <div>
            <h3 class="font-medium mb-3">Aktif Masa</h3>
            <TableInfo
              :selected-table="selectedTable"
              :has-active-order="hasActiveOrder"
              :is-loading="isLoading"
              @change-table="$emit('changeTable')"
            />
          </div>

          <div>
            <h3 class="font-medium mb-3">Masa Siparişleri</h3>
            <div class="space-y-3">
              <div
                v-if="selectedItemsList.length === 0"
                class="text-center py-8 text-muted-foreground"
              >
                <UtensilsCrossed class="size-12 mx-auto mb-3 opacity-50" />
                <p class="text-sm">Henüz sipariş alınmadı</p>
                <p class="text-xs mt-1">
                  Ürün kataloğundan seçim yapabilirsiniz
                </p>
              </div>
              <SideCafeProduct
                v-for="item of selectedItemsList"
                :key="`mobile-${tableId}-${item.title}`"
                v-model:quantity="item.state.quantity"
                v-model:selected="item.state.selected"
                :name="item.title"
                :price="item.price"
                :max-quantity="item.maxQuantity"
                @delete="$emit('itemDelete')"
              />
            </div>
          </div>

          <div>
            <h3 class="font-medium mb-3">Ödeme Yöntemi</h3>
            <div class="space-y-4">
              <PaymentSplitter
                :split-payment="splitPayment"
                :number-of-people="numberOfPeople"
                :split-mode="splitMode"
                :custom-split-amounts="customSplitAmounts"
                :split-payment-methods="splitPaymentMethods"
                :final-price="finalPrice"
                @update:split-payment="$emit('update:splitPayment', $event)"
                @update:number-of-people="
                  $emit('update:numberOfPeople', $event)
                "
                @update:split-mode="$emit('update:splitMode', $event)"
                @update:custom-split-amounts="
                  $emit('update:customSplitAmounts', $event)
                "
                @update:split-payment-methods="
                  $emit('update:splitPaymentMethods', $event)
                "
              />

              <div v-if="!splitPayment">
                <PaymentMethodSelector
                  :payment-method="paymentMethod"
                  @update:payment-method="$emit('update:paymentMethod', $event)"
                />
              </div>
            </div>
          </div>

          <div>
            <h3 class="font-medium mb-3">Fiyat Özeti</h3>
            <div class="space-y-2 bg-muted/50 p-4 rounded-lg">
              <div class="flex justify-between">
                <span class="text-muted-foreground">Toplam:</span>
                <span class="font-semibold"
                  >{{ totalPrice.toLocaleString() }}₺</span
                >
              </div>
              <div class="flex justify-between">
                <span class="text-muted-foreground text-sm"
                  >Vergi (KDV 20%):</span
                >
                <span class="font-medium"
                  >{{ taxAmount.toLocaleString() }}₺</span
                >
              </div>
              <div class="flex justify-between border-t pt-2 mt-3">
                <span class="font-medium">Genel Toplam:</span>
                <span class="font-semibold text-lg"
                  >{{ finalPrice.toLocaleString() }}₺</span
                >
              </div>
            </div>
          </div>
        </div>
      </ScrollArea>

      <div class="border-t p-4">
        <Button
          class="w-full"
          size="lg"
          :disabled="
            !selectedTable ||
            selectedItemsList.length === 0 ||
            isLoading ||
            (splitPayment &&
              splitMode === 'custom' &&
              Math.abs(splitDifference) > 0.01)
          "
          @click="$emit('completeOrder')"
        >
          <span v-if="isLoading">İşleniyor...</span>
          <span v-else-if="splitPayment">{{ numberOfPeople }} Kişi Ödeme</span>
          <span v-else>{{
            paymentMethod === 'cash' ? 'Nakit Tahsilat' : 'Kart ile Ödeme'
          }}</span>
          <component
            :is="
              splitPayment
                ? Split
                : paymentMethod === 'cash'
                  ? Banknote
                  : CreditCard
            "
            class="ml-2 h-4 w-4"
          />
        </Button>
      </div>
    </div>
  </div>
</template>
