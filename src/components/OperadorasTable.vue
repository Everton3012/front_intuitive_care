<script setup lang="ts">
import type { Operadora } from "../services/operadoras.service";
import { formatCnpj } from "../utils/formatters";

defineProps<{
  rows: Operadora[];
}>();

defineEmits<{
  select: [cnpj: string];
}>();
</script>

<template>
  <table class="table">
    <thead>
      <tr>
        <th>CNPJ</th>
        <th>Razão Social</th>
        <th>UF</th>
        <th>Situação</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="op in rows" :key="op.cnpj" @click="$emit('select', op.cnpj)">
        <td>{{ formatCnpj(op.cnpj) }}</td>
        <td>{{ op.razao_social }}</td>
        <td>{{ op.uf || "-" }}</td>
        <td :class="op.situacao === 'ATIVA' ? 'ativa' : 'cancelada'">
          {{ op.situacao || "-" }}
        </td>
      </tr>
    </tbody>
  </table>
</template>

<style scoped>
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
.table tr:hover {
  background: #f9f9f9;
  cursor: pointer;
}
.ativa { color: #2e7d32; font-weight: 500; }
.cancelada { color: #c62828; font-weight: 500; }
</style>