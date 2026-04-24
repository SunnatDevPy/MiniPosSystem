export function demoSales() {
  const now = Date.now();
  return [
    {
      id: 5001,
      cashier_name: "Islomov Mirzaolim",
      payment_type: "cash",
      total_amount: 147000,
      created_at: new Date(now - 3 * 60 * 60 * 1000).toISOString(),
      items: [
        { product_id: 1, qty: 1, price: 24500, line_total: 24500 },
        { product_id: 2, qty: 4, price: 30625, line_total: 122500 },
      ],
    },
    {
      id: 5002,
      cashier_name: "Kassir 2",
      payment_type: "card",
      total_amount: 98000,
      created_at: new Date(now - 2 * 60 * 60 * 1000).toISOString(),
      items: [{ product_id: 3, qty: 2, price: 49000, line_total: 98000 }],
    },
    {
      id: 5003,
      cashier_name: "Kassir 1",
      payment_type: "mixed",
      total_amount: 234000,
      created_at: new Date(now - 70 * 60 * 1000).toISOString(),
      items: [{ product_id: 4, qty: 6, price: 39000, line_total: 234000 }],
    },
  ];
}

export function demoShifts() {
  const now = Date.now();
  return [
    {
      id: 1147,
      cashier_name: "Islomov Mirzaolim",
      opening_cash: 250000,
      closing_cash: null,
      status: "open",
      opened_at: new Date(now - 4 * 60 * 60 * 1000).toISOString(),
      closed_at: null,
      note: "",
    },
    {
      id: 1146,
      cashier_name: "Kassir",
      opening_cash: 180000,
      closing_cash: 420000,
      status: "closed",
      opened_at: new Date(now - 28 * 60 * 60 * 1000).toISOString(),
      closed_at: new Date(now - 20 * 60 * 60 * 1000).toISOString(),
      note: "",
    },
  ];
}

export function demoDailyReport() {
  return {
    date: new Date().toISOString().slice(0, 10),
    sales_count: 69,
    revenue: 7760875,
    expenses: 420000,
    returns_amount: 0,
    net_revenue: 7340875,
    low_stock: [],
  };
}

export function demoProducts() {
  return [
    { id: 101, name: "Kartoshka", artikul: "1001", barcode: "2100101000010", category: "Sabzavot", unit: "kg", buy_price: 4200, sell_price: 6000, stock_qty: 128.5, min_stock: 30 },
    { id: 102, name: "Piyoz", artikul: "1002", barcode: "2100102000017", category: "Sabzavot", unit: "kg", buy_price: 3500, sell_price: 5200, stock_qty: 96.2, min_stock: 25 },
    { id: 103, name: "Olma", artikul: "1003", barcode: "2100103000014", category: "Meva", unit: "kg", buy_price: 7800, sell_price: 11000, stock_qty: 64.4, min_stock: 20 },
    { id: 104, name: "Shakar 1kg", artikul: "1004", barcode: "4780010400018", category: "Bakaleya", unit: "pcs", buy_price: 9500, sell_price: 12500, stock_qty: 40, min_stock: 10 },
    { id: 105, name: "Suv 1L", artikul: "1005", barcode: "4780010500015", category: "Ichimlik", unit: "pcs", buy_price: 1800, sell_price: 3000, stock_qty: 120, min_stock: 30 },
    { id: 106, name: "Non", artikul: "1006", barcode: "", category: "Non mahsulot", unit: "pcs", buy_price: 2200, sell_price: 3500, stock_qty: 55, min_stock: 15 },
    { id: 107, name: "Qarz mahsulot", artikul: "1007", barcode: "4780010700019", category: "Sinov", unit: "pcs", buy_price: 5000, sell_price: 7500, stock_qty: -3, min_stock: 2 },
  ];
}

export function demoDashboard() {
  return {
    today: { sales_count: 69, revenue: 7760875, avg_check: 112476.44, expenses: 420000 },
    inventory: { products_count: 128, low_stock_count: 9, out_of_stock_count: 3 },
    shift: { is_open: true, id: 1147, cashier_name: "Islomov Mirzaolim", opened_at: new Date().toISOString() },
    recent_sales: demoSales().map((x) => ({ ...x, created_at: x.created_at })),
    recent_movements: [
      { id: 1, product_name: "Apple", qty_delta: -2, reason: "sale", created_at: new Date().toISOString() },
      { id: 2, product_name: "Banana", qty_delta: 8, reason: "purchase", created_at: new Date().toISOString() },
    ],
  };
}

export function demoSalesStats() {
  return {
    range: { from: new Date(Date.now() - 24 * 3600 * 1000).toISOString(), to: new Date().toISOString() },
    summary: { sales_count: 69, revenue: 7760875, avg_check: 112476.44 },
    payment_breakdown: [
      { payment_type: "cash", amount: 4288375 },
      { payment_type: "card", amount: 2220000 },
      { payment_type: "mixed", amount: 1252500 },
    ],
    hourly: [
      { hour: "07", amount: 500000 },
      { hour: "08", amount: 1350000 },
      { hour: "09", amount: 2400000 },
      { hour: "10", amount: 600000 },
      { hour: "11", amount: 3210875 },
    ],
    weekday: [
      { weekday: "1", amount: 450000 },
      { weekday: "2", amount: 1000000 },
      { weekday: "3", amount: 850000 },
      { weekday: "4", amount: 2400000 },
      { weekday: "5", amount: 1800000 },
      { weekday: "6", amount: 750000 },
      { weekday: "0", amount: 510875 },
    ],
  };
}
