import BrandLogo from "../../shared/ui/BrandLogo";
import {
  FiBarChart2,
  FiBox,
  FiRotateCcw,
  FiClipboard,
  FiSettings,
  FiUsers,
  FiDollarSign,
  FiShoppingBag,
  FiLogOut,
  FiMonitor,
  FiShoppingCart,
} from "react-icons/fi";

const MENU_ITEMS = [
  { id: "reports", labelKey: "menuReports", icon: FiBarChart2 },
  { id: "products", labelKey: "menuProducts", icon: FiShoppingBag },
  { id: "warehouse", labelKey: "menuWarehouse", icon: FiBox },
  { id: "finance", labelKey: "menuFinance", icon: FiDollarSign },
  { id: "staff", labelKey: "menuStaff", icon: FiUsers },
  { id: "returns", labelKey: "menuReturns", icon: FiRotateCcw },
  { id: "audit", labelKey: "menuAudit", icon: FiClipboard },
  { id: "settings", labelKey: "menuSettings", icon: FiSettings },
];

export default function AdminSidebar({ t, adminSection, setAdminSection, sidebarCollapsed, setMode, setSession }) {
  return (
    <aside className="admin-sidebar card">
      <div className="sidebar-logo"><BrandLogo compact /></div>
      <nav className="sidebar-menu">
        {MENU_ITEMS.map((item) => (
          <button key={item.id} type="button" className={`menu-item ${adminSection === item.id ? "active" : ""}`} onClick={() => setAdminSection(item.id)} title={sidebarCollapsed ? t[item.labelKey] : ""}>
            <span className="menu-icon" aria-hidden="true"><item.icon /></span>
            <span className="menu-text">{t[item.labelKey]}</span>
          </button>
        ))}
      </nav>
      <div className="sidebar-footer">
        <button type="button" onClick={() => setMode("cashier")}><FiShoppingCart /> {t.modeCashier}</button>
        <button type="button" onClick={() => setMode("admin")}><FiMonitor /> {t.modeAdmin}</button>
        <button type="button" onClick={() => { setSession(null); setMode("cashier"); setAdminSection("warehouse"); }}><FiLogOut /> {t.logout}</button>
      </div>
    </aside>
  );
}
