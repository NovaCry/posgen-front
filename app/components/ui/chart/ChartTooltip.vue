<script setup lang="ts">
defineProps<{
  title?: string;
  data: {
    name: string;
    color: string;
    value: any;
  }[];
}>();
</script>

<template>
  <div class="border rounded-xl bg-background">
    <div class="border-b p-2.5">
      <h4 class="text-base font-semibold">{{ title }}</h4>
    </div>
    <div class="min-w-[180px] p-3 flex flex-col gap-1">
      <div v-for="(item, key) in data" :key="key" class="flex justify-between">
        <div class="flex items-center">
          <div
            class="w-1 h-4 mr-2 rounded-sm"
            :style="`background-color: ${item.color};`"
          />
          <span class="text-sm">{{ item.name }}</span>
        </div>
        <span class="font-semibold ml-4 text-sm">{{ item.value }}</span>
      </div>
    </div>
  </div>
</template>
