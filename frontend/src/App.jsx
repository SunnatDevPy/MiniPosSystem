import { useEffect, useMemo, useState } from "react";
import { api } from "./api";

export default function App() {
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

  const selectedProduct = useMemo(
    () => products.find((p) => p.id === Number(saleForm.product_id)),
    [products, saleForm.product_id]
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
      await api.createSale({
        cashier_name: saleForm.cashier_name,
        payment_type: saleForm.payment_type,
        items: [{ product_id: Number(saleForm.product_id), qty: Number(saleForm.qty) }],
      });
      setSaleForm((prev) => ({ ...prev, qty: 1 }));
      refresh();
    } catch (e) {
      setError(e.message);
    }
  }

  return (
    <main style={{ fontFamily: "Arial, sans-serif", padding: 20, maxWidth: 1000, margin: "0 auto" }}>
      <h1>Mini POS - Fruits & Vegetables</h1>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {loading && <p>Loading...</p>}

      <section>
        <h2>Daily Report</h2>
        {report && (
          <p>
            Date: {report.date} | Sales: {report.sales_count} | Revenue: {report.revenue}
          </p>
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

      <section>
        <h2>Cash Register (1 item sale)</h2>
        <form onSubmit={onCreateSale} style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          <input value={saleForm.cashier_name} onChange={(e) => setSaleForm({ ...saleForm, cashier_name: e.target.value })} />
          <select value={saleForm.payment_type} onChange={(e) => setSaleForm({ ...saleForm, payment_type: e.target.value })}>
            <option value="cash">cash</option>
            <option value="card">card</option>
            <option value="mixed">mixed</option>
          </select>
          <select value={saleForm.product_id} onChange={(e) => setSaleForm({ ...saleForm, product_id: e.target.value })} required>
            <option value="">Select product</option>
            {products.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name} ({p.sell_price})
              </option>
            ))}
          </select>
          <input type="number" step="0.01" value={saleForm.qty} onChange={(e) => setSaleForm({ ...saleForm, qty: e.target.value })} />
          <button type="submit">Sell</button>
          {selectedProduct && <strong>Total: {(selectedProduct.sell_price * Number(saleForm.qty || 0)).toFixed(2)}</strong>}
        </form>
      </section>

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
              <tr key={p.id}>
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
