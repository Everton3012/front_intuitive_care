<template>
  <div class="app">
    <header class="topbar">
      <div class="brand">🏥 IntuitiveCare</div>

      <nav class="nav">
        <RouterLink to="/operadoras" class="link" active-class="active">
          Operadoras
        </RouterLink>

        <RouterLink to="/estatisticas" class="link" active-class="active">
          Estatísticas
        </RouterLink>

        <button class="update-btn" @click="onUpdateClick" :disabled="updating">
          🔄 {{ updating ? "Atualizando..." : "Atualizar dados" }}
        </button>
      </nav>
    </header>

    <main class="content">
      <RouterView />
    </main>

    <!-- Modal de função desabilitada (produção) -->
    <ConfirmModal
      :show="showDisabled"
      title="Função indisponível"
      message="A atualização de dados está temporariamente desabilitada em produção devido a limitações do servidor. Para atualizar os dados, execute o pipeline localmente."
      confirm-text="Entendi"
      cancel-text=""
      type="info"
      @confirm="showDisabled = false"
      @cancel="showDisabled = false"
    />

    <!-- Modal de confirmação -->
    <ConfirmModal
      :show="showConfirm"
      title="Atualizar dados"
      message="Isso irá baixar os dados mais recentes da ANS e atualizar o banco de dados. O processo pode levar alguns minutos."
      confirm-text="Sim, atualizar"
      cancel-text="Cancelar"
      type="warning"
      :loading="updating"
      @confirm="atualizarDados"
      @cancel="showConfirm = false"
    />

    <!-- Modal de sucesso -->
    <ConfirmModal
      :show="showSuccess"
      title="Atualização concluída!"
      message="Os dados foram atualizados com sucesso. A página será recarregada para exibir as informações mais recentes."
      confirm-text="OK"
      cancel-text=""
      type="success"
      @confirm="onSuccessConfirm"
      @cancel="onSuccessConfirm"
    />

    <!-- Modal de erro -->
    <ConfirmModal
      :show="showError"
      title="Erro na atualização"
      :message="errorMessage"
      confirm-text="Fechar"
      cancel-text=""
      type="info"
      @confirm="showError = false"
      @cancel="showError = false"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import { http } from "./api/http";
import { clearIcCache } from "./utils/cache";
import ConfirmModal from "./components/ConfirmModal.vue";

const isProduction = import.meta.env.VITE_ENV === "production";

const updating = ref(false);
const showDisabled = ref(false);
const showConfirm = ref(false);
const showSuccess = ref(false);
const showError = ref(false);
const errorMessage = ref("");
const router = useRouter();

function onUpdateClick() {
  if (isProduction) {
    showDisabled.value = true;
  } else {
    showConfirm.value = true;
  }
}

async function atualizarDados() {
  if (updating.value) return;

  updating.value = true;

  try {
    await http.post(
      "/api/admin/atualizar",
      null,
      {
        headers: {
          "X-Pipeline-Token": import.meta.env.VITE_PIPELINE_TOKEN,
        },
      }
    );

    clearIcCache();
    showConfirm.value = false;
    showSuccess.value = true;
  } catch (e: any) {
    showConfirm.value = false;
    errorMessage.value = e?.response?.data?.detail || "Erro ao atualizar dados. Tente novamente.";
    showError.value = true;
  } finally {
    updating.value = false;
  }
}

function onSuccessConfirm() {
  showSuccess.value = false;
  
  if (router.currentRoute.value.path === "/operadoras") {
    window.location.reload();
  } else {
    router.push("/operadoras");
  }
}
</script>

<style>
* {
  box-sizing: border-box;
}

body {
  margin: 0;
  padding: 0;
}

.app {
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
}

.topbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 24px;
  border-bottom: 1px solid #ddd;
  background: #fff;
  position: sticky;
  top: 0;
  z-index: 100;
}

.brand {
  font-weight: 700;
  font-size: 18px;
  color: #2e7d32;
}

.nav {
  display: flex;
  gap: 12px;
  align-items: center;
}

.link {
  text-decoration: none;
  color: #333;
  padding: 8px 14px;
  border-radius: 6px;
  font-size: 14px;
  transition: background 0.2s;
}

.link:hover {
  background: #f5f5f5;
}

.active {
  background: #e8f5e9;
  color: #2e7d32;
  font-weight: 500;
}

.update-btn {
  padding: 8px 16px;
  border-radius: 6px;
  border: 1px solid #f57c00;
  background: #fff3e0;
  color: #e65100;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  gap: 6px;
}

.update-btn:hover:not(:disabled) {
  background: #ffe0b2;
}

.update-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.content {
  max-width: 1100px;
  margin: 0 auto;
  padding: 24px;
}
</style>