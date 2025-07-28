<script setup lang="ts">
import { cn } from '@/lib/utils';
import { Button } from '../ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { ref, watch } from 'vue';
import type { APIv2CollectionResponse } from '@/types/IconifyAPI';
import axios from 'axios';
import Slider from '../slider/Slider.vue';
import { ScrollArea } from '../ui/scroll-area';
import { Icon } from '@iconify/vue';
import SliderItem from '../slider/SliderItem.vue';
import errorHandler from '@/lib/errorHandler';

defineProps<{
  modelValue?: string;
  disabled?: boolean;
}>();

const emit = defineEmits(['update:modelValue']);

const value = ref('');

const iconifyResponse = ref<APIv2CollectionResponse | null>(null);

const categories = ref<Array<string>>([]);
const selectedCategoryIcons = ref<Array<string>>([]);
const selectedCategory = ref('');
const selectedIcon = ref('');

const popoverOpen = ref(false);

async function GetIcons() {
  const res = await axios<APIv2CollectionResponse>({
    method: 'GET',
    url: 'collection?prefix=solar',
    baseURL: 'https://api.iconify.design',
  }).catch(errorHandler);

  if (!res) return;

  iconifyResponse.value = res.data;

  categories.value = Object.keys(res.data.categories || {});

  SetCategory(categories.value[0]);
}

function SetCategory(category: string) {
  selectedCategoryIcons.value = [];
  if (!iconifyResponse.value || !iconifyResponse.value.categories) return;
  selectedCategory.value = category;

  for (const icon of iconifyResponse.value.categories[category]) {
    if (icon.includes('bold') && !icon.includes('duotone'))
      selectedCategoryIcons.value.push(icon);
  }
}

function SetIcon(icon: string) {
  selectedIcon.value = `${iconifyResponse.value?.prefix}:${icon}`;
  popoverOpen.value = false;
}

GetIcons();

watch(selectedIcon, (n) => {
  emit('update:modelValue', n);
});
</script>

<template>
  <Popover v-model:open="popoverOpen">
    <PopoverTrigger class="w-full">
      <Button
        :disabled="disabled"
        variant="outline"
        :class="
          cn(
            'justify-start text-left font-normal w-full',
            !value && 'text-muted-foreground'
          )
        "
      >
        <Icon v-if="selectedIcon" :icon="selectedIcon" />
        {{ selectedIcon ? 'Ikon Seçildi' : 'Ikon Seçiniz' }}
      </Button>
    </PopoverTrigger>
    <PopoverContent position-strategy="absolute" class="w-full max-w-[375px]">
      <div class="flex flex-col">
        <Slider>
          <SliderItem
            v-for="category of categories"
            :key="category"
            :data-selected="selectedCategory == category"
            @click="SetCategory(category)"
          >
            {{ category }}
          </SliderItem>
        </Slider>
        <div class="border-t mt-4 pt-4 flex flex-wrap max-h-[300px]">
          <ScrollArea class="max-h-[300px] flex items-center">
            <div
              :key="selectedCategory"
              class="flex flex-wrap gap-3 pb-4 w-fit"
            >
              <figure
                v-for="icon of selectedCategoryIcons"
                :key="icon"
                @click="SetIcon(icon)"
              >
                <Icon
                  class="size-8 hover:bg-secondary rounded-sm"
                  :icon="`${iconifyResponse?.prefix}:${icon}`"
                />
              </figure>
              <!-- <Skeleton class="size-10" v-for="n in 134" /> -->
            </div>
          </ScrollArea>
          <!-- Ikonlar -->
        </div>
      </div>
    </PopoverContent>
  </Popover>
</template>
