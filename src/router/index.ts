import { createRouter, createWebHistory } from "vue-router";
import Operadoras from "../pages/Operadoras.vue";
import OperadoraDetalhe from "../pages/OperadoraDetalhe.vue";
import Estatisticas from "../pages/Estatisticas.vue";

export default createRouter({
  history: createWebHistory(),
  routes: [
    { path: "/", redirect: "/operadoras" },
    { path: "/operadoras", component: Operadoras },
    { path: "/operadoras/:cnpj", component: OperadoraDetalhe, props: true },
    { path: "/estatisticas", component: Estatisticas },
  ],
});
