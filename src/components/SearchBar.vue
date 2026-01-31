<script setup lang="ts">
const props = defineProps<{
  modelValue: string;
  placeholder?: string;
}>();

const emit = defineEmits<{
  (e: "update:modelValue", value: string): void;
  (e: "search"): void;
}>();

function onInput(e: Event) {
  emit("update:modelValue", (e.target as HTMLInputElement).value);
}
</script>

<template>
  <div class="bar">
    <input
      :value="props.modelValue"
      @input="onInput"
      @keyup.enter="$emit('search')"
      :placeholder="placeholder || 'Buscar...'"
      class="input"
    />
    <button class="btn" @click="$emit('search')">Buscar</button>
  </div>
</template>

<style scoped>
.bar { display:flex; gap: 8px; margin: 12px 0; }
.input { flex: 1; padding: 10px; border: 1px solid #ccc; border-radius: 8px; }
.btn { padding: 10px 14px; border: 1px solid #ccc; border-radius: 8px; cursor: pointer; }
</style>
