export const API_BASE = "https://vidiveda.in";

export function apiUrl(path) {
  const base = API_BASE.replace(/\/$/, "");
  const suffix = path.startsWith("/") ? path : `/${path}`;
  return `${base}${suffix}`;
}
