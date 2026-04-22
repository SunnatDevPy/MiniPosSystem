import { useEffect, useMemo, useState } from "react";
import { api } from "./api";
import "./App.css";

const CREDENTIALS = {
  admin: "admin123",
  cashier: "cashier123",
};

const I18N = {
  ru: {
    title: "Mini POS Pro",
    login: "Вход",
    role: "Роль",
    password: "Пароль",
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
    search: "Поиск по названию или SKU",
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
  },
  uz: {
    title: "Mini POS Pro",
    login: "Kirish",
    role: "Rol",
    password: "Parol",
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
    search: "Nomi yoki SKU bo'yicha qidirish",
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
  },
};

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

export default function App() {
  const [lang, setLang] = useState("ru");
  const [theme, setTheme] = useState("dark");
  const [session, setSession] = useState(null);
  const [login, setLogin] = useState({ role: "cashier", password: "" });
  const [mode, setMode] = useState("cashier");
  const [products, setProducts] = useState([]);
  const [popular, setPopular] = useState([]);
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [returnMode, setReturnMode] = useState(false);
  const [saleForm, setSaleForm] = useState({ cashier_name: "Cashier 1", payment_type: "cash", product_id: "", qty: 1, discount: 0, markup: 0 });
  const [cart, setCart] = useState([]);
  const [shiftNumber, setShiftNumber] = useState(() => Number(localStorage.getItem("shiftNumber") || "1"));
  const [productForm, setProductForm] = useState({ name: "", sku: "", unit: "kg", buy_price: 0, sell_price: 0, stock_qty: 0, min_stock: 0 });
  const [stockForm, setStockForm] = useState({ product_id: "", qty_delta: 0 });

  const t = I18N[lang];

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  useEffect(() => {
    if (session) refresh();
  }, [session]);

  const filteredProducts = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return products;
    return products.filter((p) => p.name.toLowerCase().includes(q) || p.sku.toLowerCase().includes(q));
  }, [products, search]);

  const selectedProduct = useMemo(() => products.find((x) => x.id === Number(saleForm.product_id)), [products, saleForm.product_id]);
  const cartTotal = useMemo(() => cart.reduce((sum, x) => sum + x.lineTotal, 0), [cart]);

  async function refresh() {
    setLoading(true);
    setError("");
    try {
      const [items, daily, top] = await Promise.all([api.listProducts(), api.dailyReport(), api.popularProducts()]);
      setProducts(items);
      setReport(daily);
      setPopular(top);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  function handleLogin(e) {
    e.preventDefault();
    if (login.password !== CREDENTIALS[login.role]) {
      setError("Invalid password");
      return;
    }
    setSession({ role: login.role });
    setError("");
    setMode(login.role === "admin" ? "admin" : "cashier");
  }

  function addToCart(product = selectedProduct) {
    if (!product) return;
    const qtyBase = Number(saleForm.qty || 0);
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
      await api.createProduct({
        ...productForm,
        buy_price: Number(productForm.buy_price),
        sell_price: Number(productForm.sell_price),
        stock_qty: Number(productForm.stock_qty),
        min_stock: Number(productForm.min_stock),
      });
      setProductForm({ name: "", sku: "", unit: "kg", buy_price: 0, sell_price: 0, stock_qty: 0, min_stock: 0 });
      refresh();
    } catch (e) {
      setError(e.message);
    }
  }

  async function adjustStock(e) {
    e.preventDefault();
    try {
      await api.adjustStock({ product_id: Number(stockForm.product_id), qty_delta: Number(stockForm.qty_delta) });
      setStockForm({ product_id: "", qty_delta: 0 });
      refresh();
    } catch (e) {
      setError(e.message);
    }
  }

  if (!session) {
    return (
      <main className="app">
        <section className="card auth-card">
          <h1>{t.title}</h1>
          <h2>{t.login}</h2>
          {error && <p className="error">{error}</p>}
          <form onSubmit={handleLogin} className="grid">
            <label>{t.role}</label>
            <select value={login.role} onChange={(e) => setLogin((s) => ({ ...s, role: e.target.value }))}>
              <option value="cashier">{t.cashier}</option>
              <option value="admin">{t.admin}</option>
            </select>
            <label>{t.password}</label>
            <input type="password" value={login.password} onChange={(e) => setLogin((s) => ({ ...s, password: e.target.value }))} required />
            <button type="submit">{t.signIn}</button>
          </form>
        </section>
      </main>
    );
  }

  return (
    <main className="app">
      <header className="header">
        <h1>{t.title}</h1>
        <div className="row">
          <select value={lang} onChange={(e) => setLang(e.target.value)}>
            <option value="ru">RU</option>
            <option value="uz">UZ</option>
          </select>
          <select value={theme} onChange={(e) => setTheme(e.target.value)}>
            <option value="dark">{t.dark}</option>
            <option value="light">{t.light}</option>
          </select>
          {session.role === "admin" && (
            <div className="row">
              <button onClick={() => setMode("cashier")}>{t.modeCashier}</button>
              <button onClick={() => setMode("admin")}>{t.modeAdmin}</button>
            </div>
          )}
          <button onClick={() => setSession(null)}>{t.logout}</button>
        </div>
      </header>
      {loading && <p>{t.loading}</p>}
      {error && <p className="error">{error}</p>}

      {mode === "cashier" && (
        <section className="grid-2">
          <div className="card">
            <h2>{t.modeCashier}</h2>
            <p>{t.shift}: #{shiftNumber}</p>
            <input placeholder={t.search} value={search} onChange={(e) => setSearch(e.target.value)} />
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
        <section className="grid-2">
          <div className="card">
            <h2>{t.report}</h2>
            {report && <p>{report.date}: {report.sales_count} / {report.revenue}</p>}
            <h2>{t.createProduct}</h2>
            <form onSubmit={createProduct} className="grid">
              <input placeholder="Name" value={productForm.name} onChange={(e) => setProductForm((s) => ({ ...s, name: e.target.value }))} required />
              <input placeholder="SKU" value={productForm.sku} onChange={(e) => setProductForm((s) => ({ ...s, sku: e.target.value }))} required />
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
            <h2>{t.adjustStock}</h2>
            <form onSubmit={adjustStock} className="grid">
              <select value={stockForm.product_id} onChange={(e) => setStockForm((s) => ({ ...s, product_id: e.target.value }))}>
                <option value="">{t.selectProduct}</option>
                {products.map((p) => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
              <input type="number" step="0.01" value={stockForm.qty_delta} onChange={(e) => setStockForm((s) => ({ ...s, qty_delta: e.target.value }))} />
              <button type="submit">{t.apply}</button>
            </form>
            <h2>{t.products}</h2>
            <div className="table-scroll">
              <table>
                <thead><tr><th>ID</th><th>Name</th><th>SKU</th><th>Price</th><th>Stock</th></tr></thead>
                <tbody>
                  {products.map((p) => (
                    <tr key={p.id}>
                      <td>{p.id}</td><td>{p.name}</td><td>{p.sku}</td><td>{p.sell_price}</td><td>{p.stock_qty}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      )}
    </main>
  );
}
