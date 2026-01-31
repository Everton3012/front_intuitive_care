<script setup lang="ts">
const props = defineProps<{
  page: number;
  limit: number;
  total: number;
}>();

const emit = defineEmits<{
  (e: "update:page", value: number): void;
}>();

function prev() {
  if (props.page > 1) emit("update:page", props.page - 1);
}
function next() {
  if (props.page * props.limit < props.total) emit("update:page", props.page + 1);
}
</script>

<template>
  <div class="pager">
    <button :disabled="page === 1" @click="prev">Anterior</button>
    <div>Página {{ page }} • Total: {{ total }}</div>
    <button :disabled="page * limit >= total" @click="next">Próxima</button>
  </div>
</template>

<style scoped>
.pager { display:flex; justify-content: space-between; align-items: center; margin-top: 12px; }
button { padding: 8px 12px; border: 1px solid #ccc; border-radius: 8px; cursor: pointer; }
button:disabled { opacity: 0.5; cursor: not-allowed; }
</style>
