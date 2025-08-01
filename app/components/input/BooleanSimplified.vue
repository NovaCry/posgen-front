<script setup lang="ts">
import { ref, watch } from 'vue';
import { Label } from '../ui/label';

const props = defineProps<{
  label: string;
  modelValue?: boolean;
}>();

const value = ref(props.modelValue || false);

const emit = defineEmits(['update:modelValue']);

watch(value, (n) => {
  emit('update:modelValue', n);
});
</script>

<template>
  <div>
    <Label>
      {{ label }}
    </Label>
    <div
      :data-value="value"
      class="group bg-secondary p-1 rounded-lg grid grid-cols-2 mt-1 gap-1"
    >
      <button
        class="group-data-[value=true]:bg-primary group-data-[value=true]:border-b-primary-border border-b-transparent border-b-2 transition-colors p-2 rounded-md text-center text-sm"
        @click="value = true"
      >
        Evet
      </button>
      <button
        class="group-data-[value=false]:bg-primary group-data-[value=false]:border-b-primary-border border-b-transparent border-b-2 transition-colors p-2 rounded-md text-center text-sm"
        @click="value = false"
      >
        Hayır
      </button>
    </div>
  </div>
</template>
