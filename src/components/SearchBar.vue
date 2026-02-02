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
    <button class="btn" @click="$emit('search')">🔍 Buscar</button>
  </div>
</template>

<style scoped>
.bar {
  display: flex;
  gap: 8px;
  flex: 1;
}

.input {
  flex: 1;
  padding: 10px 14px;
  border: 1px solid #ccc;
  border-radius: 6px;
  font-size: 14px;
  transition: border-color 0.2s;
}

.input:focus {
  outline: none;
  border-color: #007bff;
}

.input::placeholder {
  color: #999;
}

.btn {
  padding: 10px 16px;
  border: 1px solid #007bff;
  border-radius: 6px;
  background: #007bff;
  color: #fff;
  font-size: 14px;
  cursor: pointer;
  transition: background 0.2s;
}

.btn:hover {
  background: #0056b3;
}
</style>