import { useState, useRef, useEffect, useCallback } from "react";
import "./dashboard.css";

const metrics = [
  { title: "Active Projects", value: "12", delta: "↑ 2 this week", tone: "neutral", icon: "projects" },
  { title: "Healthy Assumptions", value: "87", delta: "71% of total", tone: "green", icon: "check" },
  { title: "At-Risk Assumptions", value: "14", delta: "23% of total", tone: "amber", icon: "warning" },
  { title: "Critical Alerts", value: "3", delta: "↑ 1 new today", tone: "red", icon: "warning" },
  { title: "Risk Trend (30D)", value: "+12%", delta: "Increasing", tone: "trend", icon: "trend" },
];

const assumptions = [
  { label: "Regulations remain favorable", value: 31, tone: "red", trend: "↓" },
  { label: "Internet connectivity is available", value: 67, tone: "amber", trend: "↓" },
  { label: "Customer adoption increases", value: 92, tone: "green", trend: "↑" },
  { label: "Weather conditions remain manageable", value: 74, tone: "muted", trend: "—" },
];

const domains = [
  { label: "Drug Approvals", meta: "24 updates today", tone: "red" },
  { label: "Clinical Trials", meta: "18 new updates", tone: "green" },
  { label: "FDA Alerts", meta: "7 critical alerts", tone: "red" },
  { label: "Disease Outbreaks", meta: "3 new alerts", tone: "amber" },
];

const feed = [
  { title: "New DGCA regulation detected for commercial drone operations", tag: "Drone Delivery Project", impact: "High Impact", meta: "92% confidence • 12 min ago", tone: "red" },
  { title: "Severe weather anomaly predicted in target regions", tag: "Agriculture Expansion Plan", impact: "Medium Impact", meta: "81% confidence • 45 min ago", tone: "amber" },
  { title: "Fuel prices increased by 8% in last 7 days", tag: "Logistics Operations", impact: "Medium Impact", meta: "76% confidence • 1 hr ago", tone: "amber" },
];

const workspace = [
  { title: "Drone Delivery in Rural India", health: "Health: 78/100", tone: "red" },
  { title: "Fintech Expansion Plan", health: "Health: 42/100", tone: "amber" },
  { title: "Healthcare Rollout Strategy", health: "Health: 88/100", tone: "green" },
];

function Icon({ name, className = "" }: { name: string; className?: string }) {
  const s = { fill: "none", stroke: "currentColor", strokeLinecap: "round" as const, strokeLinejoin: "round" as const, strokeWidth: "1.7", viewBox: "0 0 24 24" };
  switch (name) {
    case "menu": return <svg className={className} {...s}><path d="M4 6h16M4 12h8m-8 6h16" /></svg>;
    case "search": return <svg className={className} {...s}><circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" /></svg>;
    case "bell": return <svg className={className} {...s}><path d="M15 17h5l-1.4-1.4A2 2 0 0 1 18 14.2V11a6 6 0 0 0-4-5.7V5a2 2 0 1 0-4 0v.3A6 6 0 0 0 6 11v3.2a2 2 0 0 1-.6 1.4L4 17h5" /><path d="M9 17a3 3 0 0 0 6 0" /></svg>;
    case "settings": return <svg className={className} {...s}><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1 1 0 0 0 .2-1l-.1-.2a1 1 0 0 0-.3-1.1l-1.1-.7a7.9 7.9 0 0 0 0-1.4l1.1-.7a1 1 0 0 0 .3-1.1l.1-.2a1 1 0 0 0-.2-1l-1.3-1.3a1 1 0 0 0-1-.2l-.2.1a1 1 0 0 0-1.1.3l-.7 1.1a7.9 7.9 0 0 0-1.4 0l-.7-1.1a1 1 0 0 0-1.1-.3l-.2-.1a1 1 0 0 0-1 .2L6.6 5.2a1 1 0 0 0-.2 1l.1.2a1 1 0 0 0 .3 1.1l1.1.7a7.9 7.9 0 0 0 0 1.4l-1.1.7a1 1 0 0 0-.3 1.1l-.1.2a1 1 0 0 0 .2 1l1.3 1.3a1 1 0 0 0 1 .2l.2-.1a1 1 0 0 0 1.1-.3l.7-1.1a7.9 7.9 0 0 0 1.4 0l.7 1.1a1 1 0 0 0 1.1.3l.2.1a1 1 0 0 0 1-.2Z" /></svg>;
    case "projects": return <svg className={className} {...s}><path d="M4 6a2 2 0 0 1 2-2h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2Z" /><path d="M13 6a2 2 0 0 1 2-2h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2h-3a2 2 0 0 1-2-2Z" /><path d="M4 15a2 2 0 0 1 2-2h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2Z" /><path d="M13 15a2 2 0 0 1 2-2h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2h-3a2 2 0 0 1-2-2Z" /></svg>;
    case "check": return <svg className={className} {...s}><circle cx="12" cy="12" r="9" /><path d="m8 12 2.5 2.5L16 9" /></svg>;
    case "warning": return <svg className={className} {...s}><path d="M12 9v3m0 4h.01" /><path d="M10.3 4.5 2.4 18a2 2 0 0 0 1.7 3h15.8a2 2 0 0 0 1.7-3L13.7 4.5a2 2 0 0 0-3.4 0Z" /></svg>;
    case "trend": return <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 100 30"><path d="M0 25 L20 22 L40 28 L60 15 L80 10 L100 2" strokeWidth="2" /></svg>;
    case "drone": return <svg className={className} {...s}><path d="M12 19l9 2-9-18-9 18 9-2Z" /><path d="M12 19v-8" /></svg>;
    case "money": return <svg className={className} {...s}><circle cx="12" cy="12" r="9" /><path d="M12 8v8" /><path d="M15 9c0-1.1-1.3-2-3-2s-3 .9-3 2 1.3 2 3 2 3 .9 3 2-1.3 2-3 2-3-.9-3-2" /></svg>;
    case "shield": return <svg className={className} {...s}><path d="M12 2 4 5v6c0 5 3.4 9.4 8 11 4.6-1.6 8-6 8-11V5l-8-3Z" /><path d="m9 12 2 2 4-4" /></svg>;
    default: return null;
  }
}

