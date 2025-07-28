<script setup lang="ts">
import SeatRenderer from '../seatrenderer/SeatRenderer.vue';
import Code from '../template/Code.vue';
import QuickStartCard from '../template/QuickStartCard.vue';
import RadioSelect from '../template/RadioSelect.vue';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import {
  NumberFieldInput,
  NumberField,
  NumberFieldContent,
  NumberFieldDecrement,
  NumberFieldIncrement,
} from '../ui/number-field';
import Section from './Section.vue';
import SectionHeading from './SectionHeading.vue';

const seats = [
  {
    size: 2,
    name: 'Ön Kapı #1',
  },
  {
    size: 2,
    name: 'Ön Kapı #2',
  },
  {
    size: 2,
    name: 'Ön Kapı #3',
  },
  {
    size: 4,
    name: 'Avlu #1',
  },
];
</script>

<template>
  <Section>
    <SectionHeading> Bugün Başlayın </SectionHeading>
    <div class="min-h-[60vh] grid-cols-1 mt-8 grid lg:grid-cols-3 gap-6">
      <QuickStartCard>
        <Code class="w-fit">01</Code>
        <h3 class="text-2xl">Posgen Mağazanızı Oluşturun</h3>
        <span class="text-muted-foreground leading-6 [word-spacing:8px]">
          Kullanacağınız mağazanıza uyacak şekilde mağaza türünüzü seçerek kolay
          bir şekilde oluşturun.
        </span>
        <div
          class="border border-b-0 rounded-lg relative flex flex-col p-2.5 gap-2 w-full mt-auto rounded-b-none"
        >
          <h4 class="ml-2 font-semibold text-muted-foreground">Mağaza Türü</h4>
          <RadioSelect>
            <h4 class="text-lg">Kafe</h4>
          </RadioSelect>
          <RadioSelect :selected="true">
            <h4 class="text-lg">Restoran</h4>
          </RadioSelect>
          <RadioSelect>
            <h4 class="text-lg">Market</h4>
          </RadioSelect>
        </div>
      </QuickStartCard>
      <QuickStartCard class="pr-0 overflow-hidden">
        <Code class="w-fit">02</Code>
        <h3 class="text-2xl mr-4">Mağazanızı Ayarlayın</h3>
        <span class="text-muted-foreground leading-6 [word-spacing:8px] mr-4">
          Mağazanızdaki ürünleri ve entegrasyonları kolay bir şekilde
          ayarlayarak kullanıma hazır hale getirin.
        </span>
        <div
          class="border rounded-lg ml-auto w-[90%] flex flex-col gap-2.5 mt-auto p-4 rounded-b-none rounded-r-none border-b-0 border-r-0"
        >
          <h4 class="font-semibold">Temel Bilgiler</h4>
          <div>
            <Label class="text-xs"> Ürün Adı </Label>
            <Input
              class="text-xs mt-1 opacity-100!"
              model-value="Iced Caramel Macchiato"
              :disabled="true"
            />
          </div>
          <h4 class="font-semibold">Fiyatlandırma</h4>
          <div class="flex flex-col gap-2">
            <NumberField :model-value="85">
              <Label class="text-xs"> Ürün Fiyatı (₺) </Label>
              <NumberFieldContent>
                <NumberFieldDecrement />
                <NumberFieldInput
                  disabled
                  class="disabled:opacity-100 disabled:cursor-text"
                />
                <NumberFieldIncrement />
              </NumberFieldContent>
            </NumberField>
            <NumberField :model-value="8">
              <Label class="text-xs"> KDV (%) </Label>
              <NumberFieldContent>
                <NumberFieldDecrement />
                <NumberFieldInput
                  disabled
                  class="disabled:opacity-100 disabled:cursor-text"
                />
                <NumberFieldIncrement />
              </NumberFieldContent>
            </NumberField>
          </div>
        </div>
      </QuickStartCard>
      <QuickStartCard>
        <Code class="w-fit">03</Code>
        <h3 class="text-2xl">Kullanmaya Başlayın</h3>
        <span class="text-muted-foreground leading-6 [word-spacing:8px]">
          Posgen Web Uygulaması, Masaüstü Uygulaması veya Mobil Uygulamasını
          kullanarak satışlara başlayın.
        </span>
        <div
          class="flex flex-col border rounded-lg h-[60%] mt-auto min-w-[240px] w-[80%] rounded-b-none border-b-0 mx-auto"
        >
          <div class="p-2.5 px-4">
            <h4 class="font-semibold">Masalar</h4>
          </div>
          <div class="px-4 p-2.5 pt-0 grid grid-cols-2 gap-4 overflow-hidden">
            <div
              v-for="seat of seats"
              :key="seat.name"
              class="flex flex-col gap-3 py-2.5 rounded-md border items-center"
            >
              <SeatRenderer
                renderer-size="extrasmall"
                orientation="horizontal"
                :seat-size="seat.size"
              />
              <div class="flex flex-col text-center">
                <span class="text-xs font-semibold">{{ seat.name }}</span>
                <span class="text-xs">{{ seat.size }} Kişilik</span>
              </div>
            </div>
          </div>
        </div>
      </QuickStartCard>
    </div>
  </Section>
</template>
