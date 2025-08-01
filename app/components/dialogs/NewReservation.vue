<script setup lang="ts">
import createProtectedApiInterface from '@/api/protected';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
// import errorHandler from '@/lib/errorHandler';
import { useSelectedShopStore } from '@/store/shop';
import type Table from '@/types/api/Table';
import type { Reservation } from '@/types/Cafe';
import { ref } from 'vue';
import { toast } from 'vue-sonner';
import Button from '../ui/button/Button.vue';
import { ArrowRight } from 'lucide-vue-next';

const showNewReservationDialog = ref(false);
const newReservation = ref({
  customerName: '',
  customerPhone: '',
  date: '',
  time: '',
  numberOfGuests: 1,
  tableId: '',
  notes: '',
});
const submitting = ref(false);

defineProps<{
  tables: Table[];
}>();

const reservations = defineModel('reservations', {
  type: Array<Reservation>,
  required: true,
  default: [],
});

const protectedApiInterface = createProtectedApiInterface();
const selectedShop = useSelectedShopStore();

function getTodayDate() {
  const today = new Date();
  return today.toISOString().split('T')[0];
}

async function fetchReservations() {
  const res = await protectedApiInterface({
    url: `shop/reservations/${selectedShop.id}/list`,
    method: 'GET',
  }).catch(useErrorHandler);

  if (!res) return;

  reservations.value = res.data.data;
}

async function createReservation() {
  submitting.value = true;

  const reservationData = {
    customerName: newReservation.value.customerName,
    customerPhone: newReservation.value.customerPhone,
    date: newReservation.value.date,
    time: newReservation.value.time,
    numberOfGuests: newReservation.value.numberOfGuests,
    tableId: newReservation.value.tableId,
    notes: newReservation.value.notes,
  };

  console.log('Sending reservation data:', reservationData);

  const res = await protectedApiInterface({
    url: `shop/reservations/${selectedShop.id}/create`,
    method: 'POST',
    data: reservationData,
  }).catch(useErrorHandler);

  if (!res) return (submitting.value = false);

  resetForm();

  showNewReservationDialog.value = false;

  await fetchReservations();

  toast.success('Rezervasyon başarıyla oluşturuldu!', {
    description: `${reservationData.customerName} için rezervasyon kaydedildi.`,
    duration: 4000,
  });
  submitting.value = false;
}

function resetForm() {
  newReservation.value = {
    customerName: '',
    customerPhone: '',
    date: '',
    time: '',
    numberOfGuests: 1,
    tableId: '',
    notes: '',
  };
}
</script>

<template>
  <Dialog v-model:open="showNewReservationDialog">
    <DialogTrigger as-child>
      <Button variant="outline" class="text-sm lg:text-base px-2 lg:px-4">
        <span class="hidden md:inline">Yeni Rezervasyon</span>
        <span class="md:hidden">Yeni</span>
        <ArrowRight class="h-4 w-4 lg:h-5 lg:w-5 ml-1" />
      </Button>
    </DialogTrigger>
    <DialogContent class="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
      <DialogHeader>
        <DialogTitle>Yeni Rezervasyon</DialogTitle>
        <DialogDescription> Yeni bir rezervasyon oluşturun. </DialogDescription>
      </DialogHeader>
      <form class="space-y-4" @submit.prevent="createReservation">
        <div class="grid grid-cols-2 gap-4">
          <div class="space-y-2">
            <Label for="customerName">Müşteri Adı *</Label>
            <Input
              id="customerName"
              v-model="newReservation.customerName"
              placeholder="Müşteri adını girin"
              required
            />
          </div>
          <div class="space-y-2">
            <Label for="customerPhone">Telefon *</Label>
            <Input
              id="customerPhone"
              v-model="newReservation.customerPhone"
              placeholder="0555 123 45 67"
              required
            />
          </div>
        </div>

        <div class="grid grid-cols-2 gap-4">
          <div class="space-y-2">
            <Label for="date">Tarih *</Label>
            <Input
              id="date"
              v-model="newReservation.date"
              type="date"
              :min="getTodayDate()"
              required
            />
          </div>
          <div class="space-y-2">
            <Label for="time">Saat *</Label>
            <Input
              id="time"
              v-model="newReservation.time"
              type="time"
              required
            />
          </div>
        </div>

        <div class="grid grid-cols-2 gap-4">
          <div class="space-y-2">
            <Label for="numberOfGuests">Kişi Sayısı *</Label>
            <Input
              id="numberOfGuests"
              v-model.number="newReservation.numberOfGuests"
              type="number"
              min="1"
              max="20"
              required
            />
          </div>
          <div class="space-y-2">
            <Label>Masa *</Label>
            <Select v-model="newReservation.tableId" required>
              <SelectTrigger>
                <SelectValue placeholder="Masa seçin" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem
                  v-for="table in tables"
                  :key="table.id"
                  :value="table.id"
                >
                  {{ table.name }} ({{ table.seatSize }} kişilik)
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div class="space-y-2">
          <Label for="notes">Notlar</Label>
          <textarea
            id="notes"
            v-model="newReservation.notes"
            placeholder="Özel istekler veya notlar..."
            rows="3"
            class="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          />
        </div>

        <div class="flex justify-end gap-2 pt-4">
          <Button
            type="button"
            variant="outline"
            :disabled="submitting"
            @click="
              () => {
                showNewReservationDialog = false;
                resetForm();
              }
            "
          >
            İptal
          </Button>
          <Button type="submit" :disabled="submitting">
            <span v-if="submitting">Kaydediliyor...</span>
            <span v-else>Rezervasyon Oluştur</span>
          </Button>
        </div>
      </form>
    </DialogContent>
  </Dialog>
</template>
