import { http } from "../api/http";
import { getCache, setCache, CACHE_TTL_30_DAYS } from "../utils/cache";

export type Estatisticas = {
  total_despesas: number;
  media_despesas: number;
  top_5_operadoras: Array<{
    cnpj: string;
    razao_social: string;
    total_despesas: string | number;
  }>;
  despesas_por_uf_top5: Array<{
    uf: string;
    total_despesas: string | number;
  }>;
};

const KEY = "ic:estatisticas";

export async function buscarEstatisticas(): Promise<Estatisticas> {
  const cached = getCache<Estatisticas>(KEY, CACHE_TTL_30_DAYS);
  if (cached) return cached;

  const resp = await http.get<Estatisticas>("/api/estatisticas");
  setCache(KEY, resp.data);
  return resp.data;
}
