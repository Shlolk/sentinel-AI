import { useState, useRef, useEffect, useCallback } from "react";
import "./dashboard.css";
import Icon from "./pages/Icon";
import OverviewPage from "./pages/OverviewPage";
import ProjectsPage from "./pages/ProjectsPage";
import AssumptionsPage from "./pages/AssumptionsPage";
import RiskMonitorPage from "./pages/RiskMonitorPage";
import DomainIntelligencePage from "./pages/DomainIntelligencePage";
import * as api from "../services/api";

interface DashboardProps {
  user: { uid: string; email: string } | null;
  onLogout: () => void;
}

const pageTitles: Record<string, string> = {
  overview: "Dashboard Overview",
  projects: "Projects",
  assumptions: "Assumptions",
  "risk-monitor": "Risk Monitor",
  "domain-intelligence": "Domain Intelligence",
};

const CIRCUMFERENCE = 2 * Math.PI * 48;

export default function Dashboard({ user, onLogout }: DashboardProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activePage, setActivePage] = useState("overview");
  const [healthScore, setHealthScore] = useState<number | null>(null);
  const [healthStatus, setHealthStatus] = useState<string>("healthy");
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    (async () => {
      try {
        const p = await api.getProjects();
        if (p.length > 0) {
          const d = await api.getDashboard(p[0].id).catch(() => null);
          if (d) {
            const score = d.overall_risk_score;
            setHealthScore(score);
            setHealthStatus(score >= 70 ? "healthy" : score >= 40 ? "warning" : "critical");
          }
        }
      } catch {}
    })();
  }, []);

  const onScroll = useCallback(() => {
    if (contentRef.current) {
      const el = contentRef.current.parentElement?.querySelector(".parallax-bg") as HTMLElement | null;
      if (el) el.style.transform = `translateY(${contentRef.current.scrollTop * 0.3}px)`;
    }
  }, []);

  useEffect(() => {
    const el = contentRef.current;
    if (el) {
      el.addEventListener("scroll", onScroll, { passive: true });
      return () => el.removeEventListener("scroll", onScroll);
    }
  }, [onScroll]);

  const navItems = [
    { label: "Overview", key: "overview", icon: "projects" },
    { label: "Projects", key: "projects", icon: "projects" },
    { label: "Assumptions", key: "assumptions", icon: "drone" },
    { label: "Risk Monitor", key: "risk-monitor", icon: "check" },
    { label: "Domain Intelligence", key: "domain-intelligence", icon: "settings" },
  ];

  const renderPage = () => {
    switch (activePage) {
      case "projects": return <ProjectsPage />;
      case "assumptions": return <AssumptionsPage />;
      case "risk-monitor": return <RiskMonitorPage />;
      case "domain-intelligence": return <DomainIntelligencePage />;
      default: return <OverviewPage onNavigate={setActivePage} />;
    }
  };

  return (
    <div className="dashboard-root">
      <aside className={`dashboard-sidebar${sidebarOpen ? " open" : ""}`}>
        <div className="dashboard-brand" style={{ cursor: "pointer" }} onClick={() => setActivePage("overview")}>
          <div className="dashboard-brand-mark">
            <svg viewBox="0 0 24 24"><path d="M12 2 2 7l10 5 10-5-10-5ZM2 17l10 5 10-5M2 12l10 5 10-5" /></svg>
          </div>
          <h1>SENTINEL AI</h1>
        </div>

        <nav className="dashboard-nav">
          {navItems.map((item) => (
            <a
              key={item.key}
              className={activePage === item.key ? "active" : ""}
              href="#"
              onClick={(e) => { e.preventDefault(); setActivePage(item.key); setSidebarOpen(false); }}
            >
              <Icon name={item.icon} />
              <span>{item.label}</span>
            </a>
          ))}
        </nav>

        <div className="dashboard-panel dashboard-health-widget">
          <p className="dashboard-eyebrow">Assumption Health Index</p>
          <div className="circular-score">
            <svg viewBox="0 0 112 112">
              <circle cx="56" cy="56" r="48" />
              <circle className="score-ring" cx="56" cy="56" r="48"
                style={healthScore !== null ? { strokeDashoffset: CIRCUMFERENCE - (CIRCUMFERENCE * healthScore / 100) } : undefined} />
            </svg>
            <div className="score-copy">
              <span className="score-value">{healthScore !== null ? healthScore : "—"}</span>
              <span className="score-total">/100</span>
            </div>
          </div>
          <p className={`status-label tone-${healthStatus === "critical" ? "red" : healthStatus === "warning" ? "amber" : "green"}`}>
            {healthScore !== null ? (healthStatus === "critical" ? "Critical" : healthStatus === "warning" ? "At Risk" : "Healthy") : "No Data"}
          </p>
          <p className="status-copy">
            {healthScore !== null
              ? healthStatus === "critical" ? "Immediate action required." : healthStatus === "warning" ? "Monitor closely." : "Your decisions are on track."
              : "Create a project to get started."}
          </p>
          <button className="primary-button" onClick={() => setActivePage("overview")}>View Details →</button>
        </div>

        <div className="dashboard-sidebar-footer">
          <button className="dashboard-logout-btn" onClick={onLogout}>Logout</button>
          <p style={{ margin: "10px 0 0" }}>SENTINEL AI v2.5</p>
          <p style={{ margin: 0 }}>© 2026 All Rights Reserved</p>
        </div>
      </aside>

      {sidebarOpen && <div className="dashboard-overlay" onClick={() => setSidebarOpen(false)} />}

      <main className="dashboard-main">
        <div className="parallax-bg" />
        <header className="dashboard-topbar">
          <div className="dashboard-topbar-left">
            <button className="dashboard-icon-btn" onClick={() => setSidebarOpen(!sidebarOpen)}>
              <Icon name="menu" />
            </button>
            <h2>{pageTitles[activePage] || "Dashboard"}</h2>
          </div>

          <div className="dashboard-topbar-right">
            <div className="dashboard-srch">
              <Icon name="search" />
              <input placeholder="Search anything..." />
              <kbd>⌘ K</kbd>
            </div>
            <button className="dashboard-icon-btn">
              <Icon name="bell" />
              <span className="notification-dot" />
            </button>
            <button className="dashboard-icon-btn">
              <Icon name="settings" />
            </button>
            <div className="dashboard-profile">
              <div className="dashboard-profile-copy">
                <p>{user?.email?.split("@")[0] || "User"}</p>
                <span>Strategic Planner</span>
              </div>
              <div className="dashboard-profile-avatar" style={{ width: 40, height: 40, borderRadius: "50%", border: "1px solid rgba(255,43,43,0.5)", background: "rgba(255,43,43,0.15)", display: "grid", placeItems: "center", fontSize: "1rem", fontWeight: 700, color: "#ff2b2b" }}>
                {(user?.email?.[0] || "U").toUpperCase()}
              </div>
            </div>
          </div>
        </header>

        <div className="dashboard-content" ref={contentRef}>
          {renderPage()}
        </div>
      </main>
    </div>
  );
}
