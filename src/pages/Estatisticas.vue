<script setup lang="ts">
import { onMounted, ref } from "vue";
import { http } from "../api/http";
import { getCache, setCache, CACHE_TTL_30_DAYS } from "../utils/cache";

type Estatisticas = {
  total_despesas: number;
  media_despesas: number;
  top_5_operadoras: Array<{ cnpj: string; razao_social: string; total_despesas: string | number }>;
  despesas_por_uf_top5: Array<{ uf: string; total_despesas: string | number }>;
};

const data = ref<Estatisticas | null>(null);
const loading = ref(false);
const error = ref<string | null>(null);

async function fetchStats() {
  loading.value = true;
  error.value = null;

  const key = "ic:estatisticas";

  const cached = getCache<Estatisticas>(key, CACHE_TTL_30_DAYS);
  if (cached) {
    data.value = cached;
    loading.value = false;
    return;
  }

  try {
    const resp = await http.get<Estatisticas>("/api/estatisticas");
    data.value = resp.data;
    setCache(key, resp.data);
  } catch (e: any) {
    error.value = e?.response?.data?.detail || "Erro ao carregar estatísticas";
  } finally {
    loading.value = false;
  }
}

function money(v: number) {
  return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(v);
}

function toNumber(x: string | number) {
  return typeof x === "number" ? x : Number(x);
}

onMounted(fetchStats);
</script>

<template>
  <div>
    <h1>Estatísticas</h1>

    <div v-if="error" style="color:red; margin: 10px 0;">{{ error }}</div>
    <div v-if="loading">Carregando...</div>

    <div v-if="data && !loading" style="display:grid; grid-template-columns: 1fr 1fr; gap: 12px;">
      <div style="border:1px solid #ddd; padding: 14px; border-radius: 10px;">
        <div style="font-weight:700;">Total de despesas</div>
        <div style="font-size: 20px; margin-top: 6px;">{{ money(data.total_despesas) }}</div>
      </div>

      <div style="border:1px solid #ddd; padding: 14px; border-radius: 10px;">
        <div style="font-weight:700;">Média de despesas</div>
        <div style="font-size: 20px; margin-top: 6px;">{{ money(data.media_despesas) }}</div>
      </div>
    </div>

    <h2 style="margin-top: 18px;">Top 5 Operadoras</h2>
    <table v-if="data && !loading" border="1" cellspacing="0" cellpadding="8" width="100%">
      <thead>
        <tr>
          <th>CNPJ</th>
          <th>Razão Social</th>
          <th>Total</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="op in data.top_5_operadoras" :key="op.cnpj">
          <td>{{ op.cnpj }}</td>
          <td>{{ op.razao_social }}</td>
          <td>{{ money(toNumber(op.total_despesas)) }}</td>
        </tr>
      </tbody>
    </table>

    <h2 style="margin-top: 18px;">Top 5 UFs por despesas</h2>
    <table v-if="data && !loading" border="1" cellspacing="0" cellpadding="8" width="100%">
      <thead>
        <tr>
          <th>UF</th>
          <th>Total</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="uf in data.despesas_por_uf_top5" :key="uf.uf">
          <td>{{ uf.uf }}</td>
          <td>{{ money(toNumber(uf.total_despesas)) }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
