<script setup lang="ts">
defineProps<{
  show: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  loading?: boolean;
  type?: "warning" | "success" | "info";
}>();

const emit = defineEmits<{
  (e: "confirm"): void;
  (e: "cancel"): void;
}>();
</script>

<template>
  <Teleport to="body">
    <div v-if="show" class="overlay" @click.self="$emit('cancel')">
      <div class="modal">
        <div class="icon" :class="type || 'warning'">
          <span v-if="type === 'success'">✓</span>
          <span v-else-if="type === 'info'">ℹ</span>
          <span v-else>⚠</span>
        </div>

        <h2 class="title">{{ title }}</h2>
        <p class="message">{{ message }}</p>

        <div class="actions">
          <button 
            v-if="cancelText !== ''" 
            class="btn btn-cancel" 
            @click="$emit('cancel')"
            :disabled="loading"
          >
            {{ cancelText || "Cancelar" }}
          </button>

          <button 
            class="btn btn-confirm" 
            :class="type || 'warning'"
            @click="$emit('confirm')"
            :disabled="loading"
          >
            <span v-if="loading" class="spinner"></span>
            {{ loading ? "Aguarde..." : (confirmText || "Confirmar") }}
          </button>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<style scoped>
.overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal {
  background: #fff;
  border-radius: 12px;
  padding: 24px;
  max-width: 400px;
  width: 90%;
  text-align: center;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  animation: fadeIn 0.2s ease;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

.icon {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 16px;
  font-size: 28px;
}

.icon.warning {
  background: #fff3e0;
  color: #f57c00;
}

.icon.success {
  background: #e8f5e9;
  color: #2e7d32;
}

.icon.info {
  background: #e3f2fd;
  color: #1976d2;
}

.title {
  margin: 0 0 8px;
  font-size: 18px;
  color: #333;
}

.message {
  margin: 0 0 20px;
  color: #666;
  font-size: 14px;
  line-height: 1.5;
}

.actions {
  display: flex;
  gap: 12px;
  justify-content: center;
}

.btn {
  padding: 10px 20px;
  border-radius: 6px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  gap: 8px;
}

.btn-cancel {
  background: #f5f5f5;
  border: 1px solid #ccc;
  color: #333;
}

.btn-cancel:hover:not(:disabled) {
  background: #eee;
}

.btn-confirm {
  border: none;
  color: #fff;
}

.btn-confirm.warning {
  background: #f57c00;
}

.btn-confirm.warning:hover:not(:disabled) {
  background: #e65100;
}

.btn-confirm.success {
  background: #2e7d32;
}

.btn-confirm.success:hover:not(:disabled) {
  background: #1b5e20;
}

.btn-confirm.info {
  background: #1976d2;
}

.btn-confirm.info:hover:not(:disabled) {
  background: #1565c0;
}

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.spinner {
  width: 14px;
  height: 14px;
  border: 2px solid #fff;
  border-top-color: transparent;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>