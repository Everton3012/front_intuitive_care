<script setup lang="ts">
import { onMounted, ref } from "vue";
import { http } from "../api/http";
import { useRoute, useRouter } from "vue-router";

const route = useRoute();
const router = useRouter();

type Operadora = {
  cnpj: string;
  registro_ans: string | null;
  razao_social: string;
  modalidade: string | null;
  uf: string | null;
  situacao: string | null;
};

type Despesa = {
  ano: number;
  trimestre: number;
  vl_saldo_final: number;
};

const cnpj = String(route.params.cnpj);

const operadora = ref<Operadora | null>(null);
const despesas = ref<Despesa[]>([]);
const loading = ref(false);
const error = ref<string | null>(null);

async function fetchAll() {
  loading.value = true;
  error.value = null;
  try {
    const [opResp, despResp] = await Promise.all([
      http.get(`/api/operadoras/${cnpj}`),
      http.get(`/api/operadoras/${cnpj}/despesas`),
    ]);
    operadora.value = opResp.data;
    despesas.value = despResp.data.despesas || [];
  } catch (e: any) {
    error.value = e?.response?.data?.detail || "Erro ao carregar detalhe";
  } finally {
    loading.value = false;
  }
}

function formatMoney(v: number) {
  return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(v);
}

onMounted(fetchAll);
</script>

<template>
  <div>
    <button @click="router.back()" style="margin-bottom: 12px;">← Voltar</button>

    <h1>Detalhe da Operadora</h1>

    <div v-if="error" style="color:red; margin: 10px 0;">{{ error }}</div>
    <div v-if="loading">Carregando...</div>

    <div v-if="operadora && !loading" style="border:1px solid #ddd; padding: 14px; border-radius: 10px;">
      <div><b>CNPJ:</b> {{ operadora.cnpj }}</div>
      <div><b>Razão Social:</b> {{ operadora.razao_social }}</div>
      <div><b>UF:</b> {{ operadora.uf || "-" }}</div>
      <div><b>Modalidade:</b> {{ operadora.modalidade || "-" }}</div>
      <div><b>Situação:</b> {{ operadora.situacao || "-" }}</div>
    </div>

    <h2>Despesas (últimos 3 trimestres)</h2>

<div v-if="despesas.length === 0" style="margin-top: 8px; color: #666;">
  Sem despesas nos últimos 3 trimestres (provavelmente operadora cancelada).
</div>

<table v-else border="1" cellspacing="0" cellpadding="8" width="100%">
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
      <td>{{ d.trimestre }}</td>
      <td>{{ formatMoney(d.vl_saldo_final) }}</td>
    </tr>
  </tbody>
</table>
  </div>
</template>
