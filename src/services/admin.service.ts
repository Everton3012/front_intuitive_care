import { http } from "../api/http";
import { clearIcCache } from "../utils/cache";

export async function atualizarPipeline() {
  const resp = await http.post(
    "/api/admin/atualizar",
    {},
    {
      headers: {
        "X-Pipeline-Token": import.meta.env.VITE_PIPELINE_TOKEN,
      },
    }
  );

  if (resp.data?.status === "success") {
    clearIcCache();
  }

  return resp.data;
}
