<template>
  <Dialog :open="isDialogOpen" @update:open="$emit('update:isDialogOpen', $event)">
    <DialogContent class="max-w-2xl max-h-[90vh] overflow-y-auto">
      <DialogHeader>
        <DialogTitle>Adisyon Detayları</DialogTitle>
        <DialogDescription>
          Sipariş detaylarını görüntüleyin
        </DialogDescription>
      </DialogHeader>

      <div v-if="selectedOrder" class="space-y-6">
        <div class="flex items-center justify-between">
          <div>
            <h4 class="font-semibold text-sm text-muted-foreground mb-1">
              Durum
            </h4>
            <Badge
              :variant="
                ['PENDING', 'PREPARING', 'READY'].includes(
                  selectedOrder.status
                )
                  ? 'default'
                  : 'secondary'
              "
              class="bg-[#5456c0] text-white transition-all duration-300 hover:scale-105"
            >
              {{ getStatusTranslation(selectedOrder.status) }}
            </Badge>
          </div>
          <div>
            <h4 class="font-semibold text-sm text-muted-foreground mb-1">
              Tarih
            </h4>
            <p class="text-sm">
              {{ toLocaleDate(new Date(selectedOrder.createdAt)) }}
            </p>
          </div>
          <div>
            <h4 class="font-semibold text-sm text-muted-foreground mb-1">
              Sipariş ID
            </h4>
            <p class="text-sm font-mono">
              #{{ String(selectedOrder.id).slice(-6).toUpperCase() + 'PSGNTR' }}
            </p>
          </div>
        </div>

        <Separator />

        <div>
          <h4 class="font-semibold mb-3">Sipariş İçeriği</h4>
          <div class="space-y-2">
            <div
              v-for="item in selectedOrder.items"
              :key="item.productId"
              class="flex justify-between items-center p-3 bg-muted/50 rounded-lg"
            >
              <div>
                <p class="font-medium">
                  {{ getProductName(item.productId) }}
                </p>
                <p class="text-sm text-muted-foreground">
                  {{ item.quantity }} adet
                </p>
              </div>
              <div class="text-right">
                <p class="font-semibold">
                  {{
                    formatPrice(
                      parseFloat(item.price?.toString() || '0') *
                        item.quantity
                    )
                  }}
                  ₺
                </p>
              </div>
            </div>
          </div>
        </div>

        <Separator />

        <div>
          <div class="rounded-lg p-6 text-sm">
            <h4 class="font-semibold mb-4 text-lg">Fiyat Detayları</h4>
            <div class="space-y-3">
              <div class="flex justify-between items-center">
                <span class="text-sm">Ara Toplam:</span>
                <span class="font-medium text-lg"
                  >{{ formatPrice(selectedOrder.totalAmount) }} ₺</span
                >
              </div>
              <div class="flex justify-between items-center">
                <span class="text-sm">Vergi:</span>
                <span class="font-medium text-lg"
                  >{{ formatPrice(selectedOrder.taxAmount) }} ₺</span
                >
              </div>
              <div class="border-t border-slate-700 pt-3">
                <div class="flex justify-between items-center">
                  <span class="font-semibold text-xl">Toplam:</span>
                  <span class="font-bold text-2xl text-green-400"
                    >{{ formatPrice(selectedOrder.finalAmount) }} ₺</span
                  >
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DialogContent>
  </Dialog>
</template>

<script setup lang="ts">
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { toLocaleDate } from '@/lib/toLocaleDate';

interface OrderItem {
  productId: string;
  quantity: number;
  price: number;
}

interface Order {
  id: string;
  status: string;
  createdAt: string;
  totalAmount: number;
  taxAmount: number;
  finalAmount: number;
  items: OrderItem[];
}

interface Product {
  id: string;
  name: string;
}

const statusTranslations: Record<string, string> = {
  OPEN: 'Bekliyor',
  PREPARING: 'Hazırlanıyor',
  READY: 'Hazır',
  COMPLETED: 'Tamamlandı',
  CANCELLED: 'İptal Edildi',
};

const formatPrice = (price: number | string): string => {
  return Math.round(parseFloat(price?.toString() || '0')).toLocaleString();
};

const getStatusTranslation = (status: string): string => {
  return statusTranslations[status] || status;
};

const getProductName = (productId: string): string => {
  return `Ürün ${productId.slice(-4)}`;
};

defineProps<{
  isDialogOpen: boolean;
  selectedOrder: Order | null;
}>();
</script>
