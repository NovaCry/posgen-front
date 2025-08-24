<template>
  <Dialog :open="isDialogOpen" @update:open="$emit('update:is-dialog-open', $event)">
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
                selectedOrder.status === 'PENDING' ? 'secondary' :
                selectedOrder.status === 'PREPARING' ? 'default' :
                selectedOrder.status === 'READY' ? 'default' :
                selectedOrder.status === 'COMPLETED' ? 'default' :
                selectedOrder.status === 'CANCELLED' ? 'destructive' :
                'secondary'
              "
              :style="{
                backgroundColor: getStatusColor(selectedOrder.status),
                color: 'white'
              }"
              class="transition-all duration-300 hover:scale-105 text-sm"
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
               {{ formatOrderId(selectedOrder.id) }}
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
                       getProductPrice(item.productId) * item.quantity
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

         <div v-if="['PENDING', 'PREPARING', 'READY'].includes(selectedOrder.status)" class="flex justify-end">
           <Button 
             variant="destructive" 
             size="sm"
             @click="cancelOrder"
           >
             İptal Et
           </Button>
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
import { Button } from '@/components/ui/button';
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
  price: number;
}

const statusTranslations: Record<string, string> = {
  OPEN: 'Bekliyor',
  PENDING: 'Bekliyor',
  PREPARING: 'Hazırlanıyor',
  READY: 'Hazır',
  COMPLETED: 'Tamamlandı',
  CANCELLED: 'İptal Edildi',
};

const getStatusColor = (status: string): string => {
  switch (status) {
    case 'OPEN':
      return '#5456c0';
    case 'PENDING':
      return 'var(--secondary)';
    case 'PREPARING':
      return '#f59e0b';
    case 'READY':
      return '#10b981';
    case 'COMPLETED':
      return '#10b981';
    case 'CANCELLED':
      return '#ef4444';
    default:
      return '#6b7280';
  }
};

const getStatusTranslation = (status: string): string => {
  return statusTranslations[status] || status;
};

const formatPrice = (price: number | string): string => {
  return Math.round(parseFloat(price?.toString() || '0')).toLocaleString();
};

const formatOrderId = (orderId: string): string => {
  if (orderId.endsWith('PSGNTR')) {
    return `#${String(orderId).slice(0, 6).toUpperCase()}PSGNTR`;
  }
  return `#${orderId}`;
};

const getProductName = (productId: string): string => {
  const product = props.products.find((p: Product) => p.id === productId);
  return product?.name || `Ürün ${productId.slice(-4)}`;
};

const getProductPrice = (productId: string): number => {
  const product = props.products.find((p: Product) => p.id === productId);
  return product?.price || 0;
};

const props = defineProps<{
  isDialogOpen: boolean;
  selectedOrder: Order | null;
  products: Product[];
}>();

const emit = defineEmits<{
  'update:is-dialog-open': [value: boolean];
  'order-cancelled': [orderId: string];
}>();

const cancelOrder = async () => {
  if (!props.selectedOrder) return;
  
  try {
    emit('order-cancelled', props.selectedOrder.id);
    emit('update:is-dialog-open', false);
  } catch (error) {
    console.error('Sipariş iptal edilirken hata:', error);
  }
};
</script>
