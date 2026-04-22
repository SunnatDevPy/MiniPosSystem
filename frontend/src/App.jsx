import { useEffect, useMemo, useState } from "react";
import { api } from "./api";

export default function App() {
  const [mode, setMode] = useState("cashier");
  const [products, setProducts] = useState([]);
  const [report, setReport] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const [productForm, setProductForm] = useState({
    name: "",
    sku: "",
    unit: "kg",
    buy_price: 0,
    sell_price: 0,
    stock_qty: 0,
    min_stock: 0,
  });
  const [stockForm, setStockForm] = useState({ product_id: "", qty_delta: 0 });
  const [saleForm, setSaleForm] = useState({
    cashier_name: "Cashier 1",
    payment_type: "cash",
    product_id: "",
    qty: 1,
  });
  const [cart, setCart] = useState([]);

  const selectedProduct = useMemo(() => products.find((p) => p.id === Number(saleForm.product_id)), [products, saleForm.product_id]);
  const lowStock = useMemo(() => products.filter((p) => p.stock_qty <= p.min_stock), [products]);
  const cartTotal = useMemo(
    () => cart.reduce((sum, item) => sum + item.qty * item.sell_price, 0),
    [cart]
  );

  async function refresh() {
    setLoading(true);
    setError("");
    try {
      const [items, daily] = await Promise.all([api.listProducts(), api.dailyReport()]);
      setProducts(items);
      setReport(daily);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    refresh();
  }, []);

  async function onCreateProduct(e) {
    e.preventDefault();
    try {
      await api.createProduct({
        ...productForm,
        buy_price: Number(productForm.buy_price),
        sell_price: Number(productForm.sell_price),
        stock_qty: Number(productForm.stock_qty),
        min_stock: Number(productForm.min_stock),
      });
      setProductForm({
        name: "",
        sku: "",
        unit: "kg",
        buy_price: 0,
        sell_price: 0,
        stock_qty: 0,
        min_stock: 0,
      });
      refresh();
    } catch (e) {
      setError(e.message);
    }
  }

  async function onAdjustStock(e) {
    e.preventDefault();
    try {
      await api.adjustStock({
        product_id: Number(stockForm.product_id),
        qty_delta: Number(stockForm.qty_delta),
      });
      setStockForm({ product_id: "", qty_delta: 0 });
      refresh();
    } catch (e) {
      setError(e.message);
    }
  }

  async function onCreateSale(e) {
    e.preventDefault();
    try {
      if (!cart.length) {
        throw new Error("Cart is empty");
      }
      await api.createSale({
        cashier_name: saleForm.cashier_name,
        payment_type: saleForm.payment_type,
        items: cart.map((item) => ({ product_id: item.id, qty: Number(item.qty) })),
      });
      setSaleForm((prev) => ({ ...prev, product_id: "", qty: 1 }));
      setCart([]);
      refresh();
    } catch (e) {
      setError(e.message);
    }
  }

  function addToCart() {
    if (!selectedProduct) return;
    const qty = Number(saleForm.qty);
    if (!qty || qty <= 0) {
      setError("Qty must be positive");
      return;
    }
    setError("");
    setCart((prev) => {
      const existing = prev.find((item) => item.id === selectedProduct.id);
      if (existing) {
        return prev.map((item) =>
          item.id === selectedProduct.id ? { ...item, qty: item.qty + qty } : item
        );
      }
      return [
        ...prev,
        {
          id: selectedProduct.id,
          name: selectedProduct.name,
          qty,
          unit: selectedProduct.unit,
          sell_price: selectedProduct.sell_price,
        },
      ];
    });
    setSaleForm((prev) => ({ ...prev, qty: 1 }));
  }

  function removeFromCart(productId) {
    setCart((prev) => prev.filter((item) => item.id !== productId));
  }

  return (
    <main style={{ fontFamily: "Arial, sans-serif", padding: 20, maxWidth: 1000, margin: "0 auto" }}>
      <h1>Mini POS - Fruits & Vegetables</h1>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {loading && <p>Loading...</p>}

      <section style={{ display: "flex", gap: 8, marginBottom: 12 }}>
        <button onClick={() => setMode("cashier")} disabled={mode === "cashier"}>
          Cashier
        </button>
        <button onClick={() => setMode("admin")} disabled={mode === "admin"}>
          Admin
        </button>
      </section>

      {mode === "admin" ? (
        <>
          <section>
            <h2>Daily Report</h2>
            {report && (
              <>
                <p>
                  Date: {report.date} | Sales: {report.sales_count} | Revenue: {report.revenue}
                </p>
                <p style={{ color: lowStock.length ? "#b45309" : "#15803d" }}>
                  Low stock positions: {lowStock.length}
                </p>
              </>
            )}
          </section>

          <section>
            <h2>Create Product</h2>
            <form onSubmit={onCreateProduct} style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 8 }}>
              <input placeholder="Name" value={productForm.name} onChange={(e) => setProductForm({ ...productForm, name: e.target.value })} required />
              <input placeholder="SKU" value={productForm.sku} onChange={(e) => setProductForm({ ...productForm, sku: e.target.value })} required />
              <select value={productForm.unit} onChange={(e) => setProductForm({ ...productForm, unit: e.target.value })}>
                <option value="kg">kg</option>
                <option value="pcs">pcs</option>
              </select>
              <input type="number" step="0.01" placeholder="Buy Price" value={productForm.buy_price} onChange={(e) => setProductForm({ ...productForm, buy_price: e.target.value })} />
              <input type="number" step="0.01" placeholder="Sell Price" value={productForm.sell_price} onChange={(e) => setProductForm({ ...productForm, sell_price: e.target.value })} required />
              <input type="number" step="0.01" placeholder="Stock Qty" value={productForm.stock_qty} onChange={(e) => setProductForm({ ...productForm, stock_qty: e.target.value })} />
              <input type="number" step="0.01" placeholder="Min Stock" value={productForm.min_stock} onChange={(e) => setProductForm({ ...productForm, min_stock: e.target.value })} />
              <button type="submit">Add Product</button>
            </form>
          </section>

          <section>
            <h2>Stock Adjust</h2>
            <form onSubmit={onAdjustStock} style={{ display: "flex", gap: 8 }}>
              <select value={stockForm.product_id} onChange={(e) => setStockForm({ ...stockForm, product_id: e.target.value })} required>
                <option value="">Select product</option>
                {products.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>
              <input type="number" step="0.01" value={stockForm.qty_delta} onChange={(e) => setStockForm({ ...stockForm, qty_delta: e.target.value })} />
              <button type="submit">Apply</button>
            </form>
          </section>
        </>
      ) : (
        <section>
          <h2>Cash Register</h2>
          <form onSubmit={onCreateSale} style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 10 }}>
            <input value={saleForm.cashier_name} onChange={(e) => setSaleForm({ ...saleForm, cashier_name: e.target.value })} />
            <select value={saleForm.payment_type} onChange={(e) => setSaleForm({ ...saleForm, payment_type: e.target.value })}>
              <option value="cash">cash</option>
              <option value="card">card</option>
              <option value="mixed">mixed</option>
            </select>
            <select value={saleForm.product_id} onChange={(e) => setSaleForm({ ...saleForm, product_id: e.target.value })}>
              <option value="">Select product</option>
              {products.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} ({p.sell_price})
                </option>
              ))}
            </select>
            <input type="number" step="0.01" value={saleForm.qty} onChange={(e) => setSaleForm({ ...saleForm, qty: e.target.value })} />
            <button type="button" onClick={addToCart}>
              Add to Cart
            </button>
            <button type="submit" disabled={!cart.length}>
              Sell
            </button>
          </form>

          {selectedProduct && <p>Current line: {(selectedProduct.sell_price * Number(saleForm.qty || 0)).toFixed(2)}</p>}

          <table width="100%" border="1" cellPadding="6" style={{ borderCollapse: "collapse" }}>
            <thead>
              <tr>
                <th>Product</th>
                <th>Qty</th>
                <th>Price</th>
                <th>Line Total</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {cart.map((item) => (
                <tr key={item.id}>
                  <td>{item.name}</td>
                  <td>
                    {item.qty} {item.unit}
                  </td>
                  <td>{item.sell_price}</td>
                  <td>{(item.qty * item.sell_price).toFixed(2)}</td>
                  <td>
                    <button type="button" onClick={() => removeFromCart(item.id)}>
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
              {!cart.length && (
                <tr>
                  <td colSpan="5">Cart is empty</td>
                </tr>
              )}
            </tbody>
          </table>
          <p>
            <strong>Cart Total: {cartTotal.toFixed(2)}</strong>
          </p>
        </section>
      )}

      <section>
        <h2>Products</h2>
        <table width="100%" border="1" cellPadding="6" style={{ borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>SKU</th>
              <th>Unit</th>
              <th>Sell Price</th>
              <th>Stock</th>
              <th>Min</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p.id} style={p.stock_qty <= p.min_stock ? { background: "#fef3c7" } : undefined}>
                <td>{p.id}</td>
                <td>{p.name}</td>
                <td>{p.sku}</td>
                <td>{p.unit}</td>
                <td>{p.sell_price}</td>
                <td>{p.stock_qty}</td>
                <td>{p.min_stock}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </main>
  );
}
