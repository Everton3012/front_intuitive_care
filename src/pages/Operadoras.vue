<script setup lang="ts">
import { ref, watch } from "vue";
import { useRouter } from "vue-router";
import { listarOperadoras, type Operadora } from "../services/operadoras.service";
import SearchBar from "../components/SearchBar.vue";
import Pagination from "../components/Pagination.vue";
import OperadorasTable from "../components/OperadorasTable.vue";

const router = useRouter();

const q = ref("");
const situacao = ref("");
const page = ref(1);
const limit = ref(10);
const total = ref(0);
const rows = ref<Operadora[]>([]);
const loading = ref(false);
const error = ref<string | null>(null);

async function fetchOperadoras() {
  loading.value = true;
  error.value = null;
  try {
    const resp = await listarOperadoras(page.value, limit.value, q.value, situacao.value);
    rows.value = resp.data;
    total.value = resp.total;
  } catch (e: any) {
    error.value = e?.response?.data?.detail || "Erro ao carregar operadoras";
  } finally {
    loading.value = false;
  }
}

function buscar() {
  page.value = 1;
  fetchOperadoras();
}

function onSituacaoChange() {
  page.value = 1;
  fetchOperadoras();
}

function irDetalhe(cnpj: string) {
  router.push(`/operadoras/${cnpj}`);
}

watch([page, limit], fetchOperadoras);

// Carrega inicial
fetchOperadoras();
</script>

<template>
  <div>
    <h1>Operadoras</h1>

    <div style="display: flex; gap: 12px; align-items: center; margin-bottom: 16px; flex-wrap: wrap;">
      <SearchBar v-model="q" placeholder="Buscar por CNPJ ou Razão Social" @search="buscar" />

      <select 
        v-model="situacao" 
        @change="onSituacaoChange"
        style="padding: 8px 12px; border-radius: 4px; border: 1px solid #ccc; font-size: 14px;"
      >
        <option value="">Todas as situações</option>
        <option value="ATIVA">Ativas</option>
        <option value="CANCELADA">Canceladas</option>
      </select>
    </div>

    <div v-if="error" style="color:red; margin: 10px 0;">{{ error }}</div>
    <div v-if="loading">Carregando...</div>

    <OperadorasTable v-if="!loading" :rows="rows" @select="irDetalhe" />

    <Pagination v-model:page="page" :limit="limit" :total="total" />
  </div>
</template>