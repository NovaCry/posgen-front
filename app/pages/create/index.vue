<template>
  <div class="flex items-center justify-center w-screen h-screen p-4">
    <div
      class="grid grid-cols-1 lg:grid-cols-9 max-w-[95%] lg:max-w-[80%] border max-h-[90%] w-full min-h-[60%] h-auto rounded-xl overflow-hidden"
    >
      <div
        class="col-span-1 lg:col-span-5 lg:border-r p-4 lg:p-6 py-6 lg:py-8 flex flex-col gap-6"
      >
        <h1 class="text-xl lg:text-2xl font-semibold">Dükkan Oluştur</h1>
        <div class="flex flex-col gap-6 my-auto">
          <div class="flex flex-col gap-2">
            <Label for="name">Mağaza Adı</Label>
            <Input
              id="name"
              v-model="Name"
              :disabled="Processing"
              placeholder="Mağazanızın Adı..."
            />
          </div>
          <div class="flex flex-col gap-2">
            <Label>Mağaza Türü</Label>
            <Select>
              <SelectTrigger :disabled="true">
                <SelectValue placeholder="Mağaza Türü Seçiniz" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="kozmetik"> Kozmetik </SelectItem>
                  <SelectItem value="eczane"> Eczane </SelectItem>
                  <SelectItem value="market"> Market </SelectItem>
                  <SelectItem value="giyim"> Giyim </SelectItem>
                  <SelectItem value="restoran"> Restoran </SelectItem>
                  <SelectItem value="elektronik"> Elektronik </SelectItem>
                  <SelectItem value="kırtasiye"> Kırtasiye </SelectItem>
                  <SelectItem value="mobilya"> Mobilya </SelectItem>
                  <SelectItem value="tekstil"> Tekstil </SelectItem>
                  <SelectItem value="dekorasyon"> Dekorasyon </SelectItem>
                  <SelectItem value="yapı"> Yapı </SelectItem>
                  <SelectItem value="aksesuar"> Aksesuar </SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label>Şehir</Label>
              <Select>
                <SelectTrigger :disabled="true">
                  <SelectValue placeholder="Dükkanın Bulunduğu Şehir..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="ankara"> Ankara </SelectItem>
                    <SelectItem value="istanbul"> İstanbul </SelectItem>
                    <SelectItem value="kocaeli"> Kocaeli </SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>İlçe</Label>
              <Select>
                <SelectTrigger :disabled="true">
                  <SelectValue placeholder="Dükkanın Bulunduğu İlçe..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="ankara"> Ankara </SelectItem>
                    <SelectItem value="istanbul"> İstanbul </SelectItem>
                    <SelectItem value="kocaeli"> Kocaeli </SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div class="flex flex-col gap-2">
            <Label>Mahalle</Label>
            <Select>
              <SelectTrigger :disabled="true">
                <SelectValue placeholder="Dükkanın Bulunduğu Mahalle..." />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="ankara"> Ankara </SelectItem>
                  <SelectItem value="istanbul"> İstanbul </SelectItem>
                  <SelectItem value="kocaeli"> Kocaeli </SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        </div>
        <Button
          :disabled="Processing"
          class="w-full sm:w-fit ml-auto"
          @click="Create()"
        >
          <Loader2 v-if="Processing" class="animate-spin" />
          Devam Et
          <ArrowRight />
        </Button>
      </div>
      <div class="hidden lg:flex lg:col-span-4">
        <Skeleton class="w-full h-full rounded-none" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import Button from '@/components/ui/button/Button.vue';
import Input from '@/components/ui/input/Input.vue';
import Label from '@/components/ui/label/Label.vue';
import { ref } from 'vue';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type Shop from '@/types/api/Shop';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowRight, Loader2 } from 'lucide-vue-next';
import createProtectedApiInterface from '@/api/protected';
import { toast } from 'vue-sonner';

const router = useRouter();

definePageMeta({
  name: 'Mağaza Oluştur',
});

const protectedApiInterface = createProtectedApiInterface();

const Processing = ref(false);

const Name = ref('');

const user = useUser();

async function Create() {
  if (!Name.value.trim()) {
    toast.error('Mağaza adı boş olamaz!');
    return;
  }

  Processing.value = true;
  await protectedApiInterface<Shop>({
    url: 'shop/create',
    method: 'POST',
    data: {
      name: Name.value,
    },
  }).catch((err) =>
    useErrorHandler(err, {
      afterAll() {
        Processing.value = false;
      },
    })
  );

  const listResponse = await protectedApiInterface<Shop[]>({
    url: 'shop/list',
    method: 'GET',
  }).catch(useErrorHandler);

  if (!listResponse) {
    Processing.value = false;
    return;
  }

  user.patch({
    shops: listResponse.data,
  });
  user.save();

  Processing.value = false;

  router.push('/dashboard/shop');
}
</script>
