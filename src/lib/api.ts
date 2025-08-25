/* eslint-disable @typescript-eslint/no-explicit-any */
// src/lib/api.ts
import type { MarcaOut, MarcaCreate } from "@/types";

const BASE = process.env.NEXT_PUBLIC_API_BASE ?? "http://127.0.0.1:8000/api/v1";

async function handle<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const txt = await res.text().catch(() => "");
    throw new Error(txt || `HTTP ${res.status}`);
  }
  if (res.status === 204) return undefined as T;
  const ct = res.headers.get("content-type") ?? "";
  return ct.includes("application/json") ? ((await res.json()) as T) : (undefined as T);
}

export const api = {
  async listMarcas(
    search?: string,
    opts?: { identificacion?: string; clase?: string; sort?: string }
  ): Promise<MarcaOut[]> {
    const url = new URL(`${BASE}/marcas/`);
    if (search) url.searchParams.set("search", search);
    // Quita estos si el backend no los usa:
    if (opts?.identificacion) url.searchParams.set("identificacion", opts.identificacion); // titular CC/NIT
    if (opts?.clase) url.searchParams.set("clase", opts.clase);
    if (opts?.sort) url.searchParams.set("sort", opts.sort);

    const res = await fetch(url.toString(), { cache: "no-store" /*, credentials:"include"*/ });
    return handle<MarcaOut[]>(res);
  },

  async getMarca(id: number): Promise<MarcaOut> {
    const res = await fetch(`${BASE}/marcas/${id}`, { cache: "no-store" /*, credentials:"include"*/ });
    return handle<MarcaOut>(res);
  },

  async updateMarca(id: number, body: any): Promise<MarcaOut> {
    // PUT anidado
    const res = await fetch(`${BASE}/marcas/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      // credentials: "include",
      body: JSON.stringify(body),
    });
    return handle<MarcaOut>(res);
  },

  async createMarca(payload: MarcaCreate): Promise<MarcaOut> {
    const res = await fetch(`${BASE}/marcas/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      // credentials: "include",
      body: JSON.stringify(payload),
    });
    return handle<MarcaOut>(res);
  },

  async deleteMarca(id: number): Promise<void> {
    const res = await fetch(`${BASE}/marcas/${id}`, {
      method: "DELETE",
      // credentials: "include",
    });
    await handle<void>(res);
  },
};
