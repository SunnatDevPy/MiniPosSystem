import { useEffect, useMemo, useRef, useState } from "react";
import { FiPlus, FiPrinter, FiCreditCard, FiPackage, FiInbox } from "react-icons/fi";

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
  setError,
}) {
  const [scanInput, setScanInput] = useState("");
  const [showAbcKeyboard, setShowAbcKeyboard] = useState(false);
  const [quickMode, setQuickMode] = useState("cards");
  const [showCashierSettings, setShowCashierSettings] = useState(false);
  const [cashierMono, setCashierMono] = useState(() => localStorage.getItem("cashierMono") === "true");
  const [cashierFullscreen, setCashierFullscreen] = useState(() => localStorage.getItem("cashierFullscreen") === "true");
  const [cashierTouchMode, setCashierTouchMode] = useState(() => localStorage.getItem("cashierTouchMode") === "true");
  const [selectedCartIndex, setSelectedCartIndex] = useState(-1);
  const [qtyBuffer, setQtyBuffer] = useState("");
  const [lineDiscount, setLineDiscount] = useState("");
  const [lineTotalEdit, setLineTotalEdit] = useState("");
  const scanInputRef = useRef(null);
  const scanMatchedProduct = useMemo(() => {
    const q = scanInput.trim().toLowerCase();
    if (!q) return null;
    const exact = products.find((p) => {
      const barcodes = String(p.barcode || "")
        .split(",")
        .map((x) => x.trim().toLowerCase())
        .filter(Boolean);
      return (
        barcodes.includes(q) ||
        String(p.artikul || "").toLowerCase() === q ||
        String(p.id || "").toLowerCase() === q
      );
    });
    if (exact) return exact;
    return (
      products.find((p) => String(p.name || "").toLowerCase().includes(q)) ||
      null
    );
  }, [products, scanInput]);

  function updateSelectedLine(updater) {
    if (selectedCartIndex < 0) return;
    setCart((prev) =>
      prev.map((it, idx) => {
        if (idx !== selectedCartIndex) return it;
        return updater(it);
      })
    );
  }

  function applyQtyKey(key) {
    if (selectedCartIndex < 0) return;
    const current = qtyBuffer || String(Math.abs(Number(cart[selectedCartIndex]?.qty || 1)));
    if (key === "C") {
      setQtyBuffer("");
      updateSelectedLine((it) => {
        const sign = Number(it.qty || 0) < 0 ? -1 : 1;
        const qty = sign * 1;
        return { ...it, qty, lineTotal: Number((qty * Number(it.unitPrice || 0)).toFixed(2)) };
      });
      return;
    }
    if (key === "DEL") {
      const next = current.slice(0, -1);
      setQtyBuffer(next);
      const qtyAbs = Number(next || 1);
      updateSelectedLine((it) => {
        const sign = Number(it.qty || 0) < 0 ? -1 : 1;
        const qty = sign * qtyAbs;
        return { ...it, qty, lineTotal: Number((qty * Number(it.unitPrice || 0)).toFixed(2)) };
      });
      return;
    }
    const nextRaw = `${current}${key}`.replace(/[^\d.]/g, "");
    setQtyBuffer(nextRaw);
    const qtyAbs = Number(nextRaw || 1);
    if (!Number.isFinite(qtyAbs) || qtyAbs <= 0) return;
    updateSelectedLine((it) => {
      const sign = Number(it.qty || 0) < 0 ? -1 : 1;
      const qty = sign * qtyAbs;
      return { ...it, qty, lineTotal: Number((qty * Number(it.unitPrice || 0)).toFixed(2)) };
    });
  }

  function handleScanSubmit() {
    if (!scanMatchedProduct) return;
    setSaleForm((s) => ({ ...s, product_id: String(scanMatchedProduct.id) }));
    addToCart(scanMatchedProduct, { qtyOverride: Number(saleForm.qty || 1) });
    setScanInput("");
  }

  function applyAbcKey(key) {
    if (key === "SPACE") {
      setScanInput((v) => `${v} `);
      return;
    }
    if (key === "DEL") {
      setScanInput((v) => v.slice(0, -1));
      return;
    }
    if (key === "CLR") {
      setScanInput("");
      return;
    }
    setScanInput((v) => `${v}${key}`);
  }

  function removeSelectedLine() {
    if (selectedCartIndex < 0) return;
    setCart((prev) => prev.filter((_, i) => i !== selectedCartIndex));
    setSelectedCartIndex(-1);
    setQtyBuffer("");
  }

  function applySelectedDiscount() {
    if (selectedCartIndex < 0) return;
    const discount = Number(lineDiscount || 0);
    if (!Number.isFinite(discount) || discount < 0 || discount > 100) {
      setError("Skidka 0% dan 100% gacha bo'lishi kerak");
      return;
    }
    updateSelectedLine((it) => {
      const base = Number(it.baseUnitPrice || it.unitPrice || 0);
      const product = products.find((p) => Number(p.id) === Number(it.id));
      const minAllowed = Number(product?.buy_price || 0);
      const nextUnit = Number((base * (1 - discount / 100)).toFixed(2));
      if (nextUnit < minAllowed) {
        setError("Narx tannarxdan past bo'lishi mumkin emas");
        return it;
      }
      const qty = Number(it.qty || 0);
      return { ...it, unitPrice: nextUnit, lineTotal: Number((qty * nextUnit).toFixed(2)) };
    });
    setError("");
  }

  function applySelectedLineTotal() {
    if (selectedCartIndex < 0) return;
    const editedTotal = Number(lineTotalEdit || 0);
    if (!Number.isFinite(editedTotal) || editedTotal < 0) return;
    updateSelectedLine((it) => {
      const qtyAbs = Math.max(0.0001, Math.abs(Number(it.qty || 0)));
      const base = Number(it.baseUnitPrice || it.unitPrice || 0);
      const maxTotal = Number((qtyAbs * base).toFixed(2));
      if (editedTotal > maxTotal) {
        setError("Summani boshlang'ich summadan oshirib bo'lmaydi");
        return it;
      }
      const nextUnit = Number((editedTotal / qtyAbs).toFixed(2));
      const product = products.find((p) => Number(p.id) === Number(it.id));
      const minAllowed = Number(product?.buy_price || 0);
      if (nextUnit < minAllowed) {
        setError("Narx tannarxdan past bo'lishi mumkin emas");
        return it;
      }
      const sign = Number(it.qty || 0) < 0 ? -1 : 1;
      return { ...it, unitPrice: nextUnit, lineTotal: Number((sign * editedTotal).toFixed(2)) };
    });
    setError("");
  }

  useEffect(() => {
    localStorage.setItem("cashierMono", String(cashierMono));
  }, [cashierMono]);

  useEffect(() => {
    localStorage.setItem("cashierFullscreen", String(cashierFullscreen));
  }, [cashierFullscreen]);

  useEffect(() => {
    localStorage.setItem("cashierTouchMode", String(cashierTouchMode));
  }, [cashierTouchMode]);

  useEffect(() => {
    function onHotkey(e) {
      if (e.key === "F2") {
        e.preventDefault();
        addToCart();
      }
      if (e.key === "F4") {
        e.preventDefault();
        if (cart.length) checkout();
      }
      if (e.key === "Escape") {
        setScanInput("");
        setShowAbcKeyboard(false);
      }
      if (e.key === "Enter" && document.activeElement?.classList?.contains("cashier-scan-input")) {
        e.preventDefault();
        handleScanSubmit();
      }
    }
    window.addEventListener("keydown", onHotkey);
    return () => window.removeEventListener("keydown", onHotkey);
  }, [addToCart, cart.length, checkout, handleScanSubmit]);

  return (
    <section className={`grid-2 page-transition cashier-shell ${cashierMono ? "cashier-mono" : ""} ${cashierFullscreen ? "cashier-fullscreen" : ""} ${cashierTouchMode ? "cashier-touch" : ""}`}>
      <div className="card">
        <h2>{t.modeCashier}</h2>
        <p>{t.shift}: #{shiftNumber}</p>
        <div className="cashier-top-actions">
          <button type="button" aria-label="Kassa sozlamalari" title="Kassa sozlamalari" onClick={() => setShowCashierSettings(true)}>⚙</button>
          <button type="button" onClick={() => setCashierFullscreen((v) => !v)}>{cashierFullscreen ? "Oddiy" : "Full"}</button>
        </div>
        <div className="cashier-fast-row">
          <input
            ref={scanInputRef}
            className="cashier-scan-input"
            placeholder="Skaner/barcode kiriting va Enter bosing"
            value={scanInput}
            onChange={(e) => setScanInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleScanSubmit();
              }
            }}
          />
          <button type="button" onClick={handleScanSubmit} disabled={!scanMatchedProduct}>
            Qo'shish
          </button>
          <button type="button" onClick={() => setShowAbcKeyboard((v) => !v)}>ABC</button>
        </div>
        {scanMatchedProduct ? (
          <p className="muted">Topildi: {scanMatchedProduct.name}</p>
        ) : scanInput ? (
          <p className="muted">Mahsulot topilmadi</p>
        ) : null}
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
              <button type="button" onClick={() => setQuickMode((v) => (v === "cards" ? "list" : "cards"))}>
                {quickMode === "cards" ? "Список" : "Карточка"}
              </button>
            </div>
          </div>
          {quickMode === "cards" ? (
            <>
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
                {!quickCashierTiles.length && (
                  <div className="empty-state compact">
                    <FiPackage />
                    <p>Tez sotuv kartochkalari sozlanmagan</p>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="table-scroll cashier-product-list">
              <table className="product-list-table">
                <thead><tr><th>ID</th><th>{t.product}</th><th>{t.price}</th><th></th></tr></thead>
                <tbody>
                  {filteredProducts.slice(0, 60).map((p) => (
                    <tr key={`list-${p.id}`}>
                      <td>{p.id}</td>
                      <td>{p.name}</td>
                      <td>{formatMoney(p.sell_price)}</td>
                      <td><button type="button" onClick={() => addToCart(p, { qtyOverride: 1 })}>+</button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
        <div className="chips">
          {popular.map((p) => (
            <button key={p.id} onClick={() => addToCart(products.find((x) => x.id === p.id))}>{p.name}</button>
          ))}
        </div>
        <div className="cashier-control-layout">
          <div className="cashier-op-rail">
            <button type="button" className="cashier-op-btn danger" onClick={removeSelectedLine}>Удалить</button>
            <button type="button" className="cashier-op-btn" onClick={() => setError("Чек функция в разработке")}>Чек</button>
            <button type="button" className="cashier-op-btn" onClick={() => setError("Клиент функция в разработке")}>Клиент</button>
            <button type="button" className="cashier-op-btn" onClick={() => setError("Кассир функция в разработке")}>Кассир</button>
            <button type="button" className="cashier-op-btn" onClick={() => addToCart()}><FiPlus /> F2</button>
            <button type="button" className="cashier-op-btn" onClick={checkout} disabled={!cart.length}><FiCreditCard /> F4</button>
            <button type="button" className={`cashier-op-btn ${returnMode ? "danger" : ""}`} onClick={() => setReturnMode((v) => !v)}>{returnMode ? "Возврат ON" : "Возврат OFF"}</button>
            <button type="button" className="cashier-op-btn" onClick={() => setScanInput("")}>Очистить</button>
          </div>
          <div className="cashier-keypad-wrap">
            <div className="cashier-keypad-modes">
              <button type="button" className="cashier-op-btn small">Кол-во</button>
              <button type="button" className="cashier-op-btn small" onClick={() => setShowAbcKeyboard(true)}>ABC</button>
              <button
                type="button"
                className="cashier-op-btn small"
                onClick={() => {
                  scanInputRef.current?.focus();
                }}
              >
                Поиск
              </button>
            </div>
            <div className="qty-keypad pos-left-keypad">
              {["7", "8", "9", "4", "5", "6", "1", "2", "3", ".", "0", "DEL"].map((key) => (
                <button key={key} type="button" onClick={() => applyQtyKey(key)}>{key}</button>
              ))}
              <button type="button" className="qty-keypad-clear" onClick={() => applyQtyKey("C")}>C</button>
            </div>
          </div>
          <div className="cashier-control-fields">
            <div className="row">
              <select value={saleForm.product_id} onChange={(e) => setSaleForm((s) => ({ ...s, product_id: e.target.value }))}>
                <option value="">{t.selectProduct}</option>
                {filteredProducts.map((p) => <option key={p.id} value={p.id}>{p.name} ({p.sell_price})</option>)}
              </select>
              <input type="number" step="0.01" value={saleForm.qty} onChange={(e) => setSaleForm((s) => ({ ...s, qty: e.target.value }))} />
            </div>
            <div className="row">
              <input
                type="number"
                placeholder={t.discount}
                value={saleForm.discount}
                onChange={(e) => {
                  const val = Number(e.target.value || 0);
                  if (val > 100) {
                    setError("Skidka 100% dan oshmasligi kerak");
                    setSaleForm((s) => ({ ...s, discount: 100 }));
                    return;
                  }
                  if (val < 0) {
                    setSaleForm((s) => ({ ...s, discount: 0 }));
                    return;
                  }
                  setError("");
                  setSaleForm((s) => ({ ...s, discount: e.target.value }));
                }}
              />
              <input type="number" placeholder={t.markup} value={saleForm.markup} onChange={(e) => setSaleForm((s) => ({ ...s, markup: e.target.value }))} />
            </div>
            <div className="row">
              <label><input type="checkbox" checked={returnMode} onChange={(e) => setReturnMode(e.target.checked)} /> {t.returnMode}</label>
              <button onClick={() => addToCart()}><FiPlus /> {t.add}</button>
            </div>
            <div className="row">
              <input value={saleForm.cashier_name} onChange={(e) => setSaleForm((s) => ({ ...s, cashier_name: e.target.value }))} />
              <select value={saleForm.payment_type} onChange={(e) => setSaleForm((s) => ({ ...s, payment_type: e.target.value }))}>
                <option value="cash">cash</option><option value="card">card</option><option value="mixed">mixed</option>
              </select>
            </div>
          </div>
        </div>
      </div>
      <div className="card cashier-receipt-card">
        <h3>{t.cart}</h3>
        <div className="table-scroll cashier-receipt-table-wrap">
        <table className="cashier-receipt-table">
          <thead><tr><th>{t.product}</th><th>{t.qty}</th><th>{t.price}</th><th>{t.line}</th><th>{t.action}</th></tr></thead>
          <tbody>
            {cart.map((item, idx) => (
              <tr key={`${item.id}-${idx}`} className={selectedCartIndex === idx ? "selected-row" : ""} onClick={() => {
                setSelectedCartIndex(idx);
                setQtyBuffer(String(Math.abs(Number(item.qty || 1))));
                setLineDiscount("");
                setLineTotalEdit(String(Math.abs(Number(item.lineTotal || 0))));
              }}>
                <td>{item.name}</td><td>{item.qty}</td><td>{item.unitPrice.toFixed(2)}</td><td>{item.lineTotal.toFixed(2)}</td>
                <td><button onClick={() => setCart((prev) => prev.filter((_, i) => i !== idx))}>{t.remove}</button></td>
              </tr>
            ))}
            {!cart.length && (
              <tr>
                <td colSpan="5">
                  <div className="empty-state table">
                    <FiInbox />
                    <p>{t.empty}</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
        </div>
        {selectedCartIndex >= 0 && cart[selectedCartIndex] ? (
          <div className="cashier-line-editor">
            <strong>Выбран товар: {cart[selectedCartIndex].name}</strong>
            <div className="row">
              <input type="number" min="0" max="100" placeholder="Скидка %" value={lineDiscount} onChange={(e) => setLineDiscount(e.target.value)} />
              <button type="button" onClick={applySelectedDiscount}>Применить %</button>
            </div>
            <div className="row">
              <input type="number" min="0" step="0.01" placeholder="Сумма строки" value={lineTotalEdit} onChange={(e) => setLineTotalEdit(e.target.value)} />
              <button type="button" onClick={applySelectedLineTotal}>Изменить сумму</button>
            </div>
          </div>
        ) : null}
        <h3 className="cashier-total-line">{t.total}: {cartTotal.toFixed(2)}</h3>
        <div className="row cashier-payment-actions">
          <button className="cashier-pay-btn" onClick={checkout} disabled={!cart.length}><FiCreditCard /> {t.checkout}</button>
          <button className="cashier-print-btn" onClick={() => printReceipt({ shiftNumber, cashier: saleForm.cashier_name, paymentType: saleForm.payment_type, cart, total: cartTotal })} disabled={!cart.length}><FiPrinter /> {t.print}</button>
        </div>
      </div>
      {showAbcKeyboard && (
        <div className="abc-keyboard-overlay" onClick={() => setShowAbcKeyboard(false)}>
          <div className="abc-keyboard" onClick={(e) => e.stopPropagation()}>
            <div className="abc-grid">
              {"QWERTYUIOPASDFGHJKLZXCVBNM".split("").map((k) => (
                <button key={k} type="button" onClick={() => applyAbcKey(k)}>{k}</button>
              ))}
              <button type="button" onClick={() => applyAbcKey("SPACE")}>SPACE</button>
              <button type="button" onClick={() => applyAbcKey("DEL")}>DEL</button>
              <button type="button" onClick={() => applyAbcKey("CLR")}>CLR</button>
            </div>
          </div>
        </div>
      )}
      {showCashierSettings && (
        <div className="abc-keyboard-overlay" onClick={() => setShowCashierSettings(false)}>
          <div className="cashier-settings-modal card" onClick={(e) => e.stopPropagation()}>
            <div className="row">
              <h4>Kassa sozlamalari</h4>
              <button type="button" onClick={() => setShowCashierSettings(false)}>X</button>
            </div>
            <div className="grid">
              <label className="row">
                <input type="checkbox" checked={cashierMono} onChange={(e) => setCashierMono(e.target.checked)} />
                Qora-oq (black & white) rejim
              </label>
              <label className="row">
                <input type="checkbox" checked={cashierFullscreen} onChange={(e) => setCashierFullscreen(e.target.checked)} />
                Full screen kassa rejimi
              </label>
              <label className="row">
                <input type="checkbox" checked={cashierTouchMode} onChange={(e) => setCashierTouchMode(e.target.checked)} />
                Touch mode (kotta tugmalar)
              </label>
              <p className="muted">Hotkeys: F2 - qo'shish, F4 - to'lash, Esc - tozalash</p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
