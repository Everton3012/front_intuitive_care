<script setup lang="ts">
type Operadora = {
  cnpj: string;
  registro_ans: string | null;
  razao_social: string;
  modalidade: string | null;
  uf: string | null;
  situacao: string | null;
};

defineProps<{ rows: Operadora[] }>();

const emit = defineEmits<{
  (e: "select", cnpj: string): void;
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
        <td>{{ op.cnpj }}</td>
        <td>{{ op.razao_social }}</td>
        <td>{{ op.uf || "-" }}</td>
        <td>{{ op.situacao || "-" }}</td>
      </tr>
    </tbody>
  </table>
</template>

<style scoped>
.table { width: 100%; border-collapse: collapse; margin-top: 10px; }
th, td { border: 1px solid #ddd; padding: 10px; text-align: left; }
tbody tr { cursor: pointer; }
tbody tr:hover { background: #f6f6f6; }
</style>
