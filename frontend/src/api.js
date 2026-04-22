const BASE_URL = "http://localhost:8000/api";

async function request(path, options = {}) {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.detail || "Request failed");
  }
  return res.json();
}

export const api = {
  listProducts: () => request("/products"),
  createProduct: (payload) => request("/products", { method: "POST", body: JSON.stringify(payload) }),
  adjustStock: (payload) => request("/stock/adjust", { method: "POST", body: JSON.stringify(payload) }),
  createSale: (payload) => request("/sales", { method: "POST", body: JSON.stringify(payload) }),
  dailyReport: () => request("/reports/daily"),
  popularProducts: (limit = 8) => request(`/reports/popular?limit=${limit}`),
};
