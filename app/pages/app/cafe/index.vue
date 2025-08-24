<script setup lang="ts">
import ReservationCard from '@/components/ReservationCard.vue';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { addHours, isToday, isTomorrow, format } from 'date-fns';
import TableView, { type TableStatus } from '@/components/cafe/TableView.vue';
import createProtectedApiInterface from '@/api/protected';
import { useSelectedShopStore } from '@/store/shop';
import type Table from '@/types/api/Table';
import { onMounted, ref, computed, watch } from 'vue';
import { motion } from 'motion-v';
import NewReservation from '@/components/dialogs/NewReservation.vue';
import type {
  Reservation,
  TimelineGroup,
  TimelineReservation,
} from '@/types/Cafe';
import SeoMeta from '@/components/seo/SeoMeta.vue';


const selectedShop = useSelectedShopStore();
const protectedApiInterface = createProtectedApiInterface();

const tables = ref<Table[]>([]);
const reservations = ref<Reservation[]>([]);
const loading = ref(false);

const timeline = computed<TimelineGroup[]>(() => {
  const groups: { [key: string]: TimelineReservation[] } = {};

  reservations.value.forEach((reservation) => {
    const reservationDate = new Date(reservation.date);
    const [hours, minutes] = reservation.time.split(':').map(Number);
    const startTime = new Date(reservationDate);
    startTime.setHours(hours || 0, minutes || 0, 0, 0);

    const endTime = addHours(startTime, 2);

    let groupName = '';
    if (isToday(reservationDate)) {
      groupName = 'Bugün';
    } else if (isTomorrow(reservationDate)) {
      groupName = 'Yarın';
    } else {
      groupName = format(reservationDate, 'dd/MM/yyyy');
    }

    if (!groups[groupName]) {
      groups[groupName] = [];
    }

    const tableName = reservation.table?.name || `Masa ${reservation.tableId}`;
    const tableNumberMatch = tableName.match(/(\d+)/);
    const tableNumber = tableNumberMatch?.[1] ? parseInt(tableNumberMatch[1]) : 0;

    groups[groupName]!.push({
      name: reservation.customerName,
      start: startTime,
      end: endTime,
      tableNumber: tableNumber,
      tableName: tableName,
      status: reservation.status,
    });
  });

  const sortedGroups = Object.entries(groups).sort(([a], [b]) => {
    if (a === 'Bugün') return -1;
    if (b === 'Bugün') return 1;
    if (a === 'Yarın') return -1;
    if (b === 'Yarın') return 1;
    return a.localeCompare(b);
  });

  return sortedGroups.map(([name, reservations]) => ({
    name,
    reservations: reservations.sort(
      (a, b) => a.start.getTime() - b.start.getTime()
    ),
  }));
});

// Masaların durumuna göre status belirleme
function getTableStatus(table: Table): TableStatus {
  if (table.hasActiveOrder) {
    return 'filled'; // Aktif siparişi olan masalar yeşil
  }
  if (table.hasActiveReservation) {
    return 'reserved'; // Rezervasyonu olan masalar kırmızı
  }
  return 'empty'; // Boş masalar mavi
}

async function fetchTables() {
  const res = await protectedApiInterface({
    url: `shop/tables/${selectedShop.id}/list?page=0`,
    method: 'GET',
  }).catch(useErrorHandler);
  if (!res) return;
  tables.value = res.data.data;
}

async function fetchReservations() {
  loading.value = true;
  const res = await protectedApiInterface({
    url: `shop/reservations/${selectedShop.id}/list`,
    method: 'GET',
  }).catch(useErrorHandler);

  if (!res) return (loading.value = false);

  reservations.value = res.data.data;
  loading.value = false;
}

onMounted(async () => {
  if (!selectedShop.id) {
    await new Promise((resolve) => {
      const unwatch = watch(
        () => selectedShop.id,
        (newId) => {
          if (newId) {
            unwatch();
            resolve(true);
          }
        }
      );
    });
  }

  await fetchTables();
  await fetchReservations();
});
</script>

<template>
  <SeoMeta title="Kafe" description="Kafe" />
  <div
    class="grid grid-cols-1 lg:grid-cols-10 px-2.5 sm:container gap-4 lg:gap-8 h-screen max-h-[calc(100vh-3rem)] overflow-hidden"
  >
    <ScrollArea
      class="border-r-0 lg:border-r col-span-1 lg:col-span-6 max-h-[50vh] lg:max-h-[calc(100vh-3rem)]"
    >
      <div class="py-4 lg:py-6 pr-2 lg:pr-8">
        <h1 class="text-2xl lg:text-3xl font-semibold">Masalar</h1>
        <div
          class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-2 xl:grid-cols-3 mt-4 gap-3 lg:gap-4"
        >
          <RouterLink
            v-for="table in tables"
            :key="table.id"
            :to="`/app/cafe/${table.id}/open`"
          >
            <motion.div
              class="relative"
              :initial="{ bottom: -50, opacity: 0 }"
              :animate="{ bottom: 0, opacity: 1 }"
              :transition="{ delay: tables.indexOf(table) * 0.05 }"
            >
              <TableView
                :name="table.name"
                :size="table.seatSize"
                :status="getTableStatus(table)"
              />
            </motion.div>
          </RouterLink>
        </div>
      </div>
    </ScrollArea>

    <div class="col-span-1 lg:col-span-4 py-4 lg:py-6 border-t lg:border-t-0">
      <h1
        class="text-2xl lg:text-3xl font-semibold flex flex-wrap items-center gap-2 lg:gap-3"
      >
        <span>Rezervasyonlar</span>
        <NewReservation v-model:reservations="reservations" :tables="tables" />
      </h1>

      <div
        class="flex flex-col mt-4 gap-3 lg:gap-6 max-h-[calc(50vh-4rem)] lg:max-h-none overflow-y-auto lg:overflow-y-visible pr-1 lg:pr-2"
      >
        <div v-if="loading" class="text-center py-4">
          <div
            class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"
          />
          <p class="text-sm text-muted-foreground mt-2">
            Rezervasyonlar yükleniyor...
          </p>
        </div>

        <div v-else-if="timeline.length === 0" class="text-center py-8">
          <p class="text-muted-foreground">Henüz rezervasyon bulunmuyor.</p>
        </div>

        <div v-for="group of timeline" v-else :key="group.name">
          <Label class="mb-2 lg:mb-2.5 text-sm lg:text-base">{{
            group.name
          }}</Label>
          <motion.div
            v-for="(reservation, index) of group.reservations"
            :key="`${reservation.tableNumber}-${index}`"
            class="relative"
            :initial="{ right: -100, opacity: 0 }"
            :animate="{ right: 0, opacity: 1 }"
            :transition="{ delay: index * 0.05 }"
          >
            <ReservationCard
              class="mb-2"
              :name="reservation.name"
              :start="reservation.start"
              :end="reservation.end"
              :table="reservation.tableNumber"
            />
          </motion.div>
        </div>
      </div>
    </div>
  </div>
</template>
