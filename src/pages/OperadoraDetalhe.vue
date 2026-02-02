<script setup lang="ts">
import { onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import {
  buscarOperadora,
  buscarDespesas,
  type Operadora,
  type Despesa,
} from "../services/operadoras.service";
import { formatCnpj, formatMoney } from "../utils/formatters";

const route = useRoute();
const router = useRouter();

const cnpj = String(route.params.cnpj);

const operadora = ref<Operadora | null>(null);
const despesas = ref<Despesa[]>([]);
const loading = ref(false);
const error = ref<string | null>(null);

async function fetchAll() {
  loading.value = true;
  error.value = null;
  try {
    const [op, desp] = await Promise.all([
      buscarOperadora(cnpj),
      buscarDespesas(cnpj),
    ]);
    operadora.value = op;
    despesas.value = desp;
  } catch (e: any) {
    error.value = e?.response?.data?.detail || "Erro ao carregar detalhe";
  } finally {
    loading.value = false;
  }
}

onMounted(fetchAll);
</script>

<template>
  <div>
    <button @click="router.back()" class="btn-voltar">← Voltar</button>

    <h1>Detalhe da Operadora</h1>

    <div v-if="error" class="error">{{ error }}</div>
    <div v-if="loading">Carregando...</div>

    <div v-if="operadora && !loading" class="card">
      <div><b>CNPJ:</b> {{ formatCnpj(operadora.cnpj) }}</div>
      <div><b>Razão Social:</b> {{ operadora.razao_social }}</div>
      <div><b>UF:</b> {{ operadora.uf || "-" }}</div>
      <div><b>Modalidade:</b> {{ operadora.modalidade || "-" }}</div>
      <div>
        <b>Situação:</b>
        <span :class="operadora.situacao === 'ATIVA' ? 'ativa' : 'cancelada'">
          {{ operadora.situacao || "-" }}
        </span>
      </div>
    </div>

    <h2>Despesas (últimos 3 trimestres)</h2>

    <div v-if="despesas.length === 0" class="sem-dados">
      Sem despesas nos últimos 3 trimestres (provavelmente operadora cancelada).
    </div>

    <table v-else class="table">
      <thead>
        <tr>
          <th>Ano</th>
          <th>Trimestre</th>
          <th>Valor</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="d in despesas" :key="`${d.ano}-${d.trimestre}`">
          <td>{{ d.ano }}</td>
          <td>{{ d.trimestre }}º</td>
          <td>{{ formatMoney(d.vl_saldo_final) }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style scoped>
.btn-voltar {
  padding: 8px 16px;
  border: 1px solid #ccc;
  border-radius: 4px;
  background: #fff;
  cursor: pointer;
  margin-bottom: 12px;
}
.btn-voltar:hover {
  background: #f5f5f5;
}
.card {
  border: 1px solid #ddd;
  padding: 16px;
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.error {
  color: red;
  margin: 10px 0;
}
.sem-dados {
  color: #666;
  font-style: italic;
}
.table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 12px;
}
.table th, .table td {
  padding: 10px 12px;
  text-align: left;
  border-bottom: 1px solid #ddd;
}
.table th {
  background: #f5f5f5;
}
.ativa { color: #2e7d32; font-weight: 600; }
.cancelada { color: #c62828; font-weight: 600; }
</style>