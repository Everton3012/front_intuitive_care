<script setup lang="ts">
import { ref, watch } from "vue";
import { useRouter } from "vue-router";
import { http } from "../api/http";
import SearchBar from "../components/SearchBar.vue";
import Pagination from "../components/Pagination.vue";
import OperadorasTable from "../components/OperadorasTable.vue";
import { getCache, setCache, CACHE_TTL_30_DAYS } from "../utils/cache";


type Operadora = {
  cnpj: string;
  registro_ans: string | null;
  razao_social: string;
  modalidade: string | null;
  uf: string | null;
  situacao: string | null;
};

const router = useRouter();

const q = ref("");
const page = ref(1);
const limit = ref(10);
const total = ref(0);
const rows = ref<Operadora[]>([]);
const loading = ref(false);
const error = ref<string | null>(null);

type OperadorasResponse = {
  data: Operadora[];
  total: number;
  page: number;
  limit: number;
};

function makeCacheKey() {
  const query = (q.value || "").trim().toLowerCase();
  return `ic:operadoras:p=${page.value}:l=${limit.value}:q=${encodeURIComponent(query)}`;
}

async function fetchOperadoras() {
  loading.value = true;
  error.value = null;

  const cacheKey = makeCacheKey();
  const cached = getCache<OperadorasResponse>(cacheKey, CACHE_TTL_30_DAYS);

  if (cached) {
    rows.value = cached.data;
    total.value = cached.total;
    loading.value = false;
    return;
  }

  try {
    const resp = await http.get<OperadorasResponse>("/api/operadoras", {
      params: { page: page.value, limit: limit.value, q: q.value || undefined },
    });

    rows.value = resp.data.data;
    total.value = resp.data.total;

    setCache(cacheKey, resp.data);
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

function irDetalhe(cnpj: string) {
  router.push(`/operadoras/${cnpj}`);
}

watch([page, limit], fetchOperadoras, { immediate: true });
</script>

<template>
  <div>
    <h1>Operadoras</h1>

    <SearchBar v-model="q" placeholder="Buscar por CNPJ ou Razão Social" @search="buscar" />

    <div v-if="error" style="color:red; margin: 10px 0;">{{ error }}</div>
    <div v-if="loading">Carregando...</div>

    <OperadorasTable v-if="!loading" :rows="rows" @select="irDetalhe" />

    <Pagination v-model:page="page" :limit="limit" :total="total" />
  </div>
</template>
