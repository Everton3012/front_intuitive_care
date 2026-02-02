<script setup lang="ts">
import { onMounted, ref } from "vue";
import { buscarEstatisticas, type Estatisticas } from "../services/estatisticas.service";
import { formatMoney, formatCnpj } from "../utils/formatters";

const data = ref<Estatisticas | null>(null);
const loading = ref(false);
const error = ref<string | null>(null);

async function fetchStats() {
  loading.value = true;
  error.value = null;
  try {
    data.value = await buscarEstatisticas();
  } catch (e: any) {
    error.value = e?.response?.data?.detail || "Erro ao carregar estatísticas";
  } finally {
    loading.value = false;
  }
}

function toNumber(x: string | number): number {
  return typeof x === "number" ? x : Number(x);
}

onMounted(fetchStats);
</script>

<template>
  <div>
    <h1>Estatísticas</h1>

    <div v-if="error" class="error">{{ error }}</div>
    <div v-if="loading">Carregando...</div>

    <div v-if="data && !loading" class="cards">
      <div class="card">
        <div class="card-title">Total de despesas</div>
        <div class="card-value">{{ formatMoney(data.total_despesas) }}</div>
      </div>

      <div class="card">
        <div class="card-title">Média de despesas</div>
        <div class="card-value">{{ formatMoney(data.media_despesas) }}</div>
      </div>
    </div>

    <h2>Top 5 Operadoras</h2>
    <table v-if="data && !loading" class="table">
      <thead>
        <tr>
          <th>CNPJ</th>
          <th>Razão Social</th>
          <th>Total</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="op in data.top_5_operadoras" :key="op.cnpj">
          <td>{{ formatCnpj(op.cnpj) }}</td>
          <td>{{ op.razao_social }}</td>
          <td>{{ formatMoney(toNumber(op.total_despesas)) }}</td>
        </tr>
      </tbody>
    </table>

    <h2>Top 5 UFs por despesas</h2>
    <table v-if="data && !loading" class="table">
      <thead>
        <tr>
          <th>UF</th>
          <th>Total</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="uf in data.despesas_por_uf_top5" :key="uf.uf">
          <td>{{ uf.uf }}</td>
          <td>{{ formatMoney(toNumber(uf.total_despesas)) }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style scoped>
.error {
  color: red;
  margin: 10px 0;
}

.cards {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}

.card {
  border: 1px solid #ddd;
  padding: 14px;
  border-radius: 10px;
}

.card-title {
  font-weight: 700;
}

.card-value {
  font-size: 20px;
  margin-top: 6px;
  color: #2e7d32;
}

h2 {
  margin-top: 24px;
  margin-bottom: 12px;
}

.table {
  width: 100%;
  border-collapse: collapse;
}

.table th,
.table td {
  padding: 10px 12px;
  text-align: left;
  border-bottom: 1px solid #ddd;
}

.table th {
  background: #f5f5f5;
  font-weight: 600;
}

.table tr:hover {
  background: #f9f9f9;
}
</style>