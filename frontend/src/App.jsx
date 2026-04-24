import { useEffect, useMemo, useRef, useState } from "react";
import { api } from "./api";
import "./App.css";

const I18N = {
  ru: {
    title: "OkaPos",
    subtitle: "Умная POS-система для магазина",
    login: "Вход",
    chooseRole: "Выберите профессию",
    role: "Роль",
    password: "Пароль",
    accessPassword: "Код доступа",
    signIn: "Войти",
    admin: "Админ",
    cashier: "Кассир",
    logout: "Выход",
    theme: "Тема",
    dark: "Темная",
    light: "Светлая",
    loading: "Загрузка...",
    modeCashier: "Касса",
    modeAdmin: "Админка",
    search: "Поиск по названию, артикулу, штрихкоду",
    quickProducts: "Популярные товары",
    returnMode: "Режим возврата",
    discount: "Скидка %",
    markup: "Наценка %",
    add: "Добавить",
    checkout: "Пробить чек",
    print: "Печать",
    shift: "Смена",
    cart: "Корзина",
    empty: "Пусто",
    total: "Итого",
    product: "Товар",
    qty: "Кол-во",
    price: "Цена",
    line: "Сумма",
    action: "Действие",
    remove: "Удалить",
    report: "Отчет за день",
    createProduct: "Создать товар",
    adjustStock: "Корректировка остатков",
    products: "Товары",
    save: "Сохранить",
    apply: "Применить",
    selectProduct: "Выберите товар",
    adminWorkspace: "Панель управления",
    menuReports: "Учеты",
    menuWarehouse: "Склад",
    menuProducts: "Товары",
    menuFinance: "Поставщики и долги",
    menuStaff: "Смена и расходы",
    menuReturns: "Возвраты",
    menuAudit: "Аудит и бэкап",
    menuSettings: "Настройки",
    collapseMenu: "Свернуть",
    expandMenu: "Развернуть",
    closeMenu: "Закрыть",
    openMenu: "Открыть меню",
    supplier: "Поставщик",
    amount: "Сумма",
    note: "Комментарий",
    addRecord: "Добавить запись",
    noRecords: "Пока нет записей",
    employees: "Список работников",
    todaySales: "Продажи сегодня",
    todayRevenue: "Выручка сегодня",
    avgCheck: "Средний чек",
    totalProducts: "Всего товаров",
    lowStockItems: "Мало на складе",
    noStockItems: "Нет в наличии",
    recentSales: "Последние продажи",
    stockMoves: "Движения склада",
    reason: "Причина",
    adjustment: "Корректировка",
    incoming: "Поступление",
    writeoff: "Списание",
    saleOp: "Продажа",
    purchases: "Закупки",
    createSupplier: "Добавить поставщика",
    createPurchase: "Создать закупку",
    openShift: "Открыть смену",
    closeShift: "Закрыть смену",
    openingCash: "Начальная касса",
    closingCash: "Закрывающая касса",
    expense: "Расход",
    category: "Категория",
    createExpense: "Добавить расход",
    returns: "Возвраты",
    createReturn: "Оформить возврат",
    saleId: "ID продажи",
    auditLogs: "Журнал действий",
    backupDb: "Бэкап БД",
    makeBackup: "Создать бэкап",
    exportExcel: "Экспорт Excel",
    exportPdf: "Экспорт PDF",
    createdBy: "Кем создано",
    reportsMenu: "Меню учетов",
    productsMenu: "Меню товаров",
    warehouseMenu: "Склад",
    staffMenu: "Рабочие",
    salesReport: "Отчет продаж",
    checks: "Чеки",
    shiftReport: "Смена",
    inventoryEval: "Инвентаризация",
    salesHistory: "История продаж",
    categories: "Категории",
    topSales: "Топ продаж",
    weightProducts: "Весовые товары",
    labelPrint: "Печать ценников",
    serialProducts: "Серийные товары",
    priceHistory: "История цен",
    supplierPayment: "Платеж поставщику",
    supplierReport: "Отчет поставщиков",
    from: "От",
    to: "До",
    byPayment: "Продажи по оплатам",
    byHour: "Продажи по часам",
    byWeekday: "Продажи по дням недели",
    applyFilter: "Применить фильтр",
    totalSalesAmount: "Общая сумма продаж",
    totalSalesCost: "Себестоимость продаж",
    totalPayments: "Общие оплаты",
    income: "Доход",
    totalSalesChecks: "Количество чеков продаж",
    totalReturnsAmount: "Сумма возвратов",
    totalReturnsCost: "Себестоимость возвратов",
    returnedItems: "Возвращено товаров",
    expenseOut: "Расход",
    totalReturnChecks: "Количество чеков возврата",
    working: "Работает",
    closed: "Закрыто",
    shiftInfo: "Информация о смене",
    openedAt: "Открыта",
    closedAt: "Закрыта",
    openedBy: "Открыл",
    closedBy: "Закрыл",
    posDevice: "POS устройство",
    shiftSales: "Продажи в смене",
    shiftTransactions: "Транзакции в смене",
    inventoryTotalSell: "Общая продажная сумма",
    inventoryTotalCost: "Общая себестоимость",
    inventoryProfit: "Потенциальная прибыль",
    inventoryWeightType: "Весовой товар",
    inventoryCurrentQty: "Сейчас в наличии",
    inventoryCurrentAmount: "Сумма сейчас",
    inventoryIfSold: "Сумма при продаже",
    chooseImage: "Выбрать изображение",
    noFileChosen: "Файл не выбран",
  },
  uz: {
    title: "OkaPos",
    subtitle: "Do'kon uchun aqlli POS tizimi",
    login: "Kirish",
    chooseRole: "Kasbni tanlang",
    role: "Rol",
    password: "Parol",
    accessPassword: "Kirish kodi",
    signIn: "Kirish",
    admin: "Admin",
    cashier: "Kassir",
    logout: "Chiqish",
    theme: "Mavzu",
    dark: "Qorong'i",
    light: "Yorug'",
    loading: "Yuklanmoqda...",
    modeCashier: "Kassa",
    modeAdmin: "Admin panel",
    search: "Nomi, artikul yoki shtrixkod bo'yicha qidirish",
    quickProducts: "Ommabop mahsulotlar",
    returnMode: "Qaytarish rejimi",
    discount: "Chegirma %",
    markup: "Ustama %",
    add: "Qo'shish",
    checkout: "Chek yopish",
    print: "Chop etish",
    shift: "Smena",
    cart: "Savat",
    empty: "Bo'sh",
    total: "Jami",
    product: "Mahsulot",
    qty: "Miqdor",
    price: "Narx",
    line: "Summa",
    action: "Amal",
    remove: "O'chirish",
    report: "Kunlik hisobot",
    createProduct: "Yangi mahsulot",
    adjustStock: "Qoldiqni tuzatish",
    products: "Mahsulotlar",
    save: "Saqlash",
    apply: "Qo'llash",
    selectProduct: "Mahsulotni tanlang",
    adminWorkspace: "Boshqaruv paneli",
    menuReports: "Hisobotlar",
    menuWarehouse: "Ombor",
    menuProducts: "Tovarlar",
    menuFinance: "Moliya - Yetkazib beruvchi va qarzlar",
    menuStaff: "Smena va xarajatlar",
    menuReturns: "Qaytarishlar",
    menuAudit: "Audit va backup",
    menuSettings: "Sozlamar",
    collapseMenu: "Yig'ish",
    expandMenu: "Yoyish",
    closeMenu: "Yopish",
    openMenu: "Menyuni ochish",
    supplier: "Yetkazib beruvchi",
    amount: "Summa",
    note: "Izoh",
    addRecord: "Yozuv qo'shish",
    noRecords: "Hozircha yozuvlar yo'q",
    employees: "Xodimlar ro'yxati",
    todaySales: "Bugungi savdolar",
    todayRevenue: "Bugungi tushum",
    avgCheck: "O'rtacha chek",
    totalProducts: "Jami mahsulot",
    lowStockItems: "Kam qolganlar",
    noStockItems: "Qolmaganlar",
    recentSales: "So'nggi savdolar",
    stockMoves: "Ombor harakatlari",
    reason: "Sabab",
    adjustment: "Tuzatish",
    incoming: "Kirim",
    writeoff: "Chiqim",
    saleOp: "Savdo",
    purchases: "Xaridlar",
    createSupplier: "Yetkazib beruvchi qo'shish",
    createPurchase: "Xarid yaratish",
    openShift: "Smenani ochish",
    closeShift: "Smenani yopish",
    openingCash: "Boshlang'ich kassa",
    closingCash: "Yakuniy kassa",
    expense: "Xarajat",
    category: "Kategoriya",
    createExpense: "Xarajat qo'shish",
    returns: "Qaytarishlar",
    createReturn: "Qaytarishni rasmiylash",
    saleId: "Savdo ID",
    auditLogs: "Harakatlar jurnali",
    backupDb: "DB backup",
    makeBackup: "Backup yaratish",
    exportExcel: "Excel eksport",
    exportPdf: "PDF eksport",
    createdBy: "Kim yaratgan",
    reportsMenu: "Hisobotlar menyusi",
    productsMenu: "Tovarlar menyusi",
    warehouseMenu: "Ombor",
    staffMenu: "Xodimlar",
    salesReport: "Sotuvlar hisoboti",
    checks: "Cheklar",
    shiftReport: "Smena",
    inventoryEval: "Inventarizatsiya",
    salesHistory: "Sotuvlar tarixi",
    categories: "Kategoriyalar",
    topSales: "Tez sotiladigan narsalar",
    weightProducts: "Kiloli tovarlar",
    labelPrint: "Narx teglari chop etish",
    serialProducts: "Seriyali tovarlar",
    priceHistory: "Narxlar tarixi",
    supplierPayment: "Yetkazib beruvchiga to'lov",
    supplierReport: "Ta'minotchi mablag'lar hisoboti",
    from: "Dan",
    to: "Gacha",
    byPayment: "To'lov turlari bo'yicha sotuvlar",
    byHour: "Soatlar bo'yicha sotuvlar",
    byWeekday: "Hafta kunlari bo'yicha sotuvlar",
    applyFilter: "Filtrni qo'llash",
    totalSalesAmount: "Jami savdo",
    totalSalesCost: "Jami savdo tannarxi",
    totalPayments: "Jami to'lovlar",
    income: "Tushum",
    totalSalesChecks: "Jami savdo cheklari",
    totalReturnsAmount: "Jami qaytarishlar",
    totalReturnsCost: "Jami qaytarishlar tannarxi",
    returnedItems: "Jami qaytarilganlar",
    expenseOut: "Chiqim",
    totalReturnChecks: "Jami qaytarilgan cheklar",
    working: "Aktiv",
    closed: "Yopilgan",
    shiftInfo: "Smena haqida ma'lumot",
    openedAt: "Ochilgan vaqti",
    closedAt: "Yopilgan vaqti",
    openedBy: "Ochgan xodim",
    closedBy: "Yopgan xodim",
    posDevice: "POS qurilma",
    shiftSales: "Smenadagi sotuvlar",
    shiftTransactions: "Smenadagi tranzaksiyalar",
    inventoryTotalSell: "Umumiy sotuv qiymati",
    inventoryTotalCost: "Umumiy tannarx",
    inventoryProfit: "Foyda",
    inventoryWeightType: "Vaznli mahsulot",
    inventoryCurrentQty: "Hozir qoldiq",
    inventoryCurrentAmount: "Hozirgi summa",
    inventoryIfSold: "Sotilgandagi summa",
    chooseImage: "Rasm tanlash",
    noFileChosen: "Fayl tanlanmagan",
  },
};

function BrandLogo({ compact = false }) {
  return (
    <div className={`brand-logo ${compact ? "compact" : ""}`}>
      <span className="brand-logo-mark">O</span>
      <div>
        <strong>OkaPos</strong>
        {!compact && <p>Smart Retail POS</p>}
      </div>
    </div>
  );
}

function LoadingScreen({ text }) {
  return (
    <div className="loading-screen" role="status" aria-live="polite">
      <div className="loading-card">
        <BrandLogo />
        <p>{text}</p>
        <div className="loading-track">
          <span className="loading-bar" />
        </div>
      </div>
    </div>
  );
}

function printReceipt({ shiftNumber, cashier, paymentType, cart, total }) {
  const lines = cart
    .map(
      (x) =>
        `<tr><td>${x.name}</td><td>${x.qty}</td><td>${x.unitPrice.toFixed(2)}</td><td>${x.lineTotal.toFixed(2)}</td></tr>`
    )
    .join("");
  const popup = window.open("", "_blank", "width=360,height=640");
  if (!popup) return;
  popup.document.write(`
    <html>
      <head><title>Receipt</title></head>
      <body style="font-family:Arial;padding:10px;">
        <h3>Mini POS</h3>
        <p>Shift: ${shiftNumber}</p>
        <p>Cashier: ${cashier}</p>
        <p>Payment: ${paymentType}</p>
        <table border="1" cellspacing="0" cellpadding="4" width="100%">
          <thead><tr><th>Item</th><th>Qty</th><th>Price</th><th>Total</th></tr></thead>
          <tbody>${lines}</tbody>
        </table>
        <h3>Total: ${total.toFixed(2)}</h3>
      </body>
    </html>
  `);
  popup.document.close();
  popup.focus();
  popup.print();
}

function SalesLineChart({ points }) {
  const width = 980;
  const height = 260;
  const padding = 42;
  const maxVal = Math.max(1, ...points.map((p) => p.amount || 0));
  const stepX = (width - padding * 2) / Math.max(1, points.length - 1);
  const toY = (val) => height - padding - (val / maxVal) * (height - padding * 2);
  const yTicks = 5;
  const lineA = points
    .map((p, i) => `${padding + i * stepX},${toY(p.amount || 0)}`)
    .join(" ");
  const lineB = points
    .map((p, i) => `${padding + i * stepX},${toY((p.amount || 0) * 0.18)}`)
    .join(" ");
  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="sales-line-svg" role="img" aria-label="Sales chart">
      {[...Array(yTicks)].map((_, x) => {
        const y = padding + ((height - padding * 2) / (yTicks - 1)) * x;
        const val = Math.round(maxVal - (maxVal / (yTicks - 1)) * x);
        return (
          <g key={x}>
            <line x1={padding} y1={y} x2={width - padding} y2={y} className="chart-grid-line" />
            <text x={8} y={y + 4} className="chart-axis-text">{val.toLocaleString("ru-RU")}</text>
          </g>
        );
      })}
      <polyline points={lineB} className="chart-line chart-line-secondary" />
      <polyline points={lineA} className="chart-line chart-line-primary" />
      {points.map((p, i) => (
        <g key={`${p.hour}-${i}`}>
          <circle cx={padding + i * stepX} cy={toY(p.amount || 0)} r="2.6" className="chart-dot-primary" />
          {i % 2 === 0 && <text x={padding + i * stepX - 10} y={height - 8} className="chart-axis-text">{p.hour}</text>}
        </g>
      ))}
    </svg>
  );
}

