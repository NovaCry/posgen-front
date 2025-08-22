<script setup lang="ts">
import { TooltipProvider } from '@/components/ui/tooltip';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';

import Label from '@/components/ui/label/Label.vue';

import { ArrowLeft, Loader2, Plus } from 'lucide-vue-next';
import TooltipSimplified from '@/components/TooltipSimplified.vue';
import { computed, ref } from 'vue';
import NumberFieldSimplified from '@/components/input/NumberFieldSimplified.vue';
import { useSelectedShopStore } from '@/store/shop';
import { toast } from 'vue-sonner';
import Section from '@/components/layout/Section.vue';
import ResourceCard from '@/components/card/ResourceCard.vue';
import SeatRenderer from '@/components/SeatRenderer.vue';
import createProtectedApiInterface from '@/api/protected';
import type Table from '~/types/api/Table';
const router = useRouter();
const route = useRoute();

definePageMeta({
  name: 'Yeni Masa',
});

const protectedApiInterface = createProtectedApiInterface();
const selectedShop = useSelectedShopStore();

const isEditing = ref(route.query.edit === 'true' && route.query.id);
const tableName = ref('');
const seatSize = ref(6);

const isLoading = ref(false);
const isAcceptable = computed(() => {
  if (
    tableName.value !== '' &&
    tableName.value.length >= 1 &&
    tableName.value.length <= 24 &&
    seatSize.value > 0 &&
    seatSize.value <= 24
  )
    return true;
  return false;
});

async function EditTable() {
  isLoading.value = true;
  const res = await protectedApiInterface({
    url: `shop/tables/${selectedShop.id}/${route.query.id}/update`,
    method: 'PUT',
    data: {
      name: tableName.value,
      seatSize: seatSize.value,
    },
  }).catch(useErrorHandler);

  if (!res) {
    isLoading.value = false;
    return;
  }

  toast('Masa Güncellendi!', {
    description: `${tableName.value} adındaki ${seatSize.value} kişilik masa güncellendi!`,
  });
  router.push('/dashboard/tables');
}

async function CreateTable() {
  isLoading.value = true;
  const res = await protectedApiInterface({
    url: `shop/tables/${selectedShop.id}/create`,
    method: 'POST',
    data: {
      name: tableName.value,
      seatSize: seatSize.value,
    },
  }).catch(useErrorHandler);

  if (!res) return (isLoading.value = false);

  toast('Masa oluşturuldu!', {
    description: `${tableName.value} adındaki ${seatSize.value} kişilik masa oluşturuldu!`,
  });
  router.push('/dashboard/tables');
}

onMounted(async () => {
  if (isEditing.value) {
    const tableData = await protectedApiInterface.get<Table>(
      `shop/tables/${selectedShop.id}/${route.query.id}`
    );

    tableName.value = tableData.data.name;
    seatSize.value = tableData.data.seatSize;
  }
});
</script>

<template>
  <Section>
    <div class="flex items-center">
      <div class="flex gap-4">
        <Button variant="outline" size="icon" @click="router.back()">
          <ArrowLeft />
        </Button>
        <h1 class="text-3xl font-semibold">Yeni Masa</h1>
      </div>
      <Button
        :disabled="isLoading || !isAcceptable"
        class="ml-auto"
        @click="isEditing ? EditTable() : CreateTable()"
      >
        <Loader2 v-if="isLoading" class="animate-spin" />
        <template v-if="isEditing">Masayı Düzenle</template>
        <template v-else>Masayı Oluştur</template>
        <Plus />
      </Button>
    </div>
    <div class="grid grid-cols-2 mt-6 gap-6">
      <div class="flex flex-col gap-4">
        <ResourceCard
          title="Masa Bilgisi"
          description="Masa hakkındaki en basit belirtici bilgi."
        >
          <div class="flex flex-col gap-2">
            <div>
              <Label for="name">Masa Adı</Label>
              <Input
                id="name"
                v-model="tableName"
                :disabled="isLoading"
                class="mt-2"
                placeholder="Masa Adı"
              />
            </div>
          </div>
        </ResourceCard>
        <ResourceCard
          title="Kapasite"
          description="Masanın alabileceği maksimum müşteri sayısı."
          class="flex flex-col gap-4"
        >
          <SeatRenderer :seat-size="seatSize" class="mx-auto" />
          <NumberFieldSimplified
            v-model="seatSize"
            :disabled="isLoading"
            label="Kapasite"
            :max="24"
            :min="1"
          />
        </ResourceCard>
      </div>
      <div class="flex flex-col gap-4">
        <ResourceCard
          title="Masa Ayarları"
          description="Masanın çalışma biçimiyle alakalı ayarlar."
          class="grid grid-cols-2 gap-4"
        >
          <TooltipProvider>
            <TooltipSimplified
              content="Masayı listelerden gizler ama yine de entegrasyonlar görebilir."
            >
              <div class="flex items-center gap-2">
                <Checkbox id="hide" :disabled="isLoading" />
                <Label for="hide"> Masayı Gizle </Label>
              </div>
            </TooltipSimplified>
          </TooltipProvider>
        </ResourceCard>
      </div>
    </div>
  </Section>
</template>
