<script setup lang="ts">
import { ref, watch } from 'vue';
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
  label: string;
  disableDecrement?: boolean;
  disableIncrement?: boolean;
  modelValue?: number;
  min?: number;
  max?: number;
  disabled?: boolean;
  class?: HTMLAttributes['class'];
}>();

const modelValue = defineModel({
  type: Number,
  default: 0
})
</script>

<template>
  <NumberField v-model="modelValue" :min="min" :max="max" :disabled="disabled">
    <Label>{{ label }}</Label>
    <NumberFieldContent>
      <NumberFieldDecrement v-if="!disableDecrement" />
      <NumberFieldInput :class="props.class" />
      <NumberFieldIncrement v-if="!disableIncrement" />
    </NumberFieldContent>
  </NumberField>
</template>
