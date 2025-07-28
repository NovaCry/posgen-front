<script setup lang="ts">
import type { HTMLAttributes } from 'vue';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../ui/card';

defineProps<{
  title: string;
  description: string;
  class?: HTMLAttributes['class'];
}>();
</script>

<template>
  <Card>
    <CardHeader>
      <CardTitle>{{ title }}</CardTitle>
      <CardDescription>{{ description }}</CardDescription>
    </CardHeader>
    <CardContent :class="$props.class">
      <slot />
    </CardContent>
  </Card>
</template>
