/* eslint-disable @typescript-eslint/no-explicit-any */
export function cleanObject<T extends Record<string, any>>(obj: T): T {
  const out: Record<string, any> = Array.isArray(obj) ? [] : {};
  Object.entries(obj ?? {}).forEach(([k, v]) => {
    if (v && typeof v === "object" && !Array.isArray(v)) {
      const nested = cleanObject(v);
      if (Object.keys(nested).length > 0) out[k] = nested;
    } else if (Array.isArray(v)) {
      const arr = v.map((x) => (typeof x === "object" ? cleanObject(x) : x)).filter((x) => x !== undefined && x !== "");
      if (arr.length) out[k] = arr;
    } else if (v !== undefined && v !== "") {
      out[k] = v;
    }
  });
  return out as T;
}
