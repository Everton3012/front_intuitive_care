import { http } from "../api/http";
import { getCache, setCache, CACHE_TTL_30_DAYS } from "../utils/cache";

export type Operadora = {
  cnpj: string;
  registro_ans: string | null;
  razao_social: string;
  modalidade: string | null;
  uf: string | null;
  situacao: string | null;
};

export type OperadorasResponse = {
  data: Operadora[];
  total: number;
  page: number;
  limit: number;
};

export type Despesa = {
  ano: number;
  trimestre: number;
  vl_saldo_final: number;
};

export type DespesasResponse = {
  cnpj: string;
  despesas: Despesa[];
};

function makeKey(page: number, limit: number, q?: string, situacao?: string) {
  const query = (q || "").trim().toLowerCase();
  const sit = (situacao || "").toLowerCase();
  return `ic:operadoras:p=${page}:l=${limit}:q=${encodeURIComponent(query)}:s=${sit}`;
}

export async function listarOperadoras(
  page: number,
  limit: number,
  q?: string,
  situacao?: string
): Promise<OperadorasResponse> {
  const key = makeKey(page, limit, q, situacao);
  
  // Debug: log da chamada
  console.log("[Service] listarOperadoras chamada:", { page, limit, q, situacao, key });
  
  const cached = getCache<OperadorasResponse>(key, CACHE_TTL_30_DAYS);

  if (cached) {
    console.log("[Service] Retornando do cache:", key);
    return cached;
  }

  console.log("[Service] Fazendo requisição HTTP...");
  const resp = await http.get<OperadorasResponse>("/api/operadoras", {
    params: { 
      page, 
      limit, 
      q: q || undefined,
      situacao: situacao || undefined 
    },
  });

  console.log("[Service] Resposta HTTP:", resp.data);
  setCache(key, resp.data);
  return resp.data;
}

export async function buscarOperadora(cnpj: string): Promise<Operadora> {
  const cnpjDigits = cnpj.replace(/\D/g, "");
  const key = `ic:operadora:${cnpjDigits}`;
  const cached = getCache<Operadora>(key, CACHE_TTL_30_DAYS);

  if (cached) return cached;

  const resp = await http.get<Operadora>(`/api/operadoras/${cnpjDigits}`);
  setCache(key, resp.data);
  return resp.data;
}

export async function buscarDespesas(cnpj: string): Promise<Despesa[]> {
  const cnpjDigits = cnpj.replace(/\D/g, "");
  const key = `ic:operadora_despesas:${cnpjDigits}`;
  const cached = getCache<DespesasResponse>(key, CACHE_TTL_30_DAYS);

  if (cached) return cached.despesas || [];

  const resp = await http.get<DespesasResponse>(`/api/operadoras/${cnpjDigits}/despesas`);
  setCache(key, resp.data);
  return resp.data.despesas || [];
}