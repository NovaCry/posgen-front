<script lang="ts" setup>
defineProps<{
  selectionId: string;
}>();

const selection = defineModel('selection', {
  type: String,
  required: true,
});
</script>

<template>
  <div
    :data-selected="selection == selectionId"
    class="bg-accent flex items-center data-[selected=true]:ring-2 ring-primary data-[selected=true]:bg-secondary p-2.5 px-4 rounded-lg transition cursor-pointer font-mono leading-4"
    @click="selection = selectionId"
  >
    <slot />
  </div>
</template>
