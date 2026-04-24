export default function CashierSection({
  t,
  shiftNumber,
  products,
  cart,
  cartTotal,
  formatMoney,
  search,
  setSearch,
  syncOfflineCacheNow,
  session,
  setProductsView,
  setMode,
  setAdminSection,
  syncNote,
  activeQuickCategory,
  setActiveQuickCategory,
  quickCategoryTiles,
  quickCashierTiles,
  addToCart,
  popular,
  saleForm,
  setSaleForm,
  filteredProducts,
  returnMode,
  setReturnMode,
  setCart,
  checkout,
  printReceipt,
}) {
  return (
    <section className="grid-2 page-transition">
      <div className="card">
        <h2>{t.modeCashier}</h2>
        <p>{t.shift}: #{shiftNumber}</p>
        <div className="kpi-grid">
          <article className="kpi-card"><p>{t.totalProducts}</p><strong>{products.length}</strong></article>
          <article className="kpi-card"><p>{t.cart}</p><strong>{cart.length}</strong></article>
          <article className="kpi-card"><p>{t.total}</p><strong>{formatMoney(cartTotal)}</strong></article>
        </div>
        <input placeholder={t.search} value={search} onChange={(e) => setSearch(e.target.value)} />
        <div className="pos-quick-board">
          <div className="pos-quick-head row">
            <strong>Kassa uchun kartochkalar</strong>
            <div className="row">
              <button type="button" onClick={syncOfflineCacheNow}>Sinxronizatsiya</button>
              {session.role === "admin" ? (
                <button type="button" onClick={() => { setProductsView("top"); setMode("admin"); setAdminSection("products"); }}>Sozlash</button>
              ) : null}
            </div>
          </div>
          {syncNote ? <p className="muted">{syncNote}</p> : null}
          <div className="pos-quick-categories">
            <button type="button" className={`pos-cat-card ${activeQuickCategory === "all" ? "active" : ""}`} onClick={() => setActiveQuickCategory("all")}>Barchasi</button>
            {quickCategoryTiles.map((tile) => (
              <button key={tile.id} type="button" className={`pos-cat-card ${activeQuickCategory.toLowerCase() === String(tile.categoryName || "").toLowerCase() ? "active" : ""}`} onClick={() => setActiveQuickCategory(tile.categoryName)}>{tile.label}</button>
            ))}
          </div>
          <div className="pos-quick-products">
            {quickCashierTiles.map((tile) => (
              tile.kind === "category" ? (
                <button key={tile.id} type="button" className={`pos-product-card pos-category-card ${activeQuickCategory.toLowerCase() === String(tile.categoryName || "").toLowerCase() ? "active" : ""}`} onClick={() => setActiveQuickCategory(tile.categoryName)}>
                  <span>{tile.label}</span><em>toifa</em>
                </button>
              ) : (
                <button key={tile.id} type="button" className="pos-product-card" onClick={() => addToCart(tile.product, { qtyOverride: 1 })}>
                  <span>{tile.product.name}</span><em>{Math.round(Number(tile.product.sell_price || 0))}</em>
                </button>
              )
            ))}
            {!quickCashierTiles.length && <p className="muted">Tez sotuv kartochkalari sozlanmagan</p>}
          </div>
        </div>
        <div className="chips">
          {popular.map((p) => (
            <button key={p.id} onClick={() => addToCart(products.find((x) => x.id === p.id))}>{p.name}</button>
          ))}
        </div>
        <div className="row">
          <select value={saleForm.product_id} onChange={(e) => setSaleForm((s) => ({ ...s, product_id: e.target.value }))}>
            <option value="">{t.selectProduct}</option>
            {filteredProducts.map((p) => <option key={p.id} value={p.id}>{p.name} ({p.sell_price})</option>)}
          </select>
          <input type="number" step="0.01" value={saleForm.qty} onChange={(e) => setSaleForm((s) => ({ ...s, qty: e.target.value }))} />
        </div>
        <div className="row">
          <input type="number" placeholder={t.discount} value={saleForm.discount} onChange={(e) => setSaleForm((s) => ({ ...s, discount: e.target.value }))} />
          <input type="number" placeholder={t.markup} value={saleForm.markup} onChange={(e) => setSaleForm((s) => ({ ...s, markup: e.target.value }))} />
        </div>
        <div className="row">
          <label><input type="checkbox" checked={returnMode} onChange={(e) => setReturnMode(e.target.checked)} /> {t.returnMode}</label>
          <button onClick={() => addToCart()}>{t.add}</button>
        </div>
        <div className="row">
          <input value={saleForm.cashier_name} onChange={(e) => setSaleForm((s) => ({ ...s, cashier_name: e.target.value }))} />
          <select value={saleForm.payment_type} onChange={(e) => setSaleForm((s) => ({ ...s, payment_type: e.target.value }))}>
            <option value="cash">cash</option><option value="card">card</option><option value="mixed">mixed</option>
          </select>
        </div>
      </div>
      <div className="card">
        <h3>{t.cart}</h3>
        <table>
          <thead><tr><th>{t.product}</th><th>{t.qty}</th><th>{t.price}</th><th>{t.line}</th><th>{t.action}</th></tr></thead>
          <tbody>
            {cart.map((item, idx) => (
              <tr key={`${item.id}-${idx}`}>
                <td>{item.name}</td><td>{item.qty}</td><td>{item.unitPrice.toFixed(2)}</td><td>{item.lineTotal.toFixed(2)}</td>
                <td><button onClick={() => setCart((prev) => prev.filter((_, i) => i !== idx))}>{t.remove}</button></td>
              </tr>
            ))}
            {!cart.length && <tr><td colSpan="5">{t.empty}</td></tr>}
          </tbody>
        </table>
        <h3>{t.total}: {cartTotal.toFixed(2)}</h3>
        <div className="row">
          <button onClick={checkout} disabled={!cart.length}>{t.checkout}</button>
          <button onClick={() => printReceipt({ shiftNumber, cashier: saleForm.cashier_name, paymentType: saleForm.payment_type, cart, total: cartTotal })} disabled={!cart.length}>{t.print}</button>
        </div>
      </div>
    </section>
  );
}
