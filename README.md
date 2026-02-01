# Frontend – Teste Técnico IntuitiveCare 2026

Interface web desenvolvida para consumo da API do **Teste Técnico IntuitiveCare 2026**, permitindo
consulta, busca e visualização das operadoras de saúde e estatísticas de despesas.

O frontend foi projetado com foco em **simplicidade, clareza e experiência do usuário**, seguindo
o escopo do Teste 4 do desafio técnico.

---

## Tecnologias Utilizadas

- Vue.js 3
- Vite
- JavaScript (ESNext)
- CSS (estilização simples e responsiva)
- Fetch API

---

## Funcionalidades Implementadas

### 📋 Listagem de Operadoras
- Tabela paginada de operadoras
- Exibição de:
  - CNPJ
  - Razão Social
  - UF
  - Situação (ATIVA / CANCELADA)
- Paginação integrada com a API

### 🔍 Busca
- Busca por **CNPJ** ou **Razão Social**
- Filtro aplicado diretamente na API

### 📊 Estatísticas
- Exibição das estatísticas agregadas retornadas pela API:
  - Total de despesas
  - Média geral
  - Top 5 operadoras por despesa
  - Top 5 UFs por despesa
  - Cache local no frontend com TTL de 30 dias, evitando chamadas repetidas à API

### 📄 Detalhes da Operadora
- Página de detalhes por CNPJ
- Exibição dos dados cadastrais da operadora
- Histórico de despesas dos últimos 3 trimestres (quando disponível)

#### Tratamento de operadoras canceladas
- Operadoras **CANCELADAS** normalmente não possuem despesas nos últimos 3 trimestres
- Nesses casos, a interface exibe uma mensagem informativa ao usuário, evitando telas vazias ou erros

---

## Estrutura do Projeto

```
frontend_intuitive_care/
│
├── src/
│ ├── api/
│ │ └── http.js
│ │
│ ├── components/
│ │ ├── OperadorasTable.vue
│ │ ├── Pagination.vue
│ │ └── SearchBar.vue
│ │
│ ├── pages/
│ │ ├── Estatisticas.vue
│ │ ├── OperadoraDetalhe.vue
│ │ └── Operadoras.vue 
│ │
│ ├── router/
│ │ └── index.ts 
│ │
│ ├── utils/
│ │ └── cache.ts 
│ │
│ ├── App.vue
│ └── main.js
│
├── index.html
├── package.json
└── README.md
```


---

## Como Executar

### Pré-requisitos
- Node.js 18+

### 1) Instalar dependências

```bash
npm install
```

### 2) Configurar URL da API

No arquivo src/api/intuitivecare.js:

- const API_BASE_URL = 'http://127.0.0.1:8000'

A API deve estar rodando localmente conforme instruções do backend.

### 3) Subir o frontend
npm run dev


A aplicação ficará disponível em:

- http://localhost:5173

## Integração com a API

### Endpoints consumidos:

- GET /api/operadoras

- GET /api/operadoras/{cnpj}

- GET /api/operadoras/{cnpj}/despesas

- GET /api/estatisticas

- GET /health

- A paginação e filtros são feitos diretamente via parâmetros da API, mantendo o frontend simples e desacoplado da lógica de dados.

## Decisões Técnicas

- Vue 3 + Vite: simplicidade, rapidez e baixo overhead

- TypeScript: maior segurança e legibilidade

- Paginação via API: evita carregar grandes volumes no frontend

- Cache controlado no frontend: dados estáveis com menos requisições

- Tratamento explícito de dados ausentes: melhora UX para operadoras canceladas

- Componentização leve: apenas onde agrega clareza (tabela, paginação)

## Limitações e Melhorias Futuras

- Adicionar gráficos (ex.: Chart.js ou ECharts)

- Melhorar layout visual (design system)

- Implementar testes de componentes

- Criar build Docker do frontend