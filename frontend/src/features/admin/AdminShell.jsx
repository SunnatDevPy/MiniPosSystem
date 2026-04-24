import AdminSidebar from "./AdminSidebar";

export default function AdminShell({
  t,
  sidebarOpen,
  sidebarCollapsed,
  isDesktop,
  setSidebarOpen,
  setSidebarCollapsed,
  adminSection,
  setAdminSection,
  setMode,
  setSession,
  children,
}) {
  return (
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
        <AdminSidebar
          t={t}
          adminSection={adminSection}
          setAdminSection={setAdminSection}
          sidebarCollapsed={sidebarCollapsed}
          setMode={setMode}
          setSession={setSession}
        />
      ) : null}

      {children}
    </section>
  );
}
