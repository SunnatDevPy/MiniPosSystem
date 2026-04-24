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
  updateProduct: (productId, payload) => request(`/products/${productId}`, { method: "PATCH", body: JSON.stringify(payload) }),
  deleteProduct: (productId) => request(`/products/${productId}`, { method: "DELETE" }),
  adjustStock: (payload) => request("/stock/adjust", { method: "POST", body: JSON.stringify(payload) }),
  createSale: (payload) => request("/sales", { method: "POST", body: JSON.stringify(payload) }),
  listSales: (limit = 200, fromDt, toDt) => {
    const params = new URLSearchParams({ limit: String(limit) });
    if (fromDt) params.set("from_dt", fromDt);
    if (toDt) params.set("to_dt", toDt);
    return request(`/sales?${params.toString()}`);
  },
  createReturn: (payload) => request("/returns", { method: "POST", body: JSON.stringify(payload) }),
  listReturns: (limit = 100) => request(`/returns?limit=${limit}`),
  listSuppliers: () => request("/suppliers"),
  createSupplier: (payload) => request("/suppliers", { method: "POST", body: JSON.stringify(payload) }),
  listPurchases: (limit = 50) => request(`/purchases?limit=${limit}`),
  createPurchase: (payload) => request("/purchases", { method: "POST", body: JSON.stringify(payload) }),
  openShift: (payload) => request("/shifts/open", { method: "POST", body: JSON.stringify(payload) }),
  currentShift: () => request("/shifts/current"),
  listShifts: (limit = 200, fromDt, toDt) => {
    const params = new URLSearchParams({ limit: String(limit) });
    if (fromDt) params.set("from_dt", fromDt);
    if (toDt) params.set("to_dt", toDt);
    return request(`/shifts?${params.toString()}`);
  },
  closeShift: (shiftId, payload) => request(`/shifts/${shiftId}/close`, { method: "POST", body: JSON.stringify(payload) }),
  listExpenses: (limit = 100) => request(`/expenses?limit=${limit}`),
  createExpense: (payload) => request("/expenses", { method: "POST", body: JSON.stringify(payload) }),
  auditLogs: (limit = 200) => request(`/audit/logs?limit=${limit}`),
  createBackup: () => request("/admin/backup", { method: "POST" }),
  listLabelTemplates: () => request("/settings/label-templates"),
  createLabelTemplate: (payload) => request("/settings/label-templates", { method: "POST", body: JSON.stringify(payload) }),
  updateLabelTemplate: (templateId, payload) => request(`/settings/label-templates/${templateId}`, { method: "PATCH", body: JSON.stringify(payload) }),
  deleteLabelTemplate: (templateId) => request(`/settings/label-templates/${templateId}`, { method: "DELETE" }),
  dailyReport: () => request("/reports/daily"),
  dashboardReport: () => request("/reports/dashboard"),
  salesStats: (fromDt, toDt) =>
    request(
      `/reports/sales-stats?from_dt=${encodeURIComponent(fromDt)}&to_dt=${encodeURIComponent(toDt)}`
    ),
  popularProducts: (limit = 8) => request(`/reports/popular?limit=${limit}`),
};
