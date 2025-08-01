<script setup lang="ts">
import type { HTMLAttributes, InputTypeHTMLAttribute } from 'vue';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { useVModel } from '@vueuse/core';

const props = defineProps<{
  label: string;
  defaultValue?: string | number;
  modelValue?: string | number;
  class?: HTMLAttributes['class'];
  placeholder?: string;
  type?: InputTypeHTMLAttribute;
}>();

const emits = defineEmits<{
  (e: 'update:modelValue', payload: string | number): void;
}>();

const modelValue = useVModel(props, 'modelValue', emits, {
  passive: true,
  defaultValue: props.defaultValue,
});
</script>

<template>
  <div>
    <Label>{{ label }}</Label>
    <Input
      v-model="modelValue"
      class="mt-1"
      :placeholder="placeholder"
      :type="type"
    />
  </div>
</template>
