<script setup lang="ts">
import type { HTMLAttributes } from 'vue';
import { Label } from '../ui/label';
import {
  NumberField,
  NumberFieldContent,
  NumberFieldDecrement,
  NumberFieldIncrement,
  NumberFieldInput,
} from '../ui/number-field';

const props = defineProps<{
  label?: string;
  disableDecrement?: boolean;
  disableIncrement?: boolean;
  min?: number;
  max?: number;
  disabled?: boolean;
  class?: HTMLAttributes['class'];
}>();

const modelValue = defineModel({
  type: Number,
  default: 0,
});

const emit = defineEmits(['updated']);
</script>

<template>
  <NumberField v-model="modelValue" :min="min" :max="max" :disabled="disabled">
    <Label v-if="label">{{ label }}</Label>
    <NumberFieldContent>
      <NumberFieldDecrement v-if="!disableDecrement" @click="emit('updated')" />
      <NumberFieldInput :class="props.class" />
      <NumberFieldIncrement v-if="!disableIncrement" @click="emit('updated')" />
    </NumberFieldContent>
  </NumberField>
</template>
