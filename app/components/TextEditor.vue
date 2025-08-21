<script setup lang="ts">
defineProps<{
  placeholder?: string;
}>();

const TextBox = ref<HTMLDivElement | null>(null);
const text = ref('');

const model = defineModel({
  type: String,
  default: '',
  required: false,
});

watch(text, (n) => {
  model.value = n;
});

onMounted(() => {
  if (!TextBox.value) return;
  let focused = false;
  TextBox.value.addEventListener('focusin', () => {
    focused = true;
  });
  TextBox.value.addEventListener('focusout', () => {
    focused = false;
  });
  TextBox.value.addEventListener('input', async () => {
    if (focused && TextBox.value) {
      text.value = TextBox.value.innerText.trim();
    }
  });
});
</script>

<template>
  <div class="w-full">
    <div
      ref="TextBox"
      tabindex="0"
      role="textbox"
      contenteditable="plaintext-only"
      aria-multiline="true"
      virtualkeyboardpolicy="true"
      translate="no"
      :aria-placeholder="placeholder"
      spellcheck="true"
      :data-placeholder="placeholder"
      :data-is-empty="text.length == 0"
      class="w-full outline-none break-all before:content-[attr(data-placeholder)] before:absolute data-[is-empty=false]:before:hidden before:text-muted-foreground before:text-base"
    ></div>
  </div>
</template>
