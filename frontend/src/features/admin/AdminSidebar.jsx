import BrandLogo from "../../shared/ui/BrandLogo";

const MENU_ITEMS = [
  { id: "reports", labelKey: "menuReports", icon: "📊" },
  { id: "products", labelKey: "menuProducts", icon: "🧺" },
  { id: "warehouse", labelKey: "menuWarehouse", icon: "📦" },
  { id: "finance", labelKey: "menuFinance", icon: "💳" },
  { id: "staff", labelKey: "menuStaff", icon: "🕒" },
  { id: "returns", labelKey: "menuReturns", icon: "↩️" },
  { id: "audit", labelKey: "menuAudit", icon: "🧾" },
  { id: "settings", labelKey: "menuSettings", icon: "⚙️" },
];

export default function AdminSidebar({ t, adminSection, setAdminSection, sidebarCollapsed, setMode, setSession }) {
  return (
    <aside className="admin-sidebar card">
      <div className="sidebar-logo"><BrandLogo compact /></div>
      <nav className="sidebar-menu">
        {MENU_ITEMS.map((item) => (
          <button key={item.id} type="button" className={`menu-item ${adminSection === item.id ? "active" : ""}`} onClick={() => setAdminSection(item.id)} title={sidebarCollapsed ? t[item.labelKey] : ""}>
            <span className="menu-icon" aria-hidden="true">{item.icon}</span>
            <span className="menu-text">{t[item.labelKey]}</span>
          </button>
        ))}
      </nav>
      <div className="sidebar-footer">
        <button type="button" onClick={() => setMode("cashier")}>{t.modeCashier}</button>
        <button type="button" onClick={() => setMode("admin")}>{t.modeAdmin}</button>
        <button type="button" onClick={() => { setSession(null); setMode("cashier"); setAdminSection("warehouse"); }}>{t.logout}</button>
      </div>
    </aside>
  );
}
