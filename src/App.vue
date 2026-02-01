<template>
  <div class="app">
    <header class="topbar">
      <div class="brand">IntuitiveCare</div>

      <nav class="nav">
        <RouterLink to="/operadoras" class="link" active-class="active">
          Operadoras
        </RouterLink>

        <RouterLink to="/estatisticas" class="link" active-class="active">
          Estatísticas
        </RouterLink>

        <!-- BOTÃO GLOBAL -->
        <button class="update-btn" @click="atualizarDados" :disabled="updating">
          {{ updating ? "Atualizando..." : "Atualizar dados" }}
        </button>
      </nav>
    </header>

    <main class="content">
      <RouterView />
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import { http } from "./api/http";
import { clearIcCache } from "./utils/cache";

const updating = ref(false);
const router = useRouter();

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

    // limpa TODO cache do app
    clearIcCache();

    if (router.currentRoute.value.path === "/operadoras") {
      window.location.reload();
    } else {
      router.push("/");
    }
    alert("Dados atualizados com sucesso!");
  } catch (e: any) {
    alert(e?.response?.data?.detail || "Erro ao atualizar dados");
  } finally {
    updating.value = false;
  }
}
</script>

<style>
.app {
  font-family: Arial, sans-serif;
}

.topbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 18px;
  border-bottom: 1px solid #ddd;
}

.brand {
  font-weight: 700;
}

.nav {
  display: flex;
  gap: 12px;
  align-items: center;
}

.link {
  text-decoration: none;
  color: #333;
  padding: 6px 10px;
  border-radius: 6px;
}

.active {
  background: #eee;
}

.update-btn {
  padding: 6px 12px;
  border-radius: 6px;
  border: 1px solid #999;
  background: #f5f5f5;
  cursor: pointer;
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