function demoSales() {
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

function demoShifts() {
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

function demoDailyReport() {
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

function demoProducts() {
  return [
    { id: 101, name: "Kartoshka", artikul: "1001", barcode: "2100101000010", category: "Sabzavot", unit: "kg", buy_price: 4200, sell_price: 6000, stock_qty: 128.5, min_stock: 30 },
    { id: 102, name: "Piyoz", artikul: "1002", barcode: "2100102000017", category: "Sabzavot", unit: "kg", buy_price: 3500, sell_price: 5200, stock_qty: 96.2, min_stock: 25 },
    { id: 103, name: "Olma", artikul: "1003", barcode: "2100103000014", category: "Meva", unit: "kg", buy_price: 7800, sell_price: 11000, stock_qty: 64.4, min_stock: 20 },
    { id: 104, name: "Shakar 1kg", artikul: "1004", barcode: "4780010400018", category: "Bakaleya", unit: "pcs", buy_price: 9500, sell_price: 12500, stock_qty: 40, min_stock: 10 },
    { id: 105, name: "Suv 1L", artikul: "1005", barcode: "4780010500015", category: "Ichimlik", unit: "pcs", buy_price: 1800, sell_price: 3000, stock_qty: 120, min_stock: 30 },
    { id: 106, name: "Non", artikul: "1006", barcode: "", category: "Non mahsulot", unit: "pcs", buy_price: 2200, sell_price: 3500, stock_qty: 55, min_stock: 15 },
  ];
}

function demoDashboard() {
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

function demoSalesStats() {
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

export default function App() {
  const nowLocal = new Date();
  const toLocalInput = (d) => {
    const x = new Date(d.getTime() - d.getTimezoneOffset() * 60000);
    return x.toISOString().slice(0, 16);
  };
  const [lang, setLang] = useState(() => localStorage.getItem("lang") || "ru");
  const [theme, setTheme] = useState(() => localStorage.getItem("theme") || "dark");
  const [session, setSession] = useState(() => {
    const raw = localStorage.getItem("session");
    if (!raw) return null;
    try {
      return JSON.parse(raw);
    } catch {
      return null;
    }
  });
  const [login, setLogin] = useState({ role: "cashier" });
  const [mode, setMode] = useState(() => localStorage.getItem("mode") || "cashier");
  const [products, setProducts] = useState([]);
  const [popular, setPopular] = useState([]);
  const [report, setReport] = useState(null);
  const [dashboard, setDashboard] = useState(null);
  const [salesList, setSalesList] = useState([]);
  const [expandedCheckId, setExpandedCheckId] = useState(null);
  const [salesStats, setSalesStats] = useState(null);
  const [salesFilter, setSalesFilter] = useState(() => {
    const to = toLocalInput(nowLocal);
    const fromDate = new Date(nowLocal.getTime() - 24 * 60 * 60 * 1000);
    return { from: toLocalInput(fromDate), to };
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [checksFilter, setChecksFilter] = useState(() => {
    const to = toLocalInput(nowLocal);
    const fromDate = new Date(nowLocal.getTime() - 30 * 24 * 60 * 60 * 1000);
    return { from: toLocalInput(fromDate), to };
  });
  const [historyFilter, setHistoryFilter] = useState(() => {
    const now = new Date();
    const fromDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    return {
      from: fromDate.toISOString().slice(0, 10),
      to: now.toISOString().slice(0, 10),
      search: "",
      category: "all",
    };
  });
  const [historySales, setHistorySales] = useState([]);
  const [returnMode, setReturnMode] = useState(false);
  const [saleForm, setSaleForm] = useState({ cashier_name: "Cashier 1", payment_type: "cash", product_id: "", qty: 1, discount: 0, markup: 0 });
  const [cart, setCart] = useState([]);
  const [shiftNumber, setShiftNumber] = useState(() => Number(localStorage.getItem("shiftNumber") || "1"));
  const [productForm, setProductForm] = useState({
    name: "",
    unit: "kg",
    barcode: "",
    category: "General",
    imageName: "",
    tariff: "",
    buy_price: 0,
    sell_price: 0,
    stock_qty: 0,
    min_stock: 0,
  });
  const [showProductModal, setShowProductModal] = useState(false);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [editingProductId, setEditingProductId] = useState(null);
  const [inlineEdit, setInlineEdit] = useState(null);
  const [categoryQuickEdit, setCategoryQuickEdit] = useState(null);
  const productQuickPopoverRef = useRef(null);
  const categoryQuickPopoverRef = useRef(null);
  const [warningModal, setWarningModal] = useState({
    open: false,
    title: "",
    message: "",
    confirmMode: false,
    onConfirm: null,
  });
  const [customCategories, setCustomCategories] = useState([]);
  const [categoryForm, setCategoryForm] = useState({ name: "", imageName: "", tariff: "" });
  const [categoryEditingName, setCategoryEditingName] = useState("");
  const [quickSaleTiles, setQuickSaleTiles] = useState(() => {
    try {
      const raw = localStorage.getItem("quickSaleTiles");
      const parsed = raw ? JSON.parse(raw) : [];
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  });
  const [activeQuickCategory, setActiveQuickCategory] = useState("all");
  const [showQuickTileModal, setShowQuickTileModal] = useState(false);
  const [quickTileTab, setQuickTileTab] = useState("product");
  const [quickTileSearch, setQuickTileSearch] = useState("");
  const [quickTileValue, setQuickTileValue] = useState("");
  const [quickTileDragId, setQuickTileDragId] = useState(null);
  const [syncNote, setSyncNote] = useState("");
  const [weightSearch, setWeightSearch] = useState("");
  const [scaleName, setScaleName] = useState("IFTIQOR 80");
  const [settingsView, setSettingsView] = useState(() => localStorage.getItem("settingsView") || "general");
  const [labelTemplates, setLabelTemplates] = useState(() => {
    try {
      const raw = localStorage.getItem("labelTemplates");
      const parsed = raw ? JSON.parse(raw) : null;
      if (Array.isArray(parsed) && parsed.length) return parsed;
    } catch {
      // ignore
    }
    return [
      {
        id: 0,
        name: "Cennik 58*40",
        width: 58,
        height: 40,
        formatPrice: false,
        priceSuffix: "",
        show: { name: true, price: true, artikul: true, barcode: true, logo: false, custom1: false, custom2: false },
        font: { size: 28, weight: 700, align: "center", sampleText: "30,000" },
      },
    ];
  });
  const [activeLabelTemplateId, setActiveLabelTemplateId] = useState(0);
  const [showLabelTemplateEditor, setShowLabelTemplateEditor] = useState(false);
  const [labelTemplateDraft, setLabelTemplateDraft] = useState(null);
  const [labelDragState, setLabelDragState] = useState(null);
  const labelPreviewRef = useRef(null);
  const [labelPrintSearch, setLabelPrintSearch] = useState("");
  const [labelPrintRowsPerLine, setLabelPrintRowsPerLine] = useState(1);
  const [labelPrintQty, setLabelPrintQty] = useState({});
  const [showLabelPrintPreview, setShowLabelPrintPreview] = useState(false);
  const [productBarcodes, setProductBarcodes] = useState([""]);
  const [stockForm, setStockForm] = useState({ product_id: "", qty_delta: 0, reason: "adjustment", note: "" });
  const [adminSection, setAdminSection] = useState(() => localStorage.getItem("adminSection") || "reports");
  const [reportsView, setReportsView] = useState(() => localStorage.getItem("reportsView") || "sales");
  const [productsView, setProductsView] = useState(() => localStorage.getItem("productsView") || "products");
  const [financeView, setFinanceView] = useState(() => localStorage.getItem("financeView") || "supplier-payments");
  const [sidebarOpen, setSidebarOpen] = useState(() => localStorage.getItem("sidebarOpen") !== "false");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(() => localStorage.getItem("sidebarCollapsed") === "true");
  const [isDesktop, setIsDesktop] = useState(() => window.innerWidth > 980);
  const [financeForm, setFinanceForm] = useState({ supplier: "", amount: "", note: "" });
  const [financeRecords, setFinanceRecords] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [purchases, setPurchases] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [returns, setReturns] = useState([]);
  const [auditLogs, setAuditLogs] = useState([]);
  const [currentShift, setCurrentShift] = useState(null);
  const [shiftsList, setShiftsList] = useState([]);
  const [expandedShiftId, setExpandedShiftId] = useState(null);
  const [shiftFilter, setShiftFilter] = useState(() => {
    const to = toLocalInput(nowLocal);
    const fromDate = new Date(nowLocal.getTime() - 30 * 24 * 60 * 60 * 1000);
    return { from: toLocalInput(fromDate), to };
  });
  const [supplierForm, setSupplierForm] = useState({ name: "", phone: "", address: "", note: "" });
  const [purchaseForm, setPurchaseForm] = useState({ supplier_id: "", product_id: "", qty: 1, buy_price: 0, created_by: "Admin 1", note: "" });
  const [shiftOpenForm, setShiftOpenForm] = useState({ cashier_name: "Cashier 1", opening_cash: 0 });
  const [shiftCloseForm, setShiftCloseForm] = useState({ closing_cash: 0, note: "" });
  const [expenseForm, setExpenseForm] = useState({ title: "", amount: "", category: "other", note: "", created_by: "Admin 1" });
  const [returnForm, setReturnForm] = useState({ sale_id: "", cashier_name: "Cashier 1", product_id: "", qty: 1, reason: "", note: "" });
  const [employees, setEmployees] = useState([
    { id: 1, name: "Ali Kassir", role: "Cashier", phone: "+998 90 111 22 33" },
    { id: 2, name: "Malika Admin", role: "Admin", phone: "+998 90 444 55 66" },
  ]);

  const t = I18N[lang];

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  useEffect(() => {
    localStorage.setItem("theme", theme);
  }, [theme]);

  useEffect(() => {
    localStorage.setItem("lang", lang);
  }, [lang]);

  useEffect(() => {
    if (session) {
      localStorage.setItem("session", JSON.stringify(session));
    } else {
      localStorage.removeItem("session");
    }
  }, [session]);

  useEffect(() => {
    localStorage.setItem("mode", mode);
  }, [mode]);

  useEffect(() => {
    localStorage.setItem("adminSection", adminSection);
  }, [adminSection]);

  useEffect(() => {
    localStorage.setItem("reportsView", reportsView);
  }, [reportsView]);

  useEffect(() => {
    localStorage.setItem("productsView", productsView);
  }, [productsView]);

  useEffect(() => {
    localStorage.setItem("financeView", financeView);
  }, [financeView]);

  useEffect(() => {
    localStorage.setItem("settingsView", settingsView);
  }, [settingsView]);

  useEffect(() => {
    localStorage.setItem("labelTemplates", JSON.stringify(labelTemplates));
  }, [labelTemplates]);

  useEffect(() => {
    localStorage.setItem("sidebarOpen", String(sidebarOpen));
  }, [sidebarOpen]);

  useEffect(() => {
    localStorage.setItem("sidebarCollapsed", String(sidebarCollapsed));
  }, [sidebarCollapsed]);

  useEffect(() => {
    function onResize() {
      const desktop = window.innerWidth > 980;
      setIsDesktop(desktop);
      if (desktop) {
        setSidebarOpen(true);
      }
    }
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  useEffect(() => {
    if (session) refresh();
  }, [session]);

  useEffect(() => {
    localStorage.setItem("quickSaleTiles", JSON.stringify(quickSaleTiles));
  }, [quickSaleTiles]);

  useEffect(() => {
    if (!categoryQuickEdit) return;
    function onPointerDown(e) {
      if (!categoryQuickPopoverRef.current) return;
      if (!categoryQuickPopoverRef.current.contains(e.target)) {
        setCategoryQuickEdit(null);
      }
    }
    window.addEventListener("pointerdown", onPointerDown);
    return () => window.removeEventListener("pointerdown", onPointerDown);
  }, [categoryQuickEdit]);

  useEffect(() => {
    if (!labelDragState || !showLabelTemplateEditor) return;
    function onMove(e) {
      if (!labelPreviewRef.current) return;
      const rect = labelPreviewRef.current.getBoundingClientRect();
      const nextX = e.clientX - rect.left - labelDragState.offsetX;
      const nextY = e.clientY - rect.top - labelDragState.offsetY;
      updateLabelElementPosition(labelDragState.key, nextX, nextY);
    }
    function onUp() {
      setLabelDragState(null);
    }
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
    };
  }, [labelDragState, showLabelTemplateEditor]);

  useEffect(() => {
    if (!inlineEdit) return;
    function onPointerDown(e) {
      if (!productQuickPopoverRef.current) return;
      if (!productQuickPopoverRef.current.contains(e.target)) {
        setInlineEdit(null);
      }
    }
    window.addEventListener("pointerdown", onPointerDown);
    return () => window.removeEventListener("pointerdown", onPointerDown);
  }, [inlineEdit]);

  const filteredProducts = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return products;
    return products.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        String(p.artikul || "").toLowerCase().includes(q) ||
        String(p.barcode || "").toLowerCase().includes(q) ||
        String(p.category || "").toLowerCase().includes(q)
    );
  }, [products, search]);

  const selectedProduct = useMemo(() => products.find((x) => x.id === Number(saleForm.product_id)), [products, saleForm.product_id]);
  const cartTotal = useMemo(() => cart.reduce((sum, x) => sum + x.lineTotal, 0), [cart]);
  const lowStockProducts = useMemo(() => products.filter((p) => p.stock_qty <= p.min_stock), [products]);
  const checksSummary = useMemo(() => {
    const from = new Date(checksFilter.from).getTime();
    const to = new Date(checksFilter.to).getTime();
    const filteredReturns = returns.filter((r) => {
      const ts = new Date(r.created_at).getTime();
      return ts >= from && ts <= to;
    });
    const totalSalesAmount = salesList.reduce((sum, s) => sum + Math.max(0, Number(s.total_amount || 0)), 0);
    const totalSalesChecks = salesList.filter((s) => Number(s.total_amount || 0) >= 0).length;
    const totalReturnChecks = filteredReturns.length;
    const totalReturnsAmount = filteredReturns.reduce((sum, r) => sum + Number(r.total_amount || 0), 0);
    const returnedItems = filteredReturns.reduce((sum, r) => sum + Number(r.total_amount > 0 ? 1 : 0), 0);
    const totalSalesCost = salesList.reduce((sum, s) => {
      const lineCost = (s.items || []).reduce((acc, it) => {
        const p = products.find((x) => x.id === it.product_id);
        return acc + Number(it.qty || 0) * Number(p?.buy_price || 0);
      }, 0);
      return sum + lineCost;
    }, 0);
    const totalReturnsCost = filteredReturns.reduce((sum, r) => sum + Number(r.total_amount || 0) * 0.65, 0);
    const income = totalSalesAmount - totalSalesCost - totalReturnsAmount;
    return {
      checksCount: salesList.length,
      revenue: totalSalesAmount,
      avg: totalSalesChecks ? totalSalesAmount / totalSalesChecks : 0,
      totalSalesAmount,
      totalSalesCost,
      totalPayments: totalSalesAmount,
      income,
      totalSalesChecks,
      totalReturnsAmount,
      totalReturnsCost,
      returnedItems,
      expenseOut: 0,
      totalReturnChecks,
    };
  }, [salesList, products, returns, checksFilter.from, checksFilter.to]);
  const productStats = useMemo(() => {
    const totalProducts = products.length;
    const totalStockQty = products.reduce((sum, p) => sum + Number(p.stock_qty || 0), 0);
    const totalStockValue = products.reduce((sum, p) => sum + Number(p.stock_qty || 0) * Number(p.buy_price || 0), 0);
    const low = products.filter((p) => Number(p.stock_qty) <= Number(p.min_stock)).length;
    return { totalProducts, totalStockQty, totalStockValue, low };
  }, [products]);
  const inventoryRows = useMemo(
    () =>
      products.map((p) => {
        const qty = Number(p.stock_qty || 0);
        const costAmount = qty * Number(p.buy_price || 0);
        const sellAmount = qty * Number(p.sell_price || 0);
        return {
          ...p,
          qty,
          costAmount,
          sellAmount,
          isWeight: p.unit === "kg",
        };
      }),
    [products]
  );
  const inventorySummary = useMemo(() => {
    const totalSell = inventoryRows.reduce((sum, r) => sum + r.sellAmount, 0);
    const totalCost = inventoryRows.reduce((sum, r) => sum + r.costAmount, 0);
    return {
      totalSell,
      totalCost,
      profit: totalSell - totalCost,
    };
  }, [inventoryRows]);
  const historyCategories = useMemo(() => {
    const set = new Set(
      products
        .map((p) => String(p.category || "").trim())
        .filter(Boolean)
    );
    return Array.from(set).sort((a, b) => a.localeCompare(b));
  }, [products]);
  const productCategories = useMemo(() => {
    const all = [
      ...products.map((p) => String(p.category || "").trim()).filter(Boolean),
      ...customCategories.map((c) => String(c.name || "").trim()).filter(Boolean),
    ];
    return Array.from(new Set(all)).sort((a, b) => a.localeCompare(b));
  }, [products, customCategories]);
  const categoryRows = useMemo(() => {
    const byName = new Map();
    products.forEach((p) => {
      const name = String(p.category || "").trim();
      if (!name) return;
      const key = name.toLowerCase();
      const existing = byName.get(key);
      if (existing) {
        existing.productCount += 1;
      } else {
        byName.set(key, {
          id: p.id,
          name,
          imageName: "",
          tariff: "",
          productCount: 1,
          source: "product",
          online: false,
        });
      }
    });
    customCategories.forEach((c, idx) => {
      const name = String(c.name || "").trim();
      if (!name) return;
      const key = name.toLowerCase();
      const existing = byName.get(key);
      if (existing) {
        existing.imageName = c.imageName || existing.imageName || "";
        existing.tariff = c.tariff || existing.tariff || "";
        existing.source = "custom";
      } else {
        byName.set(key, {
          id: 9000 + idx,
          name,
          imageName: c.imageName || "",
          tariff: c.tariff || "",
          productCount: 0,
          source: "custom",
          online: false,
        });
      }
    });
    return Array.from(byName.values()).sort((a, b) => a.name.localeCompare(b.name));
  }, [products, customCategories]);
  const filteredCategoryRows = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return categoryRows;
    return categoryRows.filter((row) => row.name.toLowerCase().includes(q));
  }, [categoryRows, search]);
  const quickCategoryTiles = useMemo(
    () => quickSaleTiles.filter((tile) => tile.type === "category"),
    [quickSaleTiles]
  );
  const quickProductTiles = useMemo(
    () => quickSaleTiles.filter((tile) => tile.type === "product"),
    [quickSaleTiles]
  );
  const quickSellProducts = useMemo(() => {
    const byId = new Map();
    quickProductTiles.forEach((tile) => {
      const product = products.find((p) => Number(p.id) === Number(tile.productId));
      if (!product) return;
      byId.set(Number(product.id), product);
    });
    quickCategoryTiles.forEach((tile) => {
      const cname = String(tile.categoryName || "").trim().toLowerCase();
      if (!cname) return;
      products.forEach((p) => {
        if (String(p.category || "").trim().toLowerCase() === cname) {
          byId.set(Number(p.id), p);
        }
      });
    });
    let rows = Array.from(byId.values());
    if (activeQuickCategory !== "all") {
      rows = rows.filter(
        (p) => String(p.category || "").trim().toLowerCase() === activeQuickCategory.toLowerCase()
      );
    }
    rows.sort((a, b) => String(a.name || "").localeCompare(String(b.name || "")));
    return rows;
  }, [quickProductTiles, quickCategoryTiles, products, activeQuickCategory]);
  const quickCashierTiles = useMemo(() => {
    return quickSaleTiles
      .map((tile) => {
        if (tile.type === "category") {
          return { ...tile, kind: "category" };
        }
        const product = products.find((p) => Number(p.id) === Number(tile.productId));
        if (!product) return null;
        if (activeQuickCategory !== "all") {
          const pcat = String(product.category || "").trim().toLowerCase();
          if (pcat !== activeQuickCategory.toLowerCase()) return null;
        }
        return { ...tile, kind: "product", product };
      })
      .filter(Boolean);
  }, [quickSaleTiles, products, activeQuickCategory]);
  const activeLabelTemplate = useMemo(
    () => labelTemplates.find((x) => x.id === activeLabelTemplateId) || labelTemplates[0] || null,
    [labelTemplates, activeLabelTemplateId]
  );
  const labelPrintProducts = useMemo(() => {
    const q = labelPrintSearch.trim().toLowerCase();
    if (!q) return products;
    return products.filter(
      (p) =>
        String(p.name || "").toLowerCase().includes(q) ||
        String(p.artikul || "").toLowerCase().includes(q) ||
        String(p.barcode || "").toLowerCase().includes(q)
    );
  }, [products, labelPrintSearch]);
  const labelPrintSelectedRows = useMemo(
    () =>
      labelPrintProducts
        .map((p) => ({ product: p, qty: Number(labelPrintQty[p.id] || 0) }))
        .filter((x) => x.qty > 0),
    [labelPrintProducts, labelPrintQty]
  );
  const weightProducts = useMemo(() => {
    const rows = products.filter((p) => String(p.unit || "").toLowerCase() === "kg");
    const q = weightSearch.trim().toLowerCase();
    if (!q) return rows;
    return rows.filter(
      (p) =>
        String(p.name || "").toLowerCase().includes(q) ||
        String(p.artikul || "").toLowerCase().includes(q) ||
        String(p.id || "").includes(q) ||
        String(p.category || "").toLowerCase().includes(q)
    );
  }, [products, weightSearch]);

  useEffect(() => {
    if (!products.length) return;
    setQuickSaleTiles((prev) => {
      const next = prev.filter((tile) => {
        if (tile.type === "product") {
          return products.some((p) => Number(p.id) === Number(tile.productId));
        }
        if (tile.type === "category") {
          return productCategories.some(
            (c) => String(c).toLowerCase() === String(tile.categoryName || "").toLowerCase()
          );
        }
        return false;
      });
      if (next.length === prev.length) return prev;
      return next;
    });
  }, [products, productCategories]);
  const historyRows = useMemo(() => {
    const byProduct = new Map();
    historySales.forEach((sale) => {
      (sale.items || []).forEach((item) => {
        const qty = Number(item.qty || 0);
        if (qty <= 0) return;
        const product = products.find((p) => Number(p.id) === Number(item.product_id));
        const productName = product?.name || `#${item.product_id}`;
        const category = product?.category || "Uncategorized";
        const listPrice = Number(product?.sell_price || item.price || 0);
        const buyPrice = Number(product?.buy_price || 0);
        const soldPrice = Number(item.price || listPrice);
        const lineTotal = Number(item.line_total || soldPrice * qty);
        const discount = Math.max(0, listPrice - soldPrice) * qty;
        const profit = (soldPrice - buyPrice) * qty;
        const key = Number(item.product_id);
        const current = byProduct.get(key) || {
          product_id: key,
          product_name: productName,
          category,
          list_price: listPrice,
          sold_qty: 0,
          sold_amount: 0,
          discount_amount: 0,
          profit_amount: 0,
        };
        current.sold_qty += qty;
        current.sold_amount += lineTotal;
        current.discount_amount += discount;
        current.profit_amount += profit;
        byProduct.set(key, current);
      });
    });
    let rows = Array.from(byProduct.values());
    const q = historyFilter.search.trim().toLowerCase();
    if (q) {
      rows = rows.filter(
        (r) =>
          String(r.product_name || "").toLowerCase().includes(q) ||
          String(r.product_id || "").includes(q)
      );
    }
    if (historyFilter.category !== "all") {
      rows = rows.filter((r) => r.category === historyFilter.category);
    }
    rows.sort((a, b) => b.sold_amount - a.sold_amount);
    return rows;
  }, [historySales, products, historyFilter.search, historyFilter.category]);
  const historySummary = useMemo(() => {
    const totals = historyRows.reduce(
      (acc, row) => {
        acc.products += 1;
        acc.qty += Number(row.sold_qty || 0);
        acc.revenue += Number(row.sold_amount || 0);
        acc.discount += Number(row.discount_amount || 0);
        acc.profit += Number(row.profit_amount || 0);
        return acc;
      },
      { products: 0, qty: 0, revenue: 0, discount: 0, profit: 0 }
    );
    totals.avgPrice = totals.qty ? totals.revenue / totals.qty : 0;
    return totals;
  }, [historyRows]);
  const visibleShifts = useMemo(() => shiftsList, [shiftsList]);
  function shiftSalesFor(shift) {
    if (!shift) return [];
    const start = new Date(shift.opened_at).getTime();
    const end = shift.closed_at ? new Date(shift.closed_at).getTime() : Date.now();
    return salesList.filter((s) => {
      const ts = new Date(s.created_at).getTime();
      return ts >= start && ts <= end;
    });
  }

  function formatMoney(value) {
    return Number(value || 0).toLocaleString("ru-RU", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  }

  const weekdayLabel = (n) => {
    const map = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    return map[Number(n)] || n;
  };

  function periodRange(days) {
    const to = new Date();
    const from = new Date(to.getTime() - days * 24 * 60 * 60 * 1000);
    return { from: toLocalInput(from), to: toLocalInput(to) };
  }
  function dayRangeToIso(fromDay, toDay) {
    const from = new Date(`${fromDay}T00:00:00`);
    const to = new Date(`${toDay}T23:59:59.999`);
    return { fromIso: from.toISOString(), toIso: to.toISOString() };
  }

  async function refresh() {
    setLoading(true);
    setError("");
    try {
      const historyRange = dayRangeToIso(historyFilter.from, historyFilter.to);
      const [items, daily, top, dash] = await Promise.all([
        api.listProducts(),
        api.dailyReport(),
        api.popularProducts(),
        api.dashboardReport(),
      ]);
      setProducts(items.length ? items : demoProducts());
      setReport((daily?.sales_count || daily?.revenue) ? daily : demoDailyReport());
      setPopular(top);
      setDashboard((dash?.today?.sales_count || dash?.today?.revenue) ? dash : demoDashboard());
      localStorage.setItem(
        "posOfflineCache",
        JSON.stringify({
          products: items,
          popular: top,
          quickSaleTiles,
          updatedAt: new Date().toISOString(),
        })
      );
      const stats = await api.salesStats(new Date(salesFilter.from).toISOString(), new Date(salesFilter.to).toISOString());
      setSalesStats((stats?.summary?.sales_count || stats?.summary?.revenue) ? stats : demoSalesStats());
      const ops = await Promise.allSettled([
        api.listSales(300, new Date(checksFilter.from).toISOString(), new Date(checksFilter.to).toISOString()),
        api.listSales(500, historyRange.fromIso, historyRange.toIso),
        api.listShifts(300, new Date(shiftFilter.from).toISOString(), new Date(shiftFilter.to).toISOString()),
        api.listSuppliers(),
        api.listPurchases(),
        api.listExpenses(),
        api.listReturns(),
        api.auditLogs(),
        api.currentShift(),
        api.listLabelTemplates(),
      ]);
      if (ops[0].status === "fulfilled") setSalesList(ops[0].value.length ? ops[0].value : demoSales());
      if (ops[1].status === "fulfilled") setHistorySales(ops[1].value.length ? ops[1].value : demoSales());
      if (ops[2].status === "fulfilled") setShiftsList(ops[2].value.length ? ops[2].value : demoShifts());
      if (ops[3].status === "fulfilled") setSuppliers(ops[3].value);
      if (ops[4].status === "fulfilled") setPurchases(ops[4].value);
      if (ops[5].status === "fulfilled") setExpenses(ops[5].value);
      if (ops[6].status === "fulfilled") setReturns(ops[6].value);
      if (ops[7].status === "fulfilled") setAuditLogs(ops[7].value);
      if (ops[8].status === "fulfilled") setCurrentShift(ops[8].value);
      if (ops[9].status === "fulfilled" && Array.isArray(ops[9].value)) {
        const templates = ops[9].value.map(normalizeTemplateFromApi);
        if (templates.length) {
          setLabelTemplates(templates);
          setActiveLabelTemplateId((prev) =>
            templates.some((x) => Number(x.id) === Number(prev)) ? prev : templates[0].id
          );
        }
      }
    } catch (e) {
      setError(e.message);
      try {
        const raw = localStorage.getItem("posOfflineCache");
        const cache = raw ? JSON.parse(raw) : null;
        if (cache?.products?.length) {
          setProducts(cache.products);
          setPopular(Array.isArray(cache.popular) ? cache.popular : []);
          if (Array.isArray(cache.quickSaleTiles)) {
            setQuickSaleTiles(cache.quickSaleTiles);
          }
          setSyncNote(`Offline rejim: keshlangan ma'lumot (${new Date(cache.updatedAt || Date.now()).toLocaleString()})`);
        }
      } catch {
        // ignore cache read error
      }
    } finally {
      setLoading(false);
    }
  }

  async function applySalesFilter(e) {
    e.preventDefault();
    try {
      const stats = await api.salesStats(new Date(salesFilter.from).toISOString(), new Date(salesFilter.to).toISOString());
      setSalesStats((stats?.summary?.sales_count || stats?.summary?.revenue) ? stats : demoSalesStats());
    } catch (err) {
      setError(err.message);
    }
  }

  async function quickSalesPeriod(days) {
    const range = periodRange(days);
    setSalesFilter(range);
    try {
      const stats = await api.salesStats(new Date(range.from).toISOString(), new Date(range.to).toISOString());
      setSalesStats((stats?.summary?.sales_count || stats?.summary?.revenue) ? stats : demoSalesStats());
    } catch (err) {
      setError(err.message);
    }
  }

  async function applyChecksFilter(e) {
    e.preventDefault();
    try {
      const checks = await api.listSales(
        300,
        new Date(checksFilter.from).toISOString(),
        new Date(checksFilter.to).toISOString()
      );
      setSalesList(checks);
      setExpandedCheckId(null);
    } catch (err) {
      setError(err.message);
    }
  }

  async function quickChecksPeriod(days) {
    const range = periodRange(days);
    setChecksFilter(range);
    try {
      const checks = await api.listSales(300, new Date(range.from).toISOString(), new Date(range.to).toISOString());
      setSalesList(checks);
      setExpandedCheckId(null);
    } catch (err) {
      setError(err.message);
    }
  }

  async function applyHistoryFilter(e) {
    e.preventDefault();
    try {
      const { fromIso, toIso } = dayRangeToIso(historyFilter.from, historyFilter.to);
      const rows = await api.listSales(500, fromIso, toIso);
      setHistorySales(rows);
    } catch (err) {
      setError(err.message);
    }
  }

  async function applyShiftFilter(e) {
    e.preventDefault();
    try {
      const rows = await api.listShifts(
        300,
        new Date(shiftFilter.from).toISOString(),
        new Date(shiftFilter.to).toISOString()
      );
      setShiftsList(rows);
      setExpandedShiftId(null);
    } catch (err) {
      setError(err.message);
    }
  }

  function handleLogin(e) {
    e.preventDefault();
    setSession({ role: login.role });
    setError("");
    setMode(login.role === "admin" ? "admin" : "cashier");
  }

  function addToCart(product = selectedProduct, options = {}) {
    if (!product) return;
    const qtyBase = Number((options.qtyOverride ?? saleForm.qty) || 0);
    if (!qtyBase) return;
    const qty = returnMode ? -Math.abs(qtyBase) : Math.abs(qtyBase);
    const discount = Number(saleForm.discount || 0);
    const markup = Number(saleForm.markup || 0);
    const unitPrice = product.sell_price * (1 - discount / 100) * (1 + markup / 100);
    const lineTotal = Number((qty * unitPrice).toFixed(2));
    setCart((prev) => [
      ...prev,
      {
        id: product.id,
        name: product.name,
        qty,
        unitPrice: Number(unitPrice.toFixed(2)),
        lineTotal,
      },
    ]);
  }

  function addQuickTile() {
    const value = String(quickTileValue || "").trim();
    if (!value) return;
    if (quickTileTab === "product") {
      const product = products.find((p) => Number(p.id) === Number(value));
      if (!product) return;
      const id = `p-${product.id}`;
      setQuickSaleTiles((prev) => {
        if (prev.some((x) => x.id === id)) return prev;
        return [...prev, { id, type: "product", productId: Number(product.id), label: product.name }];
      });
    } else {
      const categoryName = value;
      const id = `c-${categoryName.toLowerCase()}`;
      setQuickSaleTiles((prev) => {
        if (prev.some((x) => x.id === id)) return prev;
        return [...prev, { id, type: "category", categoryName, label: categoryName }];
      });
    }
    setQuickTileValue("");
    setQuickTileSearch("");
    setShowQuickTileModal(false);
  }

  function removeQuickTile(tileId) {
    setQuickSaleTiles((prev) => prev.filter((x) => x.id !== tileId));
  }

  function downloadTextFile(filename, content) {
    const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }

  function sanitizeScaleText(value) {
    return String(value ?? "")
      .replace(/[\r\n]+/g, " ")
      .replace(/;/g, ",")
      .trim();
  }

  function buildScaleText(rows) {
    return rows
      .map((p, idx) => {
        const name = sanitizeScaleText(p.name);
        const price = Math.round(Number(p.sell_price || 0));
        const code = Number(p.artikul || p.id || idx + 1);
        return `${idx + 1};${name};;${price};0;0;0;${code};0;0;;01.01.01;0;7;11;0;01.01.2001`;
      })
      .join("\n");
  }

  function normalizeTemplateFromApi(row) {
    const defaultPositions = {
      name: { x: 8, y: 8 },
      price: { x: 8, y: 42 },
      barcode: { x: 8, y: 94 },
      artikul: { x: 184, y: 96 },
      custom1: { x: 8, y: 118 },
      custom2: { x: 8, y: 136 },
    };
    return {
      id: row.id,
      name: row.name,
      width: row.width,
      height: row.height,
      formatPrice: Boolean(row.format_price),
      priceSuffix: row.price_suffix || "",
      show: row.show || {},
      font: {
        size: Number(row?.font?.size ?? 28),
        weight: Number(row?.font?.weight ?? 700),
        align: row?.font?.align || "center",
        sampleText: row?.font?.sampleText || "30,000",
        positions: { ...defaultPositions, ...(row?.font?.positions || {}) },
      },
    };
  }

  function toTemplateApiPayload(template) {
    return {
      name: template.name,
      width: Number(template.width || 58),
      height: Number(template.height || 40),
      format_price: Boolean(template.formatPrice),
      price_suffix: template.priceSuffix || "",
      show: template.show || {},
      font: template.font || {},
    };
  }

  function exportWeightProducts() {
    const header = "№;Tarozi kodi;Nomi;Toifa;Narxi";
    const body = weightProducts
      .map((p, idx) => {
        const code = sanitizeScaleText(p.artikul || p.id);
        const name = sanitizeScaleText(p.name);
        const category = sanitizeScaleText(p.category || "");
        const price = Math.round(Number(p.sell_price || 0));
        return `${idx + 1};${code};${name};${category};${price}`;
      })
      .join("\n");
    downloadTextFile(`weight-products-${new Date().toISOString().slice(0, 10)}.txt`, `${header}\n${body}`);
  }

  function uploadScaleText() {
    const rows = products.filter((p) => String(p.unit || "").toLowerCase() === "kg");
    const content = buildScaleText(rows);
    const scaleSafe = sanitizeScaleText(scaleName || "scale").replace(/\s+/g, "_");
    downloadTextFile(`${scaleSafe}.txt`, content);
  }

  function createEmptyLabelTemplate() {
    return {
      id: 0,
      name: "Yangi cennik",
      width: 58,
      height: 40,
      formatPrice: false,
      priceSuffix: "",
      show: { name: true, price: true, artikul: true, barcode: true, logo: false, custom1: false, custom2: false },
      font: {
        size: 28,
        weight: 700,
        align: "center",
        sampleText: "30,000",
        positions: {
          name: { x: 8, y: 8 },
          price: { x: 8, y: 42 },
          barcode: { x: 8, y: 94 },
          artikul: { x: 184, y: 96 },
          custom1: { x: 8, y: 118 },
          custom2: { x: 8, y: 136 },
        },
      },
    };
  }

  function updateLabelElementPosition(key, x, y) {
    setLabelTemplateDraft((prev) => ({
      ...prev,
      font: {
        ...prev.font,
        positions: {
          ...(prev.font?.positions || {}),
          [key]: { x: Math.max(0, Math.round(x)), y: Math.max(0, Math.round(y)) },
        },
      },
    }));
  }

  function openCreateLabelTemplate() {
    setLabelTemplateDraft(createEmptyLabelTemplate());
    setShowLabelTemplateEditor(true);
  }

  function openEditLabelTemplate(template) {
    setLabelTemplateDraft(JSON.parse(JSON.stringify(template)));
    setShowLabelTemplateEditor(true);
  }

  async function saveLabelTemplate() {
    if (!labelTemplateDraft) return;
    try {
      let saved;
      if (Number(labelTemplateDraft.id) > 0) {
        saved = await api.updateLabelTemplate(labelTemplateDraft.id, toTemplateApiPayload(labelTemplateDraft));
      } else {
        saved = await api.createLabelTemplate(toTemplateApiPayload(labelTemplateDraft));
      }
      const normalized = normalizeTemplateFromApi(saved);
      setLabelTemplates((prev) => {
        const idx = prev.findIndex((x) => Number(x.id) === Number(normalized.id));
        if (idx < 0) return [...prev, normalized];
        const next = [...prev];
        next[idx] = normalized;
        return next;
      });
      setActiveLabelTemplateId(normalized.id);
      setShowLabelTemplateEditor(false);
      setLabelTemplateDraft(null);
    } catch (e) {
      setError(e.message);
    }
  }

  function reorderQuickTiles(fromId, toId) {
    if (!fromId || !toId || fromId === toId) return;
    setQuickSaleTiles((prev) => {
      const fromIndex = prev.findIndex((x) => x.id === fromId);
      const toIndex = prev.findIndex((x) => x.id === toId);
      if (fromIndex < 0 || toIndex < 0) return prev;
      const next = [...prev];
      const [moved] = next.splice(fromIndex, 1);
      next.splice(toIndex, 0, moved);
      return next;
    });
  }

  async function syncOfflineCacheNow() {
    setSyncNote("Sinxronizatsiya jarayoni...");
    try {
      await refresh();
      const raw = localStorage.getItem("posOfflineCache");
      const cache = raw ? JSON.parse(raw) : null;
      setSyncNote(`Sinxronizatsiya tayyor (${new Date(cache?.updatedAt || Date.now()).toLocaleString()})`);
    } catch {
      setSyncNote("Sinxronizatsiya bajarilmadi");
    }
  }

  async function checkout() {
    if (!cart.length) return;
    try {
      await api.createSale({
        cashier_name: saleForm.cashier_name,
        payment_type: saleForm.payment_type,
        items: cart.map((x) => ({ product_id: x.id, qty: x.qty, price_override: x.unitPrice })),
      });
      printReceipt({
        shiftNumber,
        cashier: saleForm.cashier_name,
        paymentType: saleForm.payment_type,
        cart,
        total: cartTotal,
      });
      setCart([]);
      const nextShift = shiftNumber + 1;
      setShiftNumber(nextShift);
      localStorage.setItem("shiftNumber", String(nextShift));
      refresh();
    } catch (e) {
      setError(e.message);
    }
  }

  async function createProduct(e) {
    e.preventDefault();
    try {
      const normalizedBarcodes = productBarcodes.map((x) => x.trim()).filter(Boolean);
      const payload = {
        name: productForm.name,
        barcode: normalizedBarcodes.join(", "),
        category: productForm.category,
        unit: productForm.unit,
        buy_price: Number(productForm.buy_price),
        sell_price: Number(productForm.sell_price) > 0 ? Number(productForm.sell_price) : 1,
        stock_qty: Number(productForm.stock_qty),
        min_stock: Number(productForm.min_stock),
      };
      if (editingProductId) {
        await api.updateProduct(editingProductId, payload);
      } else {
        await api.createProduct(payload);
      }
      setProductForm({ name: "", unit: "kg", barcode: "", category: "General", imageName: "", tariff: "", buy_price: 0, sell_price: 0, stock_qty: 0, min_stock: 0 });
      setProductBarcodes([""]);
      setShowProductModal(false);
      setEditingProductId(null);
      refresh();
    } catch (e) {
      setError(e.message);
    }
  }

  function openProductEdit(product) {
    setEditingProductId(product.id);
    setProductForm({
      name: product.name || "",
      unit: product.unit || "kg",
      barcode: "",
      category: product.category || "General",
      imageName: "",
      tariff: "",
      buy_price: Number(product.buy_price || 0),
      sell_price: Number(product.sell_price || 0),
      stock_qty: Number(product.stock_qty || 0),
      min_stock: Number(product.min_stock || 0),
    });
    setProductBarcodes(
      String(product.barcode || "")
        .split(",")
        .map((x) => x.trim())
        .filter(Boolean).length
        ? String(product.barcode || "")
            .split(",")
            .map((x) => x.trim())
            .filter(Boolean)
        : [""]
    );
    setShowProductModal(true);
  }

  async function removeProduct(product) {
    const qty = Number(product.stock_qty || 0);
    if (qty !== 0) {
      setWarningModal({
        open: true,
        title: "Ogohlantirish",
        message: "Mahsulot qoldig'i 0 bo'lmaganda o'chirish taqiqlanadi",
        confirmMode: false,
        onConfirm: null,
      });
      return;
    }
    setWarningModal({
      open: true,
      title: "Tasdiqlash",
      message: `Mahsulotni o'chirasizmi?\n\n${product.name}`,
      confirmMode: true,
      onConfirm: async () => {
        try {
          await api.deleteProduct(product.id);
          refresh();
        } catch (e) {
          setError(e.message);
        }
      },
    });
  }

  function startInlineEdit(product, field, event) {
    const allowed = new Set(["name", "sell_price", "buy_price"]);
    if (!allowed.has(field)) return;
    if (inlineEdit?.id === product.id && inlineEdit?.field === field) return;
    const cellRect = event?.currentTarget?.getBoundingClientRect?.();
    const popoverWidth = 220;
    const left = cellRect
      ? Math.max(8, Math.min(cellRect.left, window.innerWidth - popoverWidth - 8))
      : 16;
    const top = cellRect ? Math.min(cellRect.bottom + 6, window.innerHeight - 110) : 16;
    setInlineEdit({ id: product.id, field, value: String(product[field] ?? ""), top, left });
  }

  async function commitInlineEdit(draft = inlineEdit) {
    if (!draft) return;
    const payload = {};
    if (draft.field === "name") {
      const name = draft.value.trim();
      if (!name) {
        setError("Nomi bo'sh bo'lmasligi kerak");
        return;
      }
      payload.name = name;
    }
    if (draft.field === "sell_price" || draft.field === "buy_price") {
      const normalized = String(draft.value ?? "").replace(/\s/g, "").replace(",", ".");
      const num = Number(normalized);
      if (!Number.isFinite(num) || num < 0) {
        setError("Narx noto'g'ri kiritildi");
        return;
      }
      if (draft.field === "sell_price") payload.sell_price = num;
      if (draft.field === "buy_price") payload.buy_price = num;
    }
    try {
      await api.updateProduct(draft.id, payload);
      setInlineEdit(null);
      refresh();
    } catch (e) {
      setError(e.message);
    }
  }

  async function createCategory(e) {
    e.preventDefault();
    const name = categoryForm.name.trim();
    if (!name) return;
    try {
      if (categoryEditingName) {
        const oldName = categoryEditingName.trim();
        const duplicate = categoryRows.some(
          (c) =>
            c.name.toLowerCase() === name.toLowerCase() &&
            c.name.toLowerCase() !== oldName.toLowerCase()
        );
        if (duplicate) {
          setError("Bu nomdagi kategoriya allaqachon mavjud");
          return;
        }
        const affectedProducts = products.filter(
          (p) => String(p.category || "").trim().toLowerCase() === oldName.toLowerCase()
        );
        if (name.toLowerCase() !== oldName.toLowerCase()) {
          await Promise.all(
            affectedProducts.map((p) => api.updateProduct(p.id, { category: name }))
          );
        }
        setCustomCategories((prev) => {
          const withoutOld = prev.filter((c) => c.name.toLowerCase() !== oldName.toLowerCase());
          return [...withoutOld, { ...categoryForm, name }];
        });
      } else {
        setCustomCategories((prev) => {
          if (prev.some((c) => c.name.toLowerCase() === name.toLowerCase())) return prev;
          return [...prev, { ...categoryForm, name }];
        });
      }
      setProductForm((s) => {
        if (categoryEditingName && String(s.category || "").trim().toLowerCase() === categoryEditingName.toLowerCase()) {
          return { ...s, category: name };
        }
        return { ...s, category: name };
      });
      setCategoryForm({ name: "", imageName: "", tariff: "" });
      setCategoryEditingName("");
      setShowCategoryModal(false);
      await refresh();
    } catch (e) {
      setError(e.message);
    }
  }

  function removeCategory(categoryRow) {
    setWarningModal({
      open: true,
      title: "Kategoriyani o'chirish",
      message: `\"${categoryRow.name}\" kategoriyasini o'chirasizmi?`,
      confirmMode: true,
      onConfirm: async () => {
        try {
          const categoryName = String(categoryRow.name || "").trim();
          const affectedProducts = products.filter(
            (p) => String(p.category || "").trim().toLowerCase() === categoryName.toLowerCase()
          );
          await Promise.all(
            affectedProducts.map((p) =>
              api.updateProduct(p.id, { category: "General" })
            )
          );
          setCustomCategories((prev) =>
            prev.filter((c) => c.name.toLowerCase() !== categoryName.toLowerCase())
          );
          if (String(productForm.category || "").trim().toLowerCase() === categoryName.toLowerCase()) {
            setProductForm((s) => ({ ...s, category: "General" }));
          }
          setCategoryQuickEdit(null);
          await refresh();
        } catch (e) {
          setError(e.message);
        }
      },
    });
  }

  function startCategoryInlineEdit(categoryRow, event) {
    const name = String(categoryRow.name || "").trim();
    if (!name) return;
    if (categoryQuickEdit?.originalName?.toLowerCase() === name.toLowerCase()) return;
    const cellRect = event?.currentTarget?.getBoundingClientRect?.();
    const popoverWidth = 220;
    const left = cellRect
      ? Math.max(8, Math.min(cellRect.left, window.innerWidth - popoverWidth - 8))
      : 16;
    const top = cellRect ? Math.min(cellRect.bottom + 6, window.innerHeight - 110) : 16;
    setCategoryQuickEdit({ originalName: name, value: name, top, left });
  }

  async function commitCategoryInlineEdit(draft = categoryQuickEdit) {
    if (!draft) return;
    const originalName = String(draft.originalName || "").trim();
    const nextName = String(draft.value || "").trim();
    if (!nextName) {
      setError("Kategoriya nomi bo'sh bo'lmasligi kerak");
      return;
    }
    if (originalName.toLowerCase() === nextName.toLowerCase()) {
      setCategoryQuickEdit(null);
      return;
    }
    const duplicate = categoryRows.some(
      (c) => c.name.toLowerCase() === nextName.toLowerCase()
    );
    if (duplicate) {
      setError("Bu nomdagi kategoriya allaqachon mavjud");
      return;
    }
    try {
      const affectedProducts = products.filter(
        (p) => String(p.category || "").trim().toLowerCase() === originalName.toLowerCase()
      );
      await Promise.all(
        affectedProducts.map((p) =>
          api.updateProduct(p.id, { category: nextName })
        )
      );
      setCustomCategories((prev) =>
        prev.map((c) =>
          c.name.toLowerCase() === originalName.toLowerCase() ? { ...c, name: nextName } : c
        )
      );
      if (String(productForm.category || "").trim().toLowerCase() === originalName.toLowerCase()) {
        setProductForm((s) => ({ ...s, category: nextName }));
      }
      setCategoryQuickEdit(null);
      await refresh();
    } catch (e) {
      setError(e.message);
    }
  }

  async function adjustStock(e) {
    e.preventDefault();
    try {
      await api.adjustStock({
        product_id: Number(stockForm.product_id),
        qty_delta: Number(stockForm.qty_delta),
        reason: stockForm.reason,
        note: stockForm.note,
      });
      setStockForm({ product_id: "", qty_delta: 0, reason: "adjustment", note: "" });
      refresh();
    } catch (e) {
      setError(e.message);
    }
  }

  function addFinanceRecord(e) {
    e.preventDefault();
    if (!financeForm.supplier || !financeForm.amount) return;
    const record = {
      id: Date.now(),
      supplier: financeForm.supplier,
      amount: Number(financeForm.amount),
      note: financeForm.note,
      created_at: new Date().toLocaleString(),
    };
    setFinanceRecords((prev) => [record, ...prev]);
    setFinanceForm({ supplier: "", amount: "", note: "" });
  }

  async function handleCreateSupplier(e) {
    e.preventDefault();
    try {
      await api.createSupplier(supplierForm);
      setSupplierForm({ name: "", phone: "", address: "", note: "" });
      refresh();
    } catch (e) {
      setError(e.message);
    }
  }

  async function handleCreatePurchase(e) {
    e.preventDefault();
    try {
      await api.createPurchase({
        supplier_id: Number(purchaseForm.supplier_id),
        created_by: purchaseForm.created_by,
        note: purchaseForm.note,
        items: [
          {
            product_id: Number(purchaseForm.product_id),
            qty: Number(purchaseForm.qty),
            buy_price: Number(purchaseForm.buy_price),
          },
        ],
      });
      setPurchaseForm({ supplier_id: "", product_id: "", qty: 1, buy_price: 0, created_by: "Admin 1", note: "" });
      refresh();
    } catch (e) {
      setError(e.message);
    }
  }

  async function handleOpenShift(e) {
    e.preventDefault();
    try {
      await api.openShift({ cashier_name: shiftOpenForm.cashier_name, opening_cash: Number(shiftOpenForm.opening_cash) });
      refresh();
    } catch (e) {
      setError(e.message);
    }
  }

  async function handleCloseShift(e) {
    e.preventDefault();
    if (!currentShift?.id) return;
    try {
      await api.closeShift(currentShift.id, {
        closing_cash: Number(shiftCloseForm.closing_cash),
        note: shiftCloseForm.note,
      });
      setShiftCloseForm({ closing_cash: 0, note: "" });
      refresh();
    } catch (e) {
      setError(e.message);
    }
  }

  async function handleCreateExpense(e) {
    e.preventDefault();
    try {
      await api.createExpense({
        ...expenseForm,
        amount: Number(expenseForm.amount),
        shift_id: currentShift?.id || null,
      });
      setExpenseForm({ title: "", amount: "", category: "other", note: "", created_by: "Admin 1" });
      refresh();
    } catch (e) {
      setError(e.message);
    }
  }

  async function handleCreateReturn(e) {
    e.preventDefault();
    try {
      await api.createReturn({
        sale_id: Number(returnForm.sale_id),
        cashier_name: returnForm.cashier_name,
        note: returnForm.note,
        items: [
          {
            product_id: Number(returnForm.product_id),
            qty: Number(returnForm.qty),
            reason: returnForm.reason,
          },
        ],
      });
      setReturnForm({ sale_id: "", cashier_name: "Cashier 1", product_id: "", qty: 1, reason: "", note: "" });
      refresh();
    } catch (e) {
      setError(e.message);
    }
  }

  async function handleBackup() {
    try {
      const res = await api.createBackup();
      window.open(`http://localhost:8000${res.download_url}`, "_blank");
    } catch (e) {
      setError(e.message);
    }
  }

  if (!session) {
    return (
      <main className="app auth-layout">
        <section className="card auth-card">
          <BrandLogo />
          <h1>{t.login}</h1>
          <p className="muted">{t.subtitle}</p>
          {error && <p className="error">{error}</p>}
          <form onSubmit={handleLogin} className="grid">
            <label>{t.chooseRole}</label>
            <div className="row role-chooser">
              <button
                type="button"
                className={`role-btn ${login.role === "cashier" ? "active" : ""}`}
                onClick={() => setLogin((s) => ({ ...s, role: "cashier" }))}
              >
                {t.cashier}
              </button>
              <button
                type="button"
                className={`role-btn ${login.role === "admin" ? "active" : ""}`}
                onClick={() => setLogin((s) => ({ ...s, role: "admin" }))}
              >
                {t.admin}
              </button>
            </div>
            <button type="submit">{t.signIn}</button>
          </form>
        </section>
        <aside className="auth-visual">
          <div className="visual-overlay">
            <BrandLogo />
            <h2>{t.title}</h2>
            <p>Retail, inventory and cashier workflows in one place.</p>
          </div>
        </aside>
      </main>
    );
  }

  return (
    <main className="app">
      <header className="header">
        <div />
        {session.role === "admin" && mode === "cashier" && (
          <div className="row">
            <button type="button" onClick={() => setMode("admin")}>{t.modeAdmin}</button>
            <button
              type="button"
              onClick={() => {
                setSession(null);
                setMode("cashier");
                setAdminSection("reports");
              }}
            >
              {t.logout}
            </button>
          </div>
        )}
        {session.role !== "admin" && (
          <div className="row">
            <button
              onClick={() => {
                setSession(null);
                setMode("cashier");
                setAdminSection("reports");
              }}
            >
              {t.logout}
            </button>
          </div>
        )}
      </header>
      {loading && <p>{t.loading}</p>}
      {error && <p className="error">{error}</p>}

      {mode === "cashier" && (
        <section className="grid-2 page-transition">
          <div className="card">
            <h2>{t.modeCashier}</h2>
            <p>{t.shift}: #{shiftNumber}</p>
            <div className="kpi-grid">
              <article className="kpi-card">
                <p>{t.totalProducts}</p>
                <strong>{products.length}</strong>
              </article>
              <article className="kpi-card">
                <p>{t.cart}</p>
                <strong>{cart.length}</strong>
              </article>
              <article className="kpi-card">
                <p>{t.total}</p>
                <strong>{formatMoney(cartTotal)}</strong>
              </article>
            </div>
            <input placeholder={t.search} value={search} onChange={(e) => setSearch(e.target.value)} />
            <div className="pos-quick-board">
              <div className="pos-quick-head row">
                <strong>Kassa uchun kartochkalar</strong>
                <div className="row">
                  <button type="button" onClick={syncOfflineCacheNow}>Sinxronizatsiya</button>
                  {session.role === "admin" ? (
                    <button type="button" onClick={() => { setProductsView("top"); setMode("admin"); setAdminSection("products"); }}>
                      Sozlash
                    </button>
                  ) : null}
                </div>
              </div>
              {syncNote ? <p className="muted">{syncNote}</p> : null}
              <div className="pos-quick-categories">
                <button
                  type="button"
                  className={`pos-cat-card ${activeQuickCategory === "all" ? "active" : ""}`}
                  onClick={() => setActiveQuickCategory("all")}
                >
                  Barchasi
                </button>
                {quickCategoryTiles.map((tile) => (
                  <button
                    key={tile.id}
                    type="button"
                    className={`pos-cat-card ${activeQuickCategory.toLowerCase() === String(tile.categoryName || "").toLowerCase() ? "active" : ""}`}
                    onClick={() => setActiveQuickCategory(tile.categoryName)}
                  >
                    {tile.label}
                  </button>
                ))}
              </div>
              <div className="pos-quick-products">
                {quickCashierTiles.map((tile) => (
                  tile.kind === "category" ? (
                    <button
                      key={tile.id}
                      type="button"
                      className={`pos-product-card pos-category-card ${activeQuickCategory.toLowerCase() === String(tile.categoryName || "").toLowerCase() ? "active" : ""}`}
                      onClick={() => setActiveQuickCategory(tile.categoryName)}
                    >
                      <span>{tile.label}</span>
                      <em>toifa</em>
                    </button>
                  ) : (
                    <button key={tile.id} type="button" className="pos-product-card" onClick={() => addToCart(tile.product, { qtyOverride: 1 })}>
                      <span>{tile.product.name}</span>
                      <em>{Math.round(Number(tile.product.sell_price || 0))}</em>
                    </button>
                  )
                ))}
                {!quickCashierTiles.length && <p className="muted">Tez sotuv kartochkalari sozlanmagan</p>}
              </div>
            </div>
            <div className="chips">
              {popular.map((p) => (
                <button key={p.id} onClick={() => addToCart(products.find((x) => x.id === p.id))}>
                  {p.name}
                </button>
              ))}
            </div>
            <div className="row">
              <select value={saleForm.product_id} onChange={(e) => setSaleForm((s) => ({ ...s, product_id: e.target.value }))}>
                <option value="">{t.selectProduct}</option>
                {filteredProducts.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} ({p.sell_price})
                  </option>
                ))}
              </select>
              <input type="number" step="0.01" value={saleForm.qty} onChange={(e) => setSaleForm((s) => ({ ...s, qty: e.target.value }))} />
            </div>
            <div className="row">
              <input type="number" placeholder={t.discount} value={saleForm.discount} onChange={(e) => setSaleForm((s) => ({ ...s, discount: e.target.value }))} />
              <input type="number" placeholder={t.markup} value={saleForm.markup} onChange={(e) => setSaleForm((s) => ({ ...s, markup: e.target.value }))} />
            </div>
            <div className="row">
              <label>
                <input type="checkbox" checked={returnMode} onChange={(e) => setReturnMode(e.target.checked)} /> {t.returnMode}
              </label>
              <button onClick={() => addToCart()}>{t.add}</button>
            </div>
            <div className="row">
              <input value={saleForm.cashier_name} onChange={(e) => setSaleForm((s) => ({ ...s, cashier_name: e.target.value }))} />
              <select value={saleForm.payment_type} onChange={(e) => setSaleForm((s) => ({ ...s, payment_type: e.target.value }))}>
                <option value="cash">cash</option>
                <option value="card">card</option>
                <option value="mixed">mixed</option>
              </select>
            </div>
          </div>
          <div className="card">
            <h3>{t.cart}</h3>
            <table>
              <thead>
                <tr>
                  <th>{t.product}</th>
                  <th>{t.qty}</th>
                  <th>{t.price}</th>
                  <th>{t.line}</th>
                  <th>{t.action}</th>
                </tr>
              </thead>
              <tbody>
                {cart.map((item, idx) => (
                  <tr key={`${item.id}-${idx}`}>
                    <td>{item.name}</td>
                    <td>{item.qty}</td>
                    <td>{item.unitPrice.toFixed(2)}</td>
                    <td>{item.lineTotal.toFixed(2)}</td>
                    <td>
                      <button onClick={() => setCart((prev) => prev.filter((_, i) => i !== idx))}>{t.remove}</button>
                    </td>
                  </tr>
                ))}
                {!cart.length && (
                  <tr>
                    <td colSpan="5">{t.empty}</td>
                  </tr>
                )}
              </tbody>
            </table>
            <h3>{t.total}: {cartTotal.toFixed(2)}</h3>
            <div className="row">
              <button onClick={checkout} disabled={!cart.length}>{t.checkout}</button>
              <button onClick={() => printReceipt({ shiftNumber, cashier: saleForm.cashier_name, paymentType: saleForm.payment_type, cart, total: cartTotal })} disabled={!cart.length}>{t.print}</button>
            </div>
          </div>
        </section>
      )}

      {mode === "admin" && session.role === "admin" && (
        <section className={`admin-shell page-transition ${sidebarOpen ? "with-sidebar" : ""} ${sidebarCollapsed ? "sidebar-collapsed" : ""}`}>
          <button
            type="button"
            className={`menu-toggle-btn ${sidebarOpen ? "is-open" : "is-closed"}`}
            onClick={() => {
              if (isDesktop) {
                setSidebarCollapsed((v) => !v);
                setSidebarOpen(true);
                return;
              }
              setSidebarOpen((v) => !v);
            }}
            aria-label="Toggle menu"
          >
            <span className="menu-toggle-arrow" aria-hidden="true">
              {isDesktop ? (sidebarCollapsed ? "▶" : "◀") : (sidebarOpen ? "◀" : "▶")}
            </span>
          </button>

          {sidebarOpen ? (
            <aside className="admin-sidebar card">
              <div className="sidebar-logo">
                <BrandLogo compact />
              </div>
              <nav className="sidebar-menu">
                {[
                  { id: "reports", label: t.menuReports, icon: "📊" },
                  { id: "products", label: t.menuProducts, icon: "🧺" },
                  { id: "warehouse", label: t.menuWarehouse, icon: "📦" },
                  { id: "finance", label: t.menuFinance, icon: "💳" },
                  { id: "staff", label: t.menuStaff, icon: "🕒" },
                  { id: "returns", label: t.menuReturns, icon: "↩️" },
                  { id: "audit", label: t.menuAudit, icon: "🧾" },
                  { id: "settings", label: t.menuSettings, icon: "⚙️" },
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    className={`menu-item ${adminSection === item.id ? "active" : ""}`}
                    onClick={() => setAdminSection(item.id)}
                    title={sidebarCollapsed ? item.label : ""}
                  >
                    <span className="menu-icon" aria-hidden="true">{item.icon}</span>
                    <span className="menu-text">{item.label}</span>
                  </button>
                ))}
              </nav>
              <div className="sidebar-footer">
                <button type="button" onClick={() => setMode("cashier")}>{t.modeCashier}</button>
                <button type="button" onClick={() => setMode("admin")}>{t.modeAdmin}</button>
                <button
                  type="button"
                  onClick={() => {
                    setSession(null);
                    setMode("cashier");
                    setAdminSection("reports");
                  }}
                >
                  {t.logout}
                </button>
              </div>
            </aside>
          ) : null}

          <div className="admin-content card">
            <h2>{t.adminWorkspace}</h2>
            <div key={adminSection} className="page-transition">
              {adminSection === "reports" && (
                <div className="grid">
                  <div className="subtabs-head">{t.reportsMenu}</div>
                  <div className="subtabs-grid">
                    {[
                      { id: "sales", label: t.salesReport, icon: "🧾" },
                      { id: "checks", label: t.checks, icon: "🗒️" },
                      { id: "shift", label: t.shiftReport, icon: "🕘" },
                      { id: "inventory", label: t.inventoryEval, icon: "🏪" },
                      { id: "history", label: t.salesHistory, icon: "📜" },
                    ].map((item) => (
                      <button key={item.id} type="button" className={`subtab-btn ${reportsView === item.id ? "active" : ""}`} onClick={() => setReportsView(item.id)}>
                        <span>{item.icon}</span>
                        {item.label}
                      </button>
                    ))}
                  </div>
                  {reportsView === "sales" && (
                    <>
                      <form onSubmit={applySalesFilter} className="sales-filter-row">
                        <div className="period-quick">
                          <button type="button" onClick={() => quickSalesPeriod(1)}>Сегодня</button>
                          <button type="button" onClick={() => quickSalesPeriod(7)}>7 дней</button>
                          <button type="button" onClick={() => quickSalesPeriod(30)}>30 дней</button>
                          <button type="button" onClick={() => quickSalesPeriod(90)}>90 дней</button>
                        </div>
                        <label>{t.from}</label>
                        <input type="datetime-local" value={salesFilter.from} onChange={(e) => setSalesFilter((s) => ({ ...s, from: e.target.value }))} required />
                        <label>{t.to}</label>
                        <input type="datetime-local" value={salesFilter.to} onChange={(e) => setSalesFilter((s) => ({ ...s, to: e.target.value }))} required />
                        <button type="submit">{t.applyFilter}</button>
                      </form>
                      <div className="kpi-grid">
                        <article className="kpi-card">
                          <p>{t.todaySales}</p>
                          <strong>{salesStats?.summary?.sales_count ?? 0}</strong>
                        </article>
                        <article className="kpi-card">
                          <p>{t.todayRevenue}</p>
                          <strong>{formatMoney(salesStats?.summary?.revenue)}</strong>
                        </article>
                        <article className="kpi-card">
                          <p>{t.avgCheck}</p>
                          <strong>{formatMoney(salesStats?.summary?.avg_check)}</strong>
                        </article>
                        <article className="kpi-card">
                          <p>{t.totalProducts}</p>
                          <strong>{products.length}</strong>
                        </article>
                      </div>
                      <div className="card">
                        <h4>{t.salesReport}</h4>
                        <SalesLineChart points={salesStats?.hourly || []} />
                      </div>
                      <div className="grid-2">
                        <div className="card">
                          <h4>{t.byPayment}</h4>
                          <div className="pay-bars">
                            {(salesStats?.payment_breakdown || []).map((s) => {
                              const max = Math.max(1, ...(salesStats?.payment_breakdown || []).map((x) => x.amount || 0));
                              const pct = ((s.amount || 0) / max) * 100;
                              return (
                                <div key={s.payment_type} className="pay-row">
                                  <span>{s.payment_type}</span>
                                  <div className="pay-track"><i style={{ width: `${pct}%` }} /></div>
                                  <strong>{formatMoney(s.amount)}</strong>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                        <div className="card">
                          <h4>{t.byHour}</h4>
                          <div className="vbars">
                            {(salesStats?.hourly || []).map((m) => {
                              const max = Math.max(1, ...(salesStats?.hourly || []).map((x) => x.amount || 0));
                              const h = Math.max(4, ((m.amount || 0) / max) * 140);
                              return (
                                <div key={m.hour} className="vbar-col">
                                  <div className="vbar" style={{ height: `${h}px` }} />
                                  <span>{m.hour}</span>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                      <div className="card">
                        <h4>{t.byWeekday}</h4>
                        <div className="vbars">
                          {(salesStats?.weekday || []).map((w) => {
                            const max = Math.max(1, ...(salesStats?.weekday || []).map((x) => x.amount || 0));
                            const h = Math.max(4, ((w.amount || 0) / max) * 160);
                            return (
                              <div key={w.weekday} className="vbar-col weekday">
                                <div className="vbar" style={{ height: `${h}px` }} />
                                <span>{weekdayLabel(w.weekday)}</span>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </>
                  )}
                  {reportsView === "checks" && (
                    <div className="checks-layout">
                      <form onSubmit={applyChecksFilter} className="sales-filter-row">
                        <div className="period-quick">
                          <button type="button" onClick={() => quickChecksPeriod(1)}>Сегодня</button>
                          <button type="button" onClick={() => quickChecksPeriod(7)}>7 дней</button>
                          <button type="button" onClick={() => quickChecksPeriod(30)}>30 дней</button>
                          <button type="button" onClick={() => quickChecksPeriod(90)}>90 дней</button>
                        </div>
                        <label>{t.from}</label>
                        <input type="datetime-local" value={checksFilter.from} onChange={(e) => setChecksFilter((s) => ({ ...s, from: e.target.value }))} required />
                        <label>{t.to}</label>
                        <input type="datetime-local" value={checksFilter.to} onChange={(e) => setChecksFilter((s) => ({ ...s, to: e.target.value }))} required />
                        <button type="submit">{t.applyFilter}</button>
                      </form>
                      <div className="kpi-grid">
                        <article className="kpi-card"><p>{t.totalSalesAmount}</p><strong>{formatMoney(checksSummary.totalSalesAmount)}</strong></article>
                        <article className="kpi-card"><p>{t.totalSalesCost}</p><strong>{formatMoney(checksSummary.totalSalesCost)}</strong></article>
                        <article className="kpi-card"><p>{t.totalPayments}</p><strong>{formatMoney(checksSummary.totalPayments)}</strong></article>
                        <article className="kpi-card"><p>{t.income}</p><strong>{formatMoney(checksSummary.income)}</strong></article>
                        <article className="kpi-card"><p>{t.totalSalesChecks}</p><strong>{checksSummary.totalSalesChecks}</strong></article>
                        <article className="kpi-card warning"><p>{t.totalReturnsAmount}</p><strong>{formatMoney(checksSummary.totalReturnsAmount)}</strong></article>
                        <article className="kpi-card warning"><p>{t.totalReturnsCost}</p><strong>{formatMoney(checksSummary.totalReturnsCost)}</strong></article>
                        <article className="kpi-card"><p>{t.returnedItems}</p><strong>{checksSummary.returnedItems}</strong></article>
                        <article className="kpi-card"><p>{t.expenseOut}</p><strong>{formatMoney(checksSummary.expenseOut)}</strong></article>
                        <article className="kpi-card"><p>{t.totalReturnChecks}</p><strong>{checksSummary.totalReturnChecks}</strong></article>
                      </div>
                      <div className="card table-scroll">
                        <table className="checks-table">
                          <thead>
                            <tr>
                              <th>ID</th>
                              <th>{t.type || "Type"}</th>
                              <th>Date</th>
                              <th>Cashier</th>
                              <th>{t.total}</th>
                              <th>Status</th>
                              <th>OFD</th>
                              <th></th>
                            </tr>
                          </thead>
                          <tbody>
                            {salesList.map((s) => (
                              <>
                                <tr key={`head-${s.id}`} title="Click arrow for details">
                                  <td>#{s.id}</td>
                                  <td>{s.total_amount >= 0 ? "Sold" : "Return"}</td>
                                  <td>{new Date(s.created_at).toLocaleString()}</td>
                                  <td>{s.cashier_name}</td>
                                  <td>{formatMoney(s.total_amount)}</td>
                                  <td><span className="badge-ok">Done</span></td>
                                  <td>{s.payment_type}</td>
                                  <td>
                                    <button
                                      type="button"
                                      className={`arrow-toggle ${expandedCheckId === s.id ? "open" : ""}`}
                                      onClick={() => setExpandedCheckId((v) => (v === s.id ? null : s.id))}
                                    >
                                      ▸
                                    </button>
                                  </td>
                                </tr>
                                <tr key={`body-${s.id}`} className="expand-row">
                                  <td colSpan="8">
                                    <div className={`expand-content ${expandedCheckId === s.id ? "open" : ""}`}>
                                      <div className="check-detail-grid">
                                        <div className="receipt-paper">
                                          <div className="receipt-head">
                                            <strong>OKAPOS MARKET</strong>
                                            <p>TIN: 309876543</p>
                                            <p>Kassa: #{s.id}</p>
                                            <p>{new Date(s.created_at).toLocaleString()}</p>
                                          </div>
                                          <h4>{t.products}</h4>
                                          <div className="table-scroll">
                                            <table>
                                              <thead><tr><th>ID</th><th>{t.qty}</th><th>{t.price}</th><th>{t.line}</th></tr></thead>
                                              <tbody>
                                                {s.items.map((i, idx) => (
                                                  <tr key={`${s.id}-${idx}`}>
                                                    <td>#{i.product_id}</td>
                                                    <td>{i.qty}</td>
                                                    <td>{formatMoney(i.price)}</td>
                                                    <td>{formatMoney(i.line_total)}</td>
                                                  </tr>
                                                ))}
                                              </tbody>
                                            </table>
                                          </div>
                                        </div>
                                        <div className="receipt-paper check-detail-meta">
                                          <h4>Доп. данные</h4>
                                          <div className="receipt-summary">
                                            <p><span>Status</span><span className="badge-ok">Yakunlangan</span></p>
                                            <p><span>To'lov turi</span><span>{s.payment_type}</span></p>
                                            <p><span>Kassir</span><span>{s.cashier_name}</span></p>
                                            <p><span>Check turi</span><span>{s.total_amount >= 0 ? "Sotilgan" : "Qaytarish"}</span></p>
                                            <p><span>FISKAL SIGN</span><span>FS-{s.id}924</span></p>
                                            <p><span>Yaratilgan sana</span><span>{new Date(s.created_at).toLocaleString()}</span></p>
                                            <h4>{t.total}: {formatMoney(s.total_amount)}</h4>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </td>
                                </tr>
                              </>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}
                  {reportsView === "shift" && (
                    <div className="grid">
                      <form onSubmit={applyShiftFilter} className="sales-filter-row">
                        <label>{t.from}</label>
                        <input type="datetime-local" value={shiftFilter.from} onChange={(e) => setShiftFilter((s) => ({ ...s, from: e.target.value }))} required />
                        <label>{t.to}</label>
                        <input type="datetime-local" value={shiftFilter.to} onChange={(e) => setShiftFilter((s) => ({ ...s, to: e.target.value }))} required />
                        <button type="submit">{t.applyFilter}</button>
                      </form>
                      <div className="card table-scroll">
                        <table>
                          <thead>
                            <tr>
                              <th>#</th>
                              <th>ID</th>
                              <th>Status</th>
                              <th>{t.openedAt}</th>
                              <th>{t.closedAt}</th>
                              <th>{t.openedBy}</th>
                              <th>{t.posDevice}</th>
                              <th></th>
                            </tr>
                          </thead>
                          <tbody>
                            {visibleShifts.map((s, idx) => (
                              <>
                                <tr key={`shift-head-${s.id}`} className={expandedShiftId === s.id ? "selected-row" : ""}>
                                  <td>{idx + 1}</td>
                                  <td>#{s.id}</td>
                                  <td><span className={s.status === "open" ? "badge-ok" : "badge-closed"}>{s.status === "open" ? t.working : t.closed}</span></td>
                                  <td>{new Date(s.opened_at).toLocaleString()}</td>
                                  <td>{s.closed_at ? new Date(s.closed_at).toLocaleString() : "-"}</td>
                                  <td>{s.cashier_name}</td>
                                  <td>Kassa-{(s.id % 2) + 1}</td>
                                  <td>
                                    <button
                                      type="button"
                                      className={`arrow-toggle ${expandedShiftId === s.id ? "open" : ""}`}
                                      onClick={() => setExpandedShiftId((v) => (v === s.id ? null : s.id))}
                                    >
                                      ▸
                                    </button>
                                  </td>
                                </tr>
                                <tr key={`shift-body-${s.id}`} className="expand-row">
                                  <td colSpan="8">
                                    <div className={`expand-content ${expandedShiftId === s.id ? "open" : ""}`}>
                                      <div className="grid-2">
                                        <div className="card">
                                          <h4>{t.shiftInfo}</h4>
                                          <p>{t.working}: <strong>{s.status === "open" ? t.working : t.closed}</strong></p>
                                          <p>{t.openedAt}: <strong>{new Date(s.opened_at).toLocaleString()}</strong></p>
                                          <p>{t.closedAt}: <strong>{s.closed_at ? new Date(s.closed_at).toLocaleString() : "-"}</strong></p>
                                          <p>{t.openedBy}: <strong>{s.cashier_name}</strong></p>
                                          <p>{t.closedBy}: <strong>{s.cashier_name}</strong></p>
                                          <p>{t.posDevice}: <strong>Kassa-{(s.id % 2) + 1}</strong></p>
                                          <p>{t.total}: <strong>{formatMoney(shiftSalesFor(s).reduce((sum, x) => sum + Number(x.total_amount || 0), 0))}</strong></p>
                                        </div>
                                        <div className="card">
                                          <h4>{t.shiftSales}</h4>
                                          <div className="table-scroll">
                                            <table>
                                              <thead><tr><th>Type</th><th>{t.total}</th></tr></thead>
                                              <tbody>
                                                {["cash", "card", "mixed"].map((p) => {
                                                  const total = shiftSalesFor(s)
                                                    .filter((x) => x.payment_type === p)
                                                    .reduce((sum, x) => sum + Number(x.total_amount || 0), 0);
                                                  return <tr key={`${s.id}-${p}`}><td>{p}</td><td>{formatMoney(total)}</td></tr>;
                                                })}
                                              </tbody>
                                            </table>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </td>
                                </tr>
                              </>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}
                  {reportsView === "inventory" && (
                    <div className="grid">
                      <div className="kpi-grid">
                        <article className="kpi-card">
                          <p>{t.inventoryTotalSell}</p>
                          <strong>{formatMoney(inventorySummary.totalSell)}</strong>
                        </article>
                        <article className="kpi-card">
                          <p>{t.inventoryTotalCost}</p>
                          <strong>{formatMoney(inventorySummary.totalCost)}</strong>
                        </article>
                        <article className="kpi-card warning">
                          <p>{t.inventoryProfit}</p>
                          <strong>{formatMoney(inventorySummary.profit)}</strong>
                        </article>
                      </div>
                      <div className="card table-scroll">
                        <table>
                          <thead>
                            <tr>
                              <th>ID</th>
                              <th>{t.product}</th>
                              <th>ARTIKUL</th>
                              <th>CATEGORY</th>
                              <th>BARCODE</th>
                              <th>UNIT</th>
                              <th>{t.inventoryCurrentQty}</th>
                              <th>{t.inventoryCurrentAmount}</th>
                              <th>{t.inventoryIfSold}</th>
                            </tr>
                          </thead>
                          <tbody>
                            {inventoryRows.map((r) => (
                              <tr key={r.id}>
                                <td>{r.id}</td>
                                <td>{r.name}</td>
                                <td>{r.artikul || "-"}</td>
                                <td>{r.category || "-"}</td>
                                <td>{r.barcode || "-"}</td>
                                <td>{r.unit || "-"}</td>
                                <td>{r.qty}</td>
                                <td>{formatMoney(r.costAmount)}</td>
                                <td>{formatMoney(r.sellAmount)}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}
                  {reportsView === "history" && (
                    <div className="grid">
                      <form onSubmit={applyHistoryFilter} className="sales-filter-row">
                        <label>{t.from}</label>
                        <input
                          type="date"
                          value={historyFilter.from}
                          onChange={(e) => setHistoryFilter((s) => ({ ...s, from: e.target.value }))}
                          required
                        />
                        <label>{t.to}</label>
                        <input
                          type="date"
                          value={historyFilter.to}
                          onChange={(e) => setHistoryFilter((s) => ({ ...s, to: e.target.value }))}
                          required
                        />
                        <input
                          placeholder="Поиск товара"
                          value={historyFilter.search}
                          onChange={(e) => setHistoryFilter((s) => ({ ...s, search: e.target.value }))}
                        />
                        <select
                          value={historyFilter.category}
                          onChange={(e) => setHistoryFilter((s) => ({ ...s, category: e.target.value }))}
                        >
                          <option value="all">Все категории</option>
                          {historyCategories.map((cat) => (
                            <option key={cat} value={cat}>
                              {cat}
                            </option>
                          ))}
                        </select>
                        <button type="submit">{t.applyFilter}</button>
                      </form>

                      <div className="kpi-grid">
                        <article className="kpi-card"><p>Товаров</p><strong>{historySummary.products}</strong></article>
                        <article className="kpi-card"><p>Продано (кол-во)</p><strong>{historySummary.qty.toFixed(2)}</strong></article>
                        <article className="kpi-card"><p>Выручка</p><strong>{formatMoney(historySummary.revenue)}</strong></article>
                        <article className="kpi-card warning"><p>Скидка</p><strong>{formatMoney(historySummary.discount)}</strong></article>
                        <article className="kpi-card"><p>Средняя цена продажи</p><strong>{formatMoney(historySummary.avgPrice)}</strong></article>
                        <article className="kpi-card"><p>Прибыль</p><strong>{formatMoney(historySummary.profit)}</strong></article>
                      </div>

                      <div className="card table-scroll">
                        <table>
                          <thead>
                            <tr>
                              <th>ID</th>
                              <th>{t.product}</th>
                              <th>Категория</th>
                              <th>Ценник</th>
                              <th>Цена продажи</th>
                              <th>Скидка</th>
                              <th>{t.qty}</th>
                              <th>Сумма</th>
                              <th>Прибыль</th>
                            </tr>
                          </thead>
                          <tbody>
                            {historyRows.map((r) => {
                              const avgSalePrice = r.sold_qty ? r.sold_amount / r.sold_qty : 0;
                              return (
                                <tr key={r.product_id}>
                                  <td>{r.product_id}</td>
                                  <td>{r.product_name}</td>
                                  <td>{r.category}</td>
                                  <td>{formatMoney(r.list_price)}</td>
                                  <td>{formatMoney(avgSalePrice)}</td>
                                  <td>{formatMoney(r.discount_amount)}</td>
                                  <td>{r.sold_qty.toFixed(2)}</td>
                                  <td>{formatMoney(r.sold_amount)}</td>
                                  <td>{formatMoney(r.profit_amount)}</td>
                                </tr>
                              );
                            })}
                            {!historyRows.length && (
                              <tr>
                                <td colSpan="9" className="muted">Нет данных за выбранный период</td>
                              </tr>
                            )}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}
                  {reportsView !== "sales" && reportsView !== "checks" && reportsView !== "shift" && reportsView !== "inventory" && reportsView !== "history" && (
                    <div className="card">
                      <h4>{reportsView === "checks" ? t.checks : reportsView === "shift" ? t.shiftReport : reportsView === "inventory" ? t.inventoryEval : t.salesHistory}</h4>
                      <p className="muted">{t.report}: {t.salesReport}</p>
                    </div>
                  )}
                </div>
              )}

              {adminSection === "products" && (
                <div className="grid">
                  <div className="subtabs-grid products-subtabs-grid">
                    {[
                      { id: "products", label: t.menuProducts, icon: "⭐" },
                      { id: "categories", label: t.categories, icon: "🔺" },
                      { id: "top", label: t.topSales, icon: "🔲" },
                      { id: "weight", label: t.weightProducts, icon: "⚖️" },
                      { id: "labels", label: t.labelPrint, icon: "🖨️" },
                      { id: "serial", label: t.serialProducts, icon: "🔳" },
                    ].map((item) => (
                      <button
                        key={item.id}
                        type="button"
                        className={`subtab-btn ${productsView === item.id ? "active" : ""}`}
                        onClick={() => setProductsView(item.id)}
                      >
                        <span>{item.icon}</span>
                        {item.label}
                      </button>
                    ))}
                  </div>
                  {productsView === "products" ? (
                    <>
                      <div className="card products-head-card">
                        <h2 className="products-title">Mahsulotlar</h2>
                        <div className="products-toolbar">
                          <div className="products-search-wrap">
                            <span className="products-search-icon" aria-hidden="true">🔍</span>
                            <input
                              className="products-search-input"
                              placeholder="Qidiruv tizimi"
                              value={search}
                              onChange={(e) => setSearch(e.target.value)}
                            />
                          </div>
                          <button
                            type="button"
                            className="products-add-btn"
                            onClick={() => {
                              setEditingProductId(null);
                              setProductForm({ name: "", unit: "kg", barcode: "", category: "General", imageName: "", tariff: "", buy_price: 0, sell_price: 0, stock_qty: 0, min_stock: 0 });
                              setProductBarcodes([""]);
                              setShowProductModal(true);
                            }}
                          >
                            <span className="btn-label-full">+ Yangi mahsulot qo'shish</span>
                            <span className="btn-label-short">+ Yangi</span>
                          </button>
                        </div>
                      </div>
                      <div className="card">
                        <h4>{t.products}</h4>
                        <div className="table-scroll">
                          <table>
                            <thead><tr><th>ID</th><th>{t.product}</th><th>ARTIKUL</th><th>BARCODE</th><th>CATEGORY</th><th>Tannarxi</th><th>Marja %</th><th>{t.price}</th><th>{t.qty}</th><th>Amal</th></tr></thead>
                            <tbody>
                              {filteredProducts.map((p) => (
                                <tr key={p.id}>
                                  <td>{p.id}</td>
                                  <td
                                    className="editable-cell"
                                    onDoubleClick={(e) => startInlineEdit(p, "name", e)}
                                  >
                                    {p.name}
                                  </td>
                                  <td>{p.artikul || "-"}</td>
                                  <td>{p.barcode || "-"}</td>
                                  <td>{p.category || "-"}</td>
                                  <td
                                    className="editable-cell"
                                    onDoubleClick={(e) => startInlineEdit(p, "buy_price", e)}
                                  >
                                    {formatMoney(p.buy_price)}
                                  </td>
                                  <td>
                                    {Number(p.buy_price || 0) > 0
                                      ? (((Number(p.sell_price || 0) - Number(p.buy_price || 0)) / Number(p.buy_price || 0)) * 100).toFixed(1)
                                      : "0.0"}
                                  </td>
                                  <td
                                    className="editable-cell"
                                    onDoubleClick={(e) => startInlineEdit(p, "sell_price", e)}
                                  >
                                    {formatMoney(p.sell_price)}
                                  </td>
                                  <td>{p.stock_qty}</td>
                                  <td>
                                    <div className="product-actions">
                                      <button type="button" onClick={() => openProductEdit(p)} title="To'liq o'zgartirish">✏</button>
                                      <button type="button" onClick={() => removeProduct(p)} title="O'chirish">🗑</button>
                                    </div>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>

                      {showProductModal && (
                        <div className="form-modal-backdrop" onClick={() => setShowProductModal(false)}>
                          <div className="form-modal card" onClick={(e) => e.stopPropagation()}>
                            <div className="row">
                              <h4>{editingProductId ? "Mahsulotni tahrirlash" : "Yangi mahsulot yaratish"}</h4>
                              <button type="button" onClick={() => setShowProductModal(false)}>X</button>
                            </div>
                            <form onSubmit={createProduct} className="grid">
                              <label>Artikul</label>
                              <input value="Auto" disabled />

                              <label>Mahsulot nomi</label>
                              <input
                                value={productForm.name}
                                onChange={(e) => setProductForm((s) => ({ ...s, name: e.target.value }))}
                                required
                              />

                              <label>Kategoriya</label>
                              <div className="category-row">
                                <select
                                  className="category-select"
                                  value={productForm.category}
                                  onChange={(e) => setProductForm((s) => ({ ...s, category: e.target.value }))}
                                >
                                  {productCategories.map((cat) => (
                                    <option key={cat} value={cat}>{cat}</option>
                                  ))}
                                </select>
                                <button type="button" onClick={() => setShowCategoryModal(true)}>+ Kategoriya</button>
                              </div>

                              <label>Barkod</label>
                              <div className="barcode-row-list">
                                {productBarcodes.map((code, idx) => (
                                  <div key={`barcode-${idx}`} className="barcode-input-wrap">
                                    <input
                                      className="barcode-input"
                                      placeholder={`Barkod ${idx + 1}`}
                                      value={code}
                                      onChange={(e) =>
                                        setProductBarcodes((prev) =>
                                          prev.map((x, i) => (i === idx ? e.target.value : x))
                                        )
                                      }
                                    />
                                    {productBarcodes.length > 1 ? (
                                      <button
                                        type="button"
                                        className="barcode-remove-btn"
                                        onClick={() =>
                                          setProductBarcodes((prev) => prev.filter((_, i) => i !== idx))
                                        }
                                      >
                                        x
                                      </button>
                                    ) : null}
                                  </div>
                                ))}
                                <button type="button" className="barcode-add-btn" onClick={() => setProductBarcodes((prev) => [...prev, ""])}>
                                  + Barkod qo'shish
                                </button>
                              </div>

                              <label>Type</label>
                              <div className="type-image-row">
                                <select
                                  className="type-select-compact"
                                  value={productForm.unit}
                                  onChange={(e) => setProductForm((s) => ({ ...s, unit: e.target.value }))}
                                >
                                  <option value="kg">kg</option>
                                  <option value="pcs">dona</option>
                                </select>
                                <label className="file-picker-row">
                                  <span className="file-picker-btn">{t.chooseImage}</span>
                                  <span className="file-picker-name">{productForm.imageName || t.noFileChosen}</span>
                                  <input
                                    className="file-picker-input"
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => setProductForm((s) => ({ ...s, imageName: e.target.files?.[0]?.name || "" }))}
                                  />
                                </label>
                              </div>

                              <label>Tarif mahsulot haqida</label>
                              <textarea
                                rows={3}
                                value={productForm.tariff}
                                onChange={(e) => setProductForm((s) => ({ ...s, tariff: e.target.value }))}
                              />

                              {editingProductId ? (
                                <>
                                  <label>Sotuv narxi</label>
                                  <input
                                    type="number"
                                    step="0.01"
                                    min="0.01"
                                    value={productForm.sell_price}
                                    onChange={(e) => setProductForm((s) => ({ ...s, sell_price: e.target.value }))}
                                  />
                                  <label>Min qoldiq</label>
                                  <input
                                    type="number"
                                    step="0.01"
                                    value={productForm.min_stock}
                                    onChange={(e) => setProductForm((s) => ({ ...s, min_stock: e.target.value }))}
                                  />
                                </>
                              ) : null}

                              <button type="submit">{editingProductId ? t.save : t.createProduct}</button>
                            </form>
                          </div>
                        </div>
                      )}

                      {showCategoryModal && (
                        <div
                          className="form-modal-backdrop"
                          onClick={() => {
                            setShowCategoryModal(false);
                            setCategoryEditingName("");
                          }}
                        >
                          <div className="form-modal card" onClick={(e) => e.stopPropagation()}>
                            <div className="row">
                              <h4>{categoryEditingName ? "Kategoriyani tahrirlash" : "Kategoriya yaratish"}</h4>
                              <button
                                type="button"
                                onClick={() => {
                                  setShowCategoryModal(false);
                                  setCategoryEditingName("");
                                }}
                              >
                                X
                              </button>
                            </div>
                            <form onSubmit={createCategory} className="grid">
                              <label>Nomi</label>
                              <input
                                value={categoryForm.name}
                                onChange={(e) => setCategoryForm((s) => ({ ...s, name: e.target.value }))}
                                required
                              />

                              <label>Rasm</label>
                              <label className="file-picker-row">
                                <span className="file-picker-btn">{t.chooseImage}</span>
                                <span className="file-picker-name">{categoryForm.imageName || t.noFileChosen}</span>
                                <input
                                  className="file-picker-input"
                                  type="file"
                                  accept="image/*"
                                  onChange={(e) => setCategoryForm((s) => ({ ...s, imageName: e.target.files?.[0]?.name || "" }))}
                                />
                              </label>

                              <label>Tarif</label>
                              <textarea
                                rows={3}
                                value={categoryForm.tariff}
                                onChange={(e) => setCategoryForm((s) => ({ ...s, tariff: e.target.value }))}
                              />

                              <button type="submit">{categoryEditingName ? t.save : "Yaratish"}</button>
                            </form>
                          </div>
                        </div>
                      )}
                    </>
                  ) : productsView === "categories" ? (
                    <>
                      <div className="card products-head-card">
                        <h2 className="products-title">Kategoriyalar</h2>
                        <div className="products-toolbar">
                          <div className="products-search-wrap">
                            <span className="products-search-icon" aria-hidden="true">🔍</span>
                            <input
                              className="products-search-input"
                              placeholder="Qidirish..."
                              value={search}
                              onChange={(e) => setSearch(e.target.value)}
                            />
                          </div>
                          <button
                            type="button"
                            className="products-add-btn"
                            onClick={() => {
                              setCategoryEditingName("");
                              setCategoryForm({ name: "", imageName: "", tariff: "" });
                              setShowCategoryModal(true);
                            }}
                          >
                            <span className="btn-label-full">+ Yangi kategoriya</span>
                            <span className="btn-label-short">+ Yangi</span>
                          </button>
                        </div>
                      </div>
                      <div className="card">
                        <h4>{t.categories}</h4>
                        <div className="table-scroll categories-table-wrap">
                          <table className="categories-table">
                            <thead>
                              <tr>
                                <th>№</th>
                                <th>Kategoriya</th>
                                <th>Nomi</th>
                                <th>Ta'rif</th>
                                <th>Amallar</th>
                              </tr>
                            </thead>
                            <tbody>
                              {filteredCategoryRows.map((cat, idx) => (
                                <tr key={`${cat.name}-${idx}`}>
                                  <td>{cat.id}</td>
                                  <td className="category-image-cell">
                                    {cat.imageName ? <span className="category-thumb">🧺</span> : <span className="muted">-</span>}
                                  </td>
                                  <td
                                    className="editable-cell"
                                    onDoubleClick={(e) => startCategoryInlineEdit(cat, e)}
                                  >
                                    {cat.name}
                                  </td>
                                  <td>{cat.tariff || "-"}</td>
                                  <td>
                                    <div className="product-actions">
                                      <button
                                        type="button"
                                        onClick={() => {
                                          setCategoryEditingName(cat.name);
                                          setCategoryForm({ name: cat.name, imageName: cat.imageName || "", tariff: cat.tariff || "" });
                                          setShowCategoryModal(true);
                                        }}
                                        title="Tahrirlash"
                                      >
                                        ✏
                                      </button>
                                      <button type="button" onClick={() => removeCategory(cat)} title="O'chirish">🗑</button>
                                    </div>
                                  </td>
                                </tr>
                              ))}
                              {!filteredCategoryRows.length && (
                                <tr>
                                  <td colSpan="5" className="muted">Kategoriya topilmadi</td>
                                </tr>
                              )}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </>
                  ) : productsView === "top" ? (
                    <>
                      <div className="card products-head-card">
                        <h2 className="products-title">Kassa uchun kartochkalar</h2>
                        <div className="row">
                          <p className="muted">Sotuvchi uchun tez sotuv tugmalari (mahsulot/toifa) ni shu yerda sozlaysiz.</p>
                          <button
                            type="button"
                            onClick={() => {
                              setQuickTileTab("product");
                              setQuickTileSearch("");
                              setQuickTileValue("");
                              setShowQuickTileModal(true);
                            }}
                          >
                            + Qo'shish
                          </button>
                        </div>
                      </div>
                      <div className="card">
                        <div className="quick-tiles-grid">
                          {quickSaleTiles.map((tile) => (
                            <div
                              key={tile.id}
                              className={`quick-tile-card ${tile.type === "category" ? "is-category" : "is-product"}`}
                              draggable
                              onDragStart={() => setQuickTileDragId(tile.id)}
                              onDragOver={(e) => e.preventDefault()}
                              onDrop={() => {
                                reorderQuickTiles(quickTileDragId, tile.id);
                                setQuickTileDragId(null);
                              }}
                              onDragEnd={() => setQuickTileDragId(null)}
                            >
                              <button type="button" className="quick-tile-handle" title="Joyini almashtirish">⋮⋮</button>
                              <button
                                type="button"
                                className="quick-tile-remove"
                                onClick={() => removeQuickTile(tile.id)}
                                title="O'chirish"
                              >
                                ×
                              </button>
                              <strong>{tile.label}</strong>
                              <small>{tile.type === "category" ? "Toifa" : "Tovar"}</small>
                            </div>
                          ))}
                          <button
                            type="button"
                            className="quick-tile-add"
                            onClick={() => {
                              setQuickTileTab("product");
                              setQuickTileSearch("");
                              setQuickTileValue("");
                              setShowQuickTileModal(true);
                            }}
                          >
                            +
                          </button>
                        </div>
                      </div>

                      {showQuickTileModal && (
                        <div className="form-modal-backdrop" onClick={() => setShowQuickTileModal(false)}>
                          <div className="quick-tile-modal card" onClick={(e) => e.stopPropagation()}>
                            <div className="quick-tile-tabs">
                              <button
                                type="button"
                                className={quickTileTab === "product" ? "active" : ""}
                                onClick={() => {
                                  setQuickTileTab("product");
                                  setQuickTileValue("");
                                }}
                              >
                                Tovar
                              </button>
                              <button
                                type="button"
                                className={quickTileTab === "category" ? "active" : ""}
                                onClick={() => {
                                  setQuickTileTab("category");
                                  setQuickTileValue("");
                                }}
                              >
                                Toifa
                              </button>
                            </div>
                            <input
                              placeholder="Qidirish..."
                              value={quickTileSearch}
                              onChange={(e) => setQuickTileSearch(e.target.value)}
                            />
                            <select
                              value={quickTileValue}
                              onChange={(e) => setQuickTileValue(e.target.value)}
                            >
                              <option value="">Tanlang...</option>
                              {(quickTileTab === "product"
                                ? products
                                    .filter((p) => String(p.name || "").toLowerCase().includes(quickTileSearch.toLowerCase()))
                                    .map((p) => ({ value: String(p.id), label: `${p.name} (${Math.round(Number(p.sell_price || 0))})` }))
                                : productCategories
                                    .filter((c) => String(c).toLowerCase().includes(quickTileSearch.toLowerCase()))
                                    .map((c) => ({ value: c, label: c }))
                              ).map((item) => (
                                <option key={item.value} value={item.value}>{item.label}</option>
                              ))}
                            </select>
                            <button type="button" onClick={addQuickTile} disabled={!quickTileValue}>
                              Saqlash
                            </button>
                          </div>
                        </div>
                      )}
                    </>
                  ) : productsView === "labels" ? (
                    <>
                      <div className="card products-head-card">
                        <div className="weight-toolbar">
                          <div className="products-search-wrap">
                            <span className="products-search-icon" aria-hidden="true">🔍</span>
                            <input
                              className="products-search-input"
                              placeholder="Qidirish..."
                              value={labelPrintSearch}
                              onChange={(e) => setLabelPrintSearch(e.target.value)}
                            />
                          </div>
                          <select
                            className="weight-scale-select"
                            value={activeLabelTemplateId}
                            onChange={(e) => setActiveLabelTemplateId(e.target.value)}
                          >
                            {labelTemplates.map((tpl) => (
                              <option key={tpl.id} value={tpl.id}>{tpl.name}</option>
                            ))}
                          </select>
                          <input
                            type="number"
                            min="1"
                            value={labelPrintRowsPerLine}
                            onChange={(e) => setLabelPrintRowsPerLine(Math.max(1, Number(e.target.value || 1)))}
                            style={{ width: 80 }}
                            title="Bir qatorda"
                          />
                          <button type="button" onClick={() => setLabelPrintQty({})}>Tozalash</button>
                          <button type="button" onClick={() => setShowLabelPrintPreview(true)}>🖨 Tayyor</button>
                        </div>
                      </div>
                      <div className="card table-scroll">
                        <table>
                          <thead>
                            <tr>
                              <th>№</th>
                              <th>Nomi</th>
                              <th>Narxi</th>
                              <th>Barkod</th>
                              <th>SKU</th>
                              <th>Soni</th>
                              <th>O'chirish</th>
                            </tr>
                          </thead>
                          <tbody>
                            {labelPrintProducts.map((p, idx) => (
                              <tr key={`lp-${p.id}`}>
                                <td>{idx + 1}</td>
                                <td>{p.name}</td>
                                <td>{Math.round(Number(p.sell_price || 0)).toLocaleString("ru-RU")}</td>
                                <td>{p.barcode || "-"}</td>
                                <td>{p.artikul || "-"}</td>
                                <td>
                                  <input
                                    type="number"
                                    min="0"
                                    step="1"
                                    value={labelPrintQty[p.id] ?? 0}
                                    onChange={(e) =>
                                      setLabelPrintQty((prev) => ({
                                        ...prev,
                                        [p.id]: Math.max(0, Number(e.target.value || 0)),
                                      }))
                                    }
                                    style={{ width: 72 }}
                                  />
                                </td>
                                <td>
                                  <button
                                    type="button"
                                    onClick={() => setLabelPrintQty((prev) => ({ ...prev, [p.id]: 0 }))}
                                  >
                                    🗑
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </>
                  ) : productsView === "weight" ? (
                    <>
                      <div className="card products-head-card">
                        <div className="weight-toolbar">
                          <div className="products-search-wrap">
                            <span className="products-search-icon" aria-hidden="true">🔍</span>
                            <input
                              className="products-search-input"
                              placeholder="Qidirish..."
                              value={weightSearch}
                              onChange={(e) => setWeightSearch(e.target.value)}
                            />
                          </div>
                          <select
                            className="weight-scale-select"
                            value={scaleName}
                            onChange={(e) => setScaleName(e.target.value)}
                          >
                            <option value="IFTIQOR 80">IFTIQOR 80</option>
                            <option value="QASHQAR 20">QASHQAR 20</option>
                            <option value="SCALE">SCALE</option>
                          </select>
                          <button type="button" onClick={exportWeightProducts}>Eksport</button>
                          <button type="button" onClick={uploadScaleText}>Yuklash</button>
                        </div>
                      </div>
                      <div className="card table-scroll">
                        <table>
                          <thead>
                            <tr>
                              <th>№</th>
                              <th>Tarozi kodi</th>
                              <th>Nomi</th>
                              <th>Toifa</th>
                              <th>Narxi</th>
                            </tr>
                          </thead>
                          <tbody>
                            {weightProducts.map((p, idx) => (
                              <tr key={`w-${p.id}-${idx}`}>
                                <td>{idx + 1}</td>
                                <td>{p.artikul || p.id}</td>
                                <td>{p.name}</td>
                                <td>{p.category || "-"}</td>
                                <td>{Math.round(Number(p.sell_price || 0)).toLocaleString("ru-RU")}</td>
                              </tr>
                            ))}
                            {!weightProducts.length && (
                              <tr>
                                <td colSpan="5" className="muted">kg tovarlar topilmadi</td>
                              </tr>
                            )}
                          </tbody>
                        </table>
                      </div>
                    </>
                  ) : (
                    <div className="card">
                      <h4>{t.productsMenu}</h4>
                      <p className="muted">Этот раздел в доработке</p>
                    </div>
                  )}
                </div>
              )}

              {categoryQuickEdit && (
                <div className="category-quick-backdrop">
                  <div
                    ref={categoryQuickPopoverRef}
                    className="category-quick-modal card"
                    style={{ top: `${categoryQuickEdit.top}px`, left: `${categoryQuickEdit.left}px` }}
                  >
                    <input
                      autoFocus
                      value={categoryQuickEdit.value}
                      onChange={(e) => setCategoryQuickEdit((s) => ({ ...s, value: e.target.value }))}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") commitCategoryInlineEdit();
                        if (e.key === "Escape") setCategoryQuickEdit(null);
                      }}
                    />
                    <div className="center-warning-actions">
                      <button type="button" onClick={() => setCategoryQuickEdit(null)}>Bekor qilish</button>
                      <button type="button" onClick={() => commitCategoryInlineEdit()}>Saqlash</button>
                    </div>
                  </div>
                </div>
              )}

              {inlineEdit && (
                <div className="category-quick-backdrop">
                  <div
                    ref={productQuickPopoverRef}
                    className="product-quick-modal card"
                    style={{ top: `${inlineEdit.top}px`, left: `${inlineEdit.left}px` }}
                  >
                    <input
                      autoFocus
                      type={inlineEdit.field === "name" ? "text" : "text"}
                      inputMode={inlineEdit.field === "name" ? "text" : "decimal"}
                      value={inlineEdit.value}
                      onChange={(e) => setInlineEdit((s) => ({ ...s, value: e.target.value }))}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") commitInlineEdit();
                        if (e.key === "Escape") setInlineEdit(null);
                      }}
                    />
                    <div className="center-warning-actions">
                      <button type="button" onClick={() => setInlineEdit(null)}>Bekor qilish</button>
                      <button type="button" onClick={() => commitInlineEdit()}>Saqlash</button>
                    </div>
                  </div>
                </div>
              )}

              {showLabelTemplateEditor && labelTemplateDraft && (
                <div className="form-modal-backdrop" onClick={() => setShowLabelTemplateEditor(false)}>
                  <div className="label-editor-modal card" onClick={(e) => e.stopPropagation()}>
                    <div className="row">
                      <h4>{labelTemplates.some((x) => x.id === labelTemplateDraft.id) ? "Cennikni tahrirlash" : "Yangi cennik"}</h4>
                      <button type="button" onClick={saveLabelTemplate}>
                        {labelTemplates.some((x) => x.id === labelTemplateDraft.id) ? "Saqlash" : "Yaratish"}
                      </button>
                    </div>
                    <div className="label-editor-top">
                      <input value={labelTemplateDraft.name} onChange={(e) => setLabelTemplateDraft((s) => ({ ...s, name: e.target.value }))} />
                      <input type="number" value={labelTemplateDraft.width} onChange={(e) => setLabelTemplateDraft((s) => ({ ...s, width: Number(e.target.value || 0) }))} />
                      <input type="number" value={labelTemplateDraft.height} onChange={(e) => setLabelTemplateDraft((s) => ({ ...s, height: Number(e.target.value || 0) }))} />
                    </div>
                    <div className="label-editor-body">
                      <div className="label-editor-side">
                        <h5>Cennik elementlari</h5>
                        {[
                          ["name", "Nomi"],
                          ["price", "Narxi"],
                          ["artikul", "Artikul"],
                          ["barcode", "Barkod"],
                          ["logo", "Logo"],
                          ["custom1", "Maxsus matn"],
                          ["custom2", "Maxsus matn 2"],
                        ].map(([key, title]) => (
                          <label key={key}>
                            <input
                              type="checkbox"
                              checked={Boolean(labelTemplateDraft.show[key])}
                              onChange={(e) =>
                                setLabelTemplateDraft((s) => ({
                                  ...s,
                                  show: { ...s.show, [key]: e.target.checked },
                                }))
                              }
                            />
                            {" "}
                            {title}
                          </label>
                        ))}
                        <h5>Shrift sozlamalari</h5>
                        <label>O'lcham</label>
                        <input type="number" value={labelTemplateDraft.font.size} onChange={(e) => setLabelTemplateDraft((s) => ({ ...s, font: { ...s.font, size: Number(e.target.value || 12) } }))} />
                        <label>Qalinlik</label>
                        <select value={labelTemplateDraft.font.weight} onChange={(e) => setLabelTemplateDraft((s) => ({ ...s, font: { ...s.font, weight: Number(e.target.value) } }))}>
                          <option value="300">300</option>
                          <option value="500">500</option>
                          <option value="700">700</option>
                          <option value="800">800</option>
                        </select>
                        <label>Joylashuv</label>
                        <select value={labelTemplateDraft.font.align} onChange={(e) => setLabelTemplateDraft((s) => ({ ...s, font: { ...s.font, align: e.target.value } }))}>
                          <option value="left">Chap</option>
                          <option value="center">Markaz</option>
                          <option value="right">O'ng</option>
                        </select>
                        <label>Taxminiy matn</label>
                        <input value={labelTemplateDraft.font.sampleText} onChange={(e) => setLabelTemplateDraft((s) => ({ ...s, font: { ...s.font, sampleText: e.target.value } }))} />
                      </div>
                      <div className="label-editor-preview-wrap">
                        <div className="label-editor-canvas">
                          <div
                            ref={labelPreviewRef}
                            className="label-preview-box"
                            style={{
                              width: `${Math.max(120, Number(labelTemplateDraft.width || 58) * 4)}px`,
                              minHeight: `${Math.max(80, Number(labelTemplateDraft.height || 40) * 4)}px`,
                            }}
                          >
                            {labelTemplateDraft.show.name ? (
                              <strong
                                className="label-preview-item draggable"
                                style={{
                                  left: `${labelTemplateDraft?.font?.positions?.name?.x ?? 8}px`,
                                  top: `${labelTemplateDraft?.font?.positions?.name?.y ?? 8}px`,
                                  fontWeight: labelTemplateDraft.font.weight,
                                  textAlign: labelTemplateDraft.font.align,
                                }}
                                onPointerDown={(e) => {
                                  const rect = e.currentTarget.getBoundingClientRect();
                                  setLabelDragState({
                                    key: "name",
                                    offsetX: e.clientX - rect.left,
                                    offsetY: e.clientY - rect.top,
                                  });
                                }}
                              >
                                Kungaboqar yog'i / laska
                              </strong>
                            ) : null}
                            {labelTemplateDraft.show.price ? (
                              <b
                                className="label-preview-item draggable"
                                style={{
                                  left: `${labelTemplateDraft?.font?.positions?.price?.x ?? 8}px`,
                                  top: `${labelTemplateDraft?.font?.positions?.price?.y ?? 42}px`,
                                  fontSize: `${labelTemplateDraft.font.size}px`,
                                  fontWeight: labelTemplateDraft.font.weight,
                                  textAlign: labelTemplateDraft.font.align,
                                }}
                                onPointerDown={(e) => {
                                  const rect = e.currentTarget.getBoundingClientRect();
                                  setLabelDragState({
                                    key: "price",
                                    offsetX: e.clientX - rect.left,
                                    offsetY: e.clientY - rect.top,
                                  });
                                }}
                              >
                                {labelTemplateDraft.font.sampleText}
                              </b>
                            ) : null}
                            {labelTemplateDraft.show.barcode ? (
                              <span
                                className="label-preview-item draggable mono"
                                style={{
                                  left: `${labelTemplateDraft?.font?.positions?.barcode?.x ?? 8}px`,
                                  top: `${labelTemplateDraft?.font?.positions?.barcode?.y ?? 94}px`,
                                }}
                                onPointerDown={(e) => {
                                  const rect = e.currentTarget.getBoundingClientRect();
                                  setLabelDragState({
                                    key: "barcode",
                                    offsetX: e.clientX - rect.left,
                                    offsetY: e.clientY - rect.top,
                                  });
                                }}
                              >
                                ||||||||||||
                              </span>
                            ) : null}
                            {labelTemplateDraft.show.artikul ? (
                              <small
                                className="label-preview-item draggable"
                                style={{
                                  left: `${labelTemplateDraft?.font?.positions?.artikul?.x ?? 184}px`,
                                  top: `${labelTemplateDraft?.font?.positions?.artikul?.y ?? 96}px`,
                                }}
                                onPointerDown={(e) => {
                                  const rect = e.currentTarget.getBoundingClientRect();
                                  setLabelDragState({
                                    key: "artikul",
                                    offsetX: e.clientX - rect.left,
                                    offsetY: e.clientY - rect.top,
                                  });
                                }}
                              >
                                182301
                              </small>
                            ) : null}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {showLabelPrintPreview && (
                <div className="form-modal-backdrop" onClick={() => setShowLabelPrintPreview(false)}>
                  <div className="label-print-modal card" onClick={(e) => e.stopPropagation()}>
                    <div className="row">
                      <button type="button" onClick={() => window.print()}>🖨</button>
                      <button type="button" onClick={() => setShowLabelPrintPreview(false)}>X</button>
                    </div>
                    <div className="label-print-sheet" style={{ gridTemplateColumns: `repeat(${Math.max(1, Number(labelPrintRowsPerLine || 1))}, minmax(120px, 1fr))` }}>
                      {labelPrintSelectedRows.flatMap((row) =>
                        Array.from({ length: row.qty }).map((_, i) => (
                          <div key={`print-${row.product.id}-${i}`} className="label-print-item">
                            {activeLabelTemplate?.show?.name ? <strong>{row.product.name}</strong> : null}
                            {activeLabelTemplate?.show?.price ? <b>{Math.round(Number(row.product.sell_price || 0)).toLocaleString("ru-RU")}</b> : null}
                            {activeLabelTemplate?.show?.barcode ? <span>||||||||||||</span> : null}
                            {activeLabelTemplate?.show?.artikul ? <small>{row.product.artikul || row.product.id}</small> : null}
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </div>
              )}

              {adminSection === "warehouse" && (
                <div className="grid-2">
                  <div className="card">
                    <h3>{t.createProduct}</h3>
                    <form onSubmit={createProduct} className="grid">
                      <input placeholder="Name" value={productForm.name} onChange={(e) => setProductForm((s) => ({ ...s, name: e.target.value }))} required />
                      <input placeholder="BARCODE (optional)" value={productForm.barcode} onChange={(e) => setProductForm((s) => ({ ...s, barcode: e.target.value }))} />
                      <input placeholder="CATEGORY" value={productForm.category} onChange={(e) => setProductForm((s) => ({ ...s, category: e.target.value }))} />
                      <select value={productForm.unit} onChange={(e) => setProductForm((s) => ({ ...s, unit: e.target.value }))}>
                        <option value="kg">kg</option>
                        <option value="pcs">pcs</option>
                      </select>
                      <input type="number" step="0.01" placeholder="Buy price" value={productForm.buy_price} onChange={(e) => setProductForm((s) => ({ ...s, buy_price: e.target.value }))} />
                      <input type="number" step="0.01" placeholder="Sell price" value={productForm.sell_price} onChange={(e) => setProductForm((s) => ({ ...s, sell_price: e.target.value }))} required />
                      <input type="number" step="0.01" placeholder="Stock" value={productForm.stock_qty} onChange={(e) => setProductForm((s) => ({ ...s, stock_qty: e.target.value }))} />
                      <input type="number" step="0.01" placeholder="Min stock" value={productForm.min_stock} onChange={(e) => setProductForm((s) => ({ ...s, min_stock: e.target.value }))} />
                      <button type="submit">{t.save}</button>
                    </form>
                  </div>
                  <div className="card">
                    <h3>{t.adjustStock}</h3>
                    <form onSubmit={adjustStock} className="grid">
                      <select value={stockForm.product_id} onChange={(e) => setStockForm((s) => ({ ...s, product_id: e.target.value }))}>
                        <option value="">{t.selectProduct}</option>
                        {products.map((p) => (
                          <option key={p.id} value={p.id}>{p.name}</option>
                        ))}
                      </select>
                      <input type="number" step="0.01" value={stockForm.qty_delta} onChange={(e) => setStockForm((s) => ({ ...s, qty_delta: e.target.value }))} />
                      <select value={stockForm.reason} onChange={(e) => setStockForm((s) => ({ ...s, reason: e.target.value }))}>
                        <option value="adjustment">{t.adjustment}</option>
                        <option value="incoming">{t.incoming}</option>
                        <option value="writeoff">{t.writeoff}</option>
                        <option value="sale">{t.saleOp}</option>
                      </select>
                      <input placeholder={t.note} value={stockForm.note} onChange={(e) => setStockForm((s) => ({ ...s, note: e.target.value }))} />
                      <button type="submit">{t.apply}</button>
                    </form>
                    <h3>{t.products}</h3>
                    <div className="table-scroll">
                      <table>
                        <thead><tr><th>ID</th><th>Name</th><th>ARTIKUL</th><th>BARCODE</th><th>CATEGORY</th><th>Price</th><th>Stock</th></tr></thead>
                        <tbody>
                          {products.map((p) => (
                            <tr key={p.id}>
                              <td>{p.id}</td><td>{p.name}</td><td>{p.artikul || "-"}</td><td>{p.barcode || "-"}</td><td>{p.category || "-"}</td><td>{p.sell_price}</td><td>{p.stock_qty}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  {!!lowStockProducts.length && (
                    <div className="stock-alert-list">
                      {lowStockProducts.slice(0, 6).map((p) => (
                        <span key={p.id} className="stock-alert-chip">{p.name}: {p.stock_qty}</span>
                      ))}
                    </div>
                  )}
                  </div>
                </div>
              )}

              {adminSection === "finance" && (
                <div className="grid">
                  <div className="subtabs-head">Moliya</div>
                  <div className="subtabs-grid">
                    <button type="button" className={`subtab-btn ${financeView === "supplier-payments" ? "active" : ""}`} onClick={() => setFinanceView("supplier-payments")}>
                      <span>💳</span>{t.supplierPayment}
                    </button>
                    <button type="button" className={`subtab-btn ${financeView === "supplier-report" ? "active" : ""}`} onClick={() => setFinanceView("supplier-report")}>
                      <span>📄</span>{t.supplierReport}
                    </button>
                  </div>
                  {financeView === "supplier-payments" && (
                  <div className="grid-2">
                    <div className="card">
                      <h4>{t.createSupplier}</h4>
                      <form onSubmit={handleCreateSupplier} className="grid">
                        <input placeholder={t.supplier} value={supplierForm.name} onChange={(e) => setSupplierForm((s) => ({ ...s, name: e.target.value }))} required />
                        <input placeholder="Phone" value={supplierForm.phone} onChange={(e) => setSupplierForm((s) => ({ ...s, phone: e.target.value }))} />
                        <input placeholder="Address" value={supplierForm.address} onChange={(e) => setSupplierForm((s) => ({ ...s, address: e.target.value }))} />
                        <input placeholder={t.note} value={supplierForm.note} onChange={(e) => setSupplierForm((s) => ({ ...s, note: e.target.value }))} />
                        <button type="submit">{t.save}</button>
                      </form>
                    </div>
                    <div className="card">
                      <h4>{t.createPurchase}</h4>
                      <form onSubmit={handleCreatePurchase} className="grid">
                        <select value={purchaseForm.supplier_id} onChange={(e) => setPurchaseForm((s) => ({ ...s, supplier_id: e.target.value }))} required>
                          <option value="">{t.supplier}</option>
                          {suppliers.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
                        </select>
                        <select value={purchaseForm.product_id} onChange={(e) => setPurchaseForm((s) => ({ ...s, product_id: e.target.value }))} required>
                          <option value="">{t.selectProduct}</option>
                          {products.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
                        </select>
                        <input type="number" step="0.01" placeholder={t.qty} value={purchaseForm.qty} onChange={(e) => setPurchaseForm((s) => ({ ...s, qty: e.target.value }))} required />
                        <input type="number" step="0.01" placeholder="Buy price" value={purchaseForm.buy_price} onChange={(e) => setPurchaseForm((s) => ({ ...s, buy_price: e.target.value }))} required />
                        <input placeholder={t.createdBy} value={purchaseForm.created_by} onChange={(e) => setPurchaseForm((s) => ({ ...s, created_by: e.target.value }))} />
                        <button type="submit">{t.createPurchase}</button>
                      </form>
                    </div>
                  </div>
                  )}
                  <h4>{t.purchases}</h4>
                  <div className="table-scroll">
                    <table>
                      <thead><tr><th>ID</th><th>{t.supplier}</th><th>{t.total}</th><th>{t.createdBy}</th></tr></thead>
                      <tbody>
                        {purchases.map((p) => (
                          <tr key={p.id}>
                            <td>#{p.id}</td>
                            <td>{p.supplier_name}</td>
                            <td>{formatMoney(p.total_amount)}</td>
                            <td>{p.created_by}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {adminSection === "staff" && (
                <div className="grid">
                  <div className="subtabs-head">{t.staffMenu}</div>
                  <div className="grid-2">
                    <div className="card">
                      <h4>{t.shift}</h4>
                      {!currentShift ? (
                        <form onSubmit={handleOpenShift} className="grid">
                          <input value={shiftOpenForm.cashier_name} onChange={(e) => setShiftOpenForm((s) => ({ ...s, cashier_name: e.target.value }))} required />
                          <input type="number" step="0.01" placeholder={t.openingCash} value={shiftOpenForm.opening_cash} onChange={(e) => setShiftOpenForm((s) => ({ ...s, opening_cash: e.target.value }))} />
                          <button type="submit">{t.openShift}</button>
                        </form>
                      ) : (
                        <form onSubmit={handleCloseShift} className="grid">
                          <p>{t.shift}: #{currentShift.id} / {currentShift.cashier_name}</p>
                          <input type="number" step="0.01" placeholder={t.closingCash} value={shiftCloseForm.closing_cash} onChange={(e) => setShiftCloseForm((s) => ({ ...s, closing_cash: e.target.value }))} />
                          <input placeholder={t.note} value={shiftCloseForm.note} onChange={(e) => setShiftCloseForm((s) => ({ ...s, note: e.target.value }))} />
                          <button type="submit">{t.closeShift}</button>
                        </form>
                      )}
                    </div>
                    <div className="card">
                      <h4>{t.createExpense}</h4>
                      <form onSubmit={handleCreateExpense} className="grid">
                        <input placeholder={t.expense} value={expenseForm.title} onChange={(e) => setExpenseForm((s) => ({ ...s, title: e.target.value }))} required />
                        <input type="number" step="0.01" placeholder={t.amount} value={expenseForm.amount} onChange={(e) => setExpenseForm((s) => ({ ...s, amount: e.target.value }))} required />
                        <input placeholder={t.category} value={expenseForm.category} onChange={(e) => setExpenseForm((s) => ({ ...s, category: e.target.value }))} />
                        <input placeholder={t.createdBy} value={expenseForm.created_by} onChange={(e) => setExpenseForm((s) => ({ ...s, created_by: e.target.value }))} />
                        <button type="submit">{t.save}</button>
                      </form>
                    </div>
                  </div>
                  <div className="table-scroll">
                    <table>
                      <thead><tr><th>ID</th><th>{t.expense}</th><th>{t.amount}</th><th>{t.category}</th><th>{t.createdBy}</th></tr></thead>
                      <tbody>
                        {expenses.map((x) => (
                          <tr key={x.id}>
                            <td>{x.id}</td>
                            <td>{x.title}</td>
                            <td>{formatMoney(x.amount)}</td>
                            <td>{x.category}</td>
                            <td>{x.created_by}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {adminSection === "returns" && (
                <div className="grid">
                  <h3>{t.returns}</h3>
                  <form onSubmit={handleCreateReturn} className="grid-3">
                    <input type="number" placeholder={t.saleId} value={returnForm.sale_id} onChange={(e) => setReturnForm((s) => ({ ...s, sale_id: e.target.value }))} required />
                    <select value={returnForm.product_id} onChange={(e) => setReturnForm((s) => ({ ...s, product_id: e.target.value }))} required>
                      <option value="">{t.selectProduct}</option>
                      {products.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
                    </select>
                    <input type="number" step="0.01" placeholder={t.qty} value={returnForm.qty} onChange={(e) => setReturnForm((s) => ({ ...s, qty: e.target.value }))} required />
                    <input value={returnForm.cashier_name} onChange={(e) => setReturnForm((s) => ({ ...s, cashier_name: e.target.value }))} required />
                    <input placeholder={t.reason} value={returnForm.reason} onChange={(e) => setReturnForm((s) => ({ ...s, reason: e.target.value }))} />
                    <button type="submit">{t.createReturn}</button>
                  </form>
                  <div className="table-scroll">
                    <table>
                      <thead><tr><th>ID</th><th>{t.saleId}</th><th>{t.total}</th><th>{t.cashier}</th></tr></thead>
                      <tbody>
                        {returns.map((r) => (
                          <tr key={r.id}>
                            <td>#{r.id}</td>
                            <td>#{r.sale_id}</td>
                            <td>{formatMoney(r.total_amount)}</td>
                            <td>{r.cashier_name}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {adminSection === "audit" && (
                <div className="grid">
                  <h3>{t.auditLogs}</h3>
                  <div className="row">
                    <button type="button" onClick={handleBackup}>{t.makeBackup}</button>
                    <button type="button" onClick={() => window.open("http://localhost:8000/api/reports/export.xlsx", "_blank")}>{t.exportExcel}</button>
                    <button type="button" onClick={() => window.open("http://localhost:8000/api/reports/export.pdf", "_blank")}>{t.exportPdf}</button>
                  </div>
                  <div className="table-scroll">
                    <table>
                      <thead><tr><th>ID</th><th>{t.createdBy}</th><th>{t.action}</th><th>Entity</th><th>{t.note}</th></tr></thead>
                      <tbody>
                        {auditLogs.map((x) => (
                          <tr key={x.id}>
                            <td>{x.id}</td>
                            <td>{x.actor}</td>
                            <td>{x.action}</td>
                            <td>{x.entity}</td>
                            <td>{x.details}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {adminSection === "settings" && (
                <div className="grid">
                  <div className="settings-tiles">
                    <button type="button" className={`settings-tile ${settingsView === "general" ? "active" : ""}`} onClick={() => setSettingsView("general")}>Asosiy sozlamalar</button>
                    <button type="button" className={`settings-tile ${settingsView === "labels" ? "active" : ""}`} onClick={() => setSettingsView("labels")}>Narx belgilari</button>
                  </div>
                  {settingsView === "general" ? (
                    <div className="grid settings-grid">
                      <h3>{t.menuSettings}</h3>
                      <label>{t.theme}</label>
                      <div className="theme-picker">
                        <button
                          type="button"
                          className={`theme-btn ${theme === "light" ? "active" : ""}`}
                          onClick={() => setTheme("light")}
                          aria-label={t.light}
                        >
                          ☀️
                        </button>
                        <button
                          type="button"
                          className={`theme-btn ${theme === "dark" ? "active" : ""}`}
                          onClick={() => setTheme("dark")}
                          aria-label={t.dark}
                        >
                          🌙
                        </button>
                      </div>
                      <label>Language</label>
                      <select value={lang} onChange={(e) => setLang(e.target.value)}>
                        <option value="ru">🇷🇺 RU</option>
                        <option value="uz">🇺🇿 UZ</option>
                      </select>
                    </div>
                  ) : (
                    <div className="card">
                      <div className="row">
                        <h4>Narx belgilari</h4>
                        <button type="button" onClick={openCreateLabelTemplate}>Yaratish</button>
                      </div>
                      <div className="table-scroll">
                        <table>
                          <thead>
                            <tr><th>№</th><th>Ko'rinishi</th><th>Nomi</th><th>Amallar</th></tr>
                          </thead>
                          <tbody>
                            {labelTemplates.map((tpl, idx) => (
                              <tr key={tpl.id}>
                                <td>{idx + 1}</td>
                                <td>
                                  <div className="label-template-thumb">
                                    <strong style={{ fontSize: 10 }}>{tpl.show.name ? "Kungaboqar yog'i" : ""}</strong>
                                    <b style={{ fontSize: 16, fontWeight: tpl.font.weight }}>{tpl.show.price ? tpl.font.sampleText : ""}</b>
                                    <span style={{ fontSize: 10 }}>{tpl.show.barcode ? "|||||||||" : ""}</span>
                                  </div>
                                </td>
                                <td>{tpl.name}</td>
                                <td>
                                  <button type="button" onClick={() => openEditLabelTemplate(tpl)}>✏</button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </section>
      )}
      {warningModal.open && (
        <div
          className="center-warning-backdrop"
          onClick={() => setWarningModal({ open: false, title: "", message: "", confirmMode: false, onConfirm: null })}
        >
          <div className="center-warning-modal card" onClick={(e) => e.stopPropagation()}>
            <h4>{warningModal.title}</h4>
            <p>{warningModal.message}</p>
            <div className="center-warning-actions">
              {warningModal.confirmMode ? (
                <>
                  <button
                    type="button"
                    onClick={() => setWarningModal({ open: false, title: "", message: "", confirmMode: false, onConfirm: null })}
                  >
                    Bekor qilish
                  </button>
                  <button
                    type="button"
                    onClick={async () => {
                      const action = warningModal.onConfirm;
                      setWarningModal({ open: false, title: "", message: "", confirmMode: false, onConfirm: null });
                      if (action) await action();
                    }}
                  >
                    Tasdiqlash
                  </button>
                </>
              ) : (
                <button
                  type="button"
                  onClick={() => setWarningModal({ open: false, title: "", message: "", confirmMode: false, onConfirm: null })}
                >
                  Yopish
                </button>
              )}
            </div>
          </div>
        </div>
      )}
      {loading && <LoadingScreen text={t.loading} />}
    </main>
  );
}
