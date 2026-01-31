<template>
  <div class="app">
    <header class="topbar">
      <div class="brand">IntuitiveCare</div>

      <nav class="nav">
        <RouterLink to="/operadoras" class="link" active-class="active">Operadoras</RouterLink>
        <RouterLink to="/estatisticas" class="link" active-class="active">Estatísticas</RouterLink>
      </nav>
    </header>

    <main class="content">
      <RouterView />
    </main>
  </div>
</template>

<script setup lang="ts"></script>

<style>
.app { font-family: Arial, sans-serif; }
.topbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 18px;
  border-bottom: 1px solid #ddd;
}
.brand { font-weight: 700; }
.nav { display: flex; gap: 12px; }
.link { text-decoration: none; color: #333; padding: 6px 10px; border-radius: 6px; }
.active { background: #eee; }
.content { max-width: 1100px; margin: 0 auto; padding: 24px; }
</style>