interface DashboardProps {
  onLogout: () => void;
}

export default function Dashboard({ onLogout }: DashboardProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

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
    { label: "Overview", icon: "projects", active: true },
    { label: "Projects", icon: "projects", active: false },
    { label: "Assumptions", icon: "drone", active: false },
    { label: "Risk Monitor", icon: "check", active: false },
    { label: "Domain Intelligence", icon: "settings", active: false },
  ];

  return (
    <div className={`dashboard-root${sidebarOpen ? "" : ""}`}>
      <aside className={`dashboard-sidebar${sidebarOpen ? " open" : ""}`}>
        <div className="dashboard-brand">
          <div className="dashboard-brand-mark">
            <svg viewBox="0 0 24 24"><path d="M12 2 2 7l10 5 10-5-10-5ZM2 17l10 5 10-5M2 12l10 5 10-5" /></svg>
          </div>
          <h1>SENTINEL AI</h1>
        </div>

        <nav className="dashboard-nav">
          {navItems.map((item) => (
            <a key={item.label} className={item.active ? "active" : ""} href="#">
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
              <circle className="score-ring" cx="56" cy="56" r="48" />
            </svg>
            <div className="score-copy">
              <span className="score-value">82</span>
              <span className="score-total">/100</span>
            </div>
          </div>
          <p className="status-label tone-green">Healthy</p>
          <p className="status-copy">Your decisions are on track.</p>
          <button className="primary-button">View Details →</button>
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
            <h2>DASHBOARD OVERVIEW</h2>
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
                <p>Aarav Mehta</p>
                <span>Strategic Planner</span>
              </div>
              <img alt="Profile" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBBAmlau_5wJRxCjR9cyV6rVd1ulLUysoB2EVGqwQhZhBtZMcLSqDJe2ID4ylfhhpmYLFnEg_kkOq5_PxanH6_VCUoBoVpq_JWgH8tyu2goNfmy-iXZPrLYepPoCR8TTY33vmKy2h-ER-RjlYWtGcPYLfVOzKm_66IeTOkqJZV7yc6pHucchHLi_n6xVpf-nvU3s_1aYjvMS_cEndh1S8F5wCgel7kflNIRFWZA_irnxpPKVhvykL5ghq4I3zk724LqDGiL_5GtgMOQ" />
            </div>
          </div>
        </header>

        <div className="dashboard-content" ref={contentRef}>
          <section className="dashboard-metrics">
            {metrics.map((item) => (
              <div key={item.title} className="dashboard-panel dashboard-metric-card">
                <div className={`dashboard-metric-icon tone-${item.tone}`}>
                  <Icon name={item.icon} />
                </div>
                <div>
                  <p className="dashboard-eyebrow">{item.title}</p>
                  <div className="dashboard-metric-line">
                    <span className={`dashboard-metric-value tone-${item.tone}`}>{item.value}</span>
                    <span className={`dashboard-metric-delta tone-${item.tone}`}>{item.delta}</span>
                  </div>
                </div>
              </div>
            ))}
          </section>

          <section className="dashboard-grid">
            <div className="col col-left">
              <div className="dashboard-panel dashboard-panel-tall">
                <div className="dashboard-panel-header">
                  <h3>ASSUMPTION HEALTH MONITOR</h3>
                  <a href="#">View All →</a>
                </div>
                <div className="dashboard-project-summary">
                  <p className="dashboard-project-name">Drone Delivery in Rural India</p>
                  <div className="dashboard-project-score">
                    <span>Overall Health</span>
                    <strong className="tone-green">78</strong>
                    <small>/100</small>
                  </div>
                  <div className="dashboard-bar">
                    <span className="fill tone-green" style={{ width: "78%" }} />
                  </div>
                </div>
                <div className="dashboard-table-head">
                  <span>Key Assumptions</span>
                  <span>Health Score</span>
                </div>
                <div className="dashboard-assumption-list">
                  {assumptions.map((item) => (
                    <div key={item.label} className="dashboard-progress-item">
                      <div className="dashboard-progress-row">
                        <span className="dashboard-progress-label">{item.label}</span>
                        <div className="dashboard-progress-meta">
                          <span className={`dashboard-progress-value tone-${item.tone}`}>{item.value}%</span>
                          <span className={`tone-${item.tone}`}>{item.trend}</span>
                        </div>
                      </div>
                      <div className="dashboard-progress-track">
                        <div className={`dashboard-progress-fill fill tone-${item.tone}`} style={{ width: `${item.value}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="dashboard-panel dashboard-panel-tall">
                <div className="dashboard-panel-header">
                  <h3>DOMAIN INTELLIGENCE CENTER</h3>
                  <a href="#">View All →</a>
                </div>
                <div className="dashboard-domain-layout">
                  <div className="dashboard-domain-list">
                    {domains.map((item) => (
                      <div className="dashboard-domain-item" key={item.label}>
                        <div className={`dashboard-domain-icon tone-${item.tone}`}>
                          <Icon name={item.tone === "green" ? "shield" : item.tone === "amber" ? "warning" : "drone"} />
                        </div>
                        <div>
                          <p>{item.label}</p>
                          <span>{item.meta}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="dashboard-domain-visual">
                    <img alt="Domain Intelligence" src="/dashboard-assert.webp" />
                  </div>
                </div>
              </div>
            </div>

            <div className="col col-center">
              <div className="dashboard-panel dashboard-panel-graph">
                <div className="dashboard-panel-header">
                  <h3>ASSUMPTION KNOWLEDGE GRAPH</h3>
                  <a href="#">Explore Graph →</a>
                </div>
                <div className="dashboard-graph-stage">
                  <svg viewBox="0 0 400 300">
                    <line x1="200" y1="150" x2="100" y2="100" />
                    <line x1="200" y1="150" x2="300" y2="120" />
                    <line x1="200" y1="150" x2="280" y2="230" />
                    <line x1="200" y1="150" x2="120" y2="210" />
                    <circle cx="200" cy="150" r="18" className="node-center" />
                    <text x="200" y="152">Drone Delivery</text>
                    <circle cx="100" cy="100" r="12" className="node-red" />
                    <circle cx="300" cy="120" r="14" className="node-amber" />
                    <circle cx="280" cy="230" r="12" className="node-amber" />
                    <circle cx="120" cy="210" r="10" className="node-green" />
                  </svg>
                  <div className="dashboard-legend">
                    <div><span className="dot red" /> High Risk</div>
                    <div><span className="dot amber" /> Medium Risk</div>
                    <div><span className="dot green" /> Low Risk</div>
                  </div>
                  <div className="dashboard-graph-controls">
                    <button>+</button>
                    <button>−</button>
                    <button>
                      <svg viewBox="0 0 24 24"><path d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5-5-5m5 5v-4m0 4h-4" /></svg>
                    </button>
                  </div>
                </div>
              </div>

              <div className="dashboard-split-grid">
                <div className="dashboard-panel dashboard-panel-radar">
                  <h3>RISK RADAR</h3>
                  <div className="dashboard-radar-stage">
                    <svg viewBox="0 0 100 100">
                      <polygon points="50,10 90,30 90,70 50,90 10,70 10,30" />
                      <polygon points="50,20 82,36 82,64 50,80 18,64 18,36" />
                      <polygon points="50,15 85,35 75,70 50,85 15,65 20,30" className="radar-fill" />
                    </svg>
                    <div className="dashboard-radar-labels">
                      <span>Regulatory</span>
                      <span>Operational</span>
                      <span>Technology</span>
                      <span>Financial</span>
                      <span>Market</span>
                      <span>Environment</span>
                    </div>
                  </div>
                </div>

                <div className="dashboard-panel dashboard-panel-workspace">
                  <div className="dashboard-panel-header">
                    <h3>PROJECT WORKSPACE</h3>
                    <a href="#">View All →</a>
                  </div>
                  <div className="dashboard-workspace-list">
                    {workspace.map((item) => (
                      <div className="dashboard-workspace-item" key={item.title}>
                        <div className={`dashboard-workspace-badge tone-${item.tone}`}>
                          <Icon name={item.tone === "green" ? "check" : item.tone === "amber" ? "money" : "drone"} />
                        </div>
                        <div className="dashboard-workspace-copy">
                          <p className="dashboard-workspace-title">{item.title}</p>
                          <p className={`dashboard-workspace-health tone-${item.tone}`}>{item.health}</p>
                        </div>
                        <button className="dashboard-ghost">⋮</button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="col col-right">
              <div className="dashboard-panel dashboard-panel-feed">
                <div className="dashboard-panel-header">
                  <h3>REAL-TIME RISK FEED</h3>
                  <a href="#">View All →</a>
                </div>
                <div className="dashboard-feed-list">
                  {feed.map((item) => (
                    <div key={item.title} className={`dashboard-feed-item tone-${item.tone}`}>
                      <div className="dashboard-feed-top">
                        <div className="dashboard-feed-title-row">
                          <div className="dashboard-feed-badge">
                            <Icon name="warning" />
                          </div>
                          <p className={`dashboard-feed-title tone-${item.tone}`}>{item.title}</p>
                        </div>
                        <button className="dashboard-ghost">⋮</button>
                      </div>
                      <div className="dashboard-tag-row">
                        <span className={`dashboard-pill tone-${item.tone}`}>{item.tag}</span>
                      </div>
                      <div className="dashboard-feed-footer">
                        <span className={`dashboard-impact tone-${item.tone}`}>{item.impact}</span>
                        <span className="dashboard-meta">{item.meta}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="dashboard-panel dashboard-panel-copilot">
                <div className="dashboard-panel-header compact">
                  <div className="dashboard-copilot-title">
                    <span className="copilot-bolt">⚡</span>
                    <h3>AI COPILOT</h3>
                    <span className="beta-tag">BETA</span>
                  </div>
                </div>
                <div className="dashboard-copilot-chat">
                  <div className="bubble user">Why is the regulation assumption becoming risky?</div>
                  <div className="bubble assistant">
                    Recent DGCA updates indicate stricter compliance norms, licensing changes, and operational restrictions for drone deliveries.
                  </div>
                  <div className="dashboard-copilot-actions">
                    <button className="ghost-outline">Show Evidence</button>
                    <button className="ghost-outline">What can we do?</button>
                  </div>
                </div>
                <div className="dashboard-copilot-input">
                  <input placeholder="Ask anything about your risks..." />
                  <button>→</button>
                </div>
              </div>
            </div>
          </section>

          <section className="dashboard-timeline">
            <h3>ASSUMPTION TIMELINE — <span>REGULATIONS REMAIN FAVORABLE</span></h3>
            <div className="dashboard-timeline-line" />
            <div className="dashboard-timeline-nodes">
              {[["Jan", "Created", "green"], ["Feb", "Healthy", "green"], ["Mar", "Warning", "amber"], ["Apr", "Regulation", "red"], ["May", "Critical", "red"], ["Jun", "Mitigate", "muted"]].map(([month, label, tone]) => (
                <div key={month}>
                  <p>{month}</p>
                  <strong className={`tone-${tone}`}>{label}</strong>
                  <span className={`dot ${tone}`} />
                </div>
              ))}
            </div>
          </section>
          <div className="scroll-spacer" />
        </div>
      </main>
    </div>
  );
}
