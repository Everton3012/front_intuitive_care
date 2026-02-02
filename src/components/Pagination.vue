<script setup lang="ts">
import { computed } from "vue";

const props = defineProps<{
  page: number;
  limit: number;
  total: number;
}>();

const emit = defineEmits<{
  (e: "update:page", value: number): void;
}>();

const totalPages = computed(() => Math.ceil(props.total / props.limit));

function prev() {
  if (props.page > 1) emit("update:page", props.page - 1);
}

function next() {
  if (props.page < totalPages.value) emit("update:page", props.page + 1);
}
</script>

<template>
  <div class="pager">
    <button :disabled="page === 1" @click="prev" class="btn">
      ← Anterior
    </button>
    
    <div class="info">
      Página {{ page }} de {{ totalPages }} • {{ total }} registros
    </div>
    
    <button :disabled="page >= totalPages" @click="next" class="btn">
      Próxima →
    </button>
  </div>
</template>

<style scoped>
.pager {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 16px;
  padding: 12px 0;
  border-top: 1px solid #eee;
}

.info {
  color: #666;
  font-size: 14px;
}

.btn {
  padding: 8px 16px;
  border: 1px solid #ccc;
  border-radius: 4px;
  background: #fff;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.2s;
}

.btn:hover:not(:disabled) {
  background: #f5f5f5;
  border-color: #999;
}

.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>