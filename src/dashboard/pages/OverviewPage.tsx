import { useState, useEffect } from "react";
import "../dashboard.css";
import Icon from "./Icon";
import * as api from "../../services/api";

const mockAssumptions = [
  { label: "Regulations remain favorable", value: 31, tone: "red", trend: "↓" },
  { label: "Internet connectivity is available", value: 67, tone: "amber", trend: "↓" },
  { label: "Customer adoption increases", value: 92, tone: "green", trend: "↑" },
  { label: "Weather conditions remain manageable", value: 74, tone: "muted", trend: "—" },
];

const mockDomains = [
  { label: "Drug Approvals", meta: "24 updates today", tone: "red" },
  { label: "Clinical Trials", meta: "18 new updates", tone: "green" },
  { label: "FDA Alerts", meta: "7 critical alerts", tone: "red" },
  { label: "Disease Outbreaks", meta: "3 new alerts", tone: "amber" },
];

const mockFeed = [
  { title: "New DGCA regulation detected for commercial drone operations", tag: "Drone Delivery Project", impact: "High Impact", meta: "92% confidence • 12 min ago", tone: "red" },
  { title: "Severe weather anomaly predicted in target regions", tag: "Agriculture Expansion Plan", impact: "Medium Impact", meta: "81% confidence • 45 min ago", tone: "amber" },
  { title: "Fuel prices increased by 8% in last 7 days", tag: "Logistics Operations", impact: "Medium Impact", meta: "76% confidence • 1 hr ago", tone: "amber" },
];

const mockWorkspace = [
  { title: "Drone Delivery in Rural India", health: "Health: 78/100", tone: "red" },
  { title: "Fintech Expansion Plan", health: "Health: 42/100", tone: "amber" },
  { title: "Healthcare Rollout Strategy", health: "Health: 88/100", tone: "green" },
];

const toneMap: Record<string, string> = {
  healthy: "green", warning: "amber", critical: "red",
};

interface OverviewPageProps {
  onNavigate: (page: string) => void;
}

export default function OverviewPage({ onNavigate }: OverviewPageProps) {
  const [projects, setProjects] = useState<any[]>([]);
  const [dashboard, setDashboard] = useState<any>(null);
  const [assumptions, setAssumptions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [copilotMsgs, setCopilotMsgs] = useState<{ role: string; text: string }[]>([]);
  const [copilotInput, setCopilotInput] = useState("");
  const [copilotLoading, setCopilotLoading] = useState(false);

  const sendCopilot = async () => {
    const q = copilotInput.trim();
    if (!q || !projects[0]?.id || copilotLoading) return;
    setCopilotMsgs((prev) => [...prev, { role: "user", text: q }]);
    setCopilotInput("");
    setCopilotLoading(true);
    try {
      const res = await api.chatCopilot(projects[0].id, q);
      setCopilotMsgs((prev) => [...prev, { role: "assistant", text: res.answer }]);
    } catch (e: any) {
      setCopilotMsgs((prev) => [...prev, { role: "assistant", text: `Error: ${e.message}` }]);
    }
    setCopilotLoading(false);
  };

  useEffect(() => {
    (async () => {
      try {
        const p = await api.getProjects();
        setProjects(p);
        if (p.length > 0) {
          const [d, a] = await Promise.all([
            api.getDashboard(p[0].id).catch(() => null),
            api.getAssumptions(p[0].id).catch(() => []),
          ]);
          setDashboard(d);
          setAssumptions(a);
        }
      } catch {}
      setLoading(false);
    })();
  }, []);

  const metrics = projects.length > 0 ? [
    { title: "Active Projects", value: String(projects.length), delta: `${projects.filter((p: any) => p.overall_risk_score > 0).length} active`, tone: "neutral", icon: "projects" },
    { title: "Healthy Assumptions", value: String(dashboard?.healthy ?? 0), delta: `${dashboard ? Math.round((dashboard.healthy / dashboard.total_assumptions) * 100) : 0}% of total`, tone: "green", icon: "check" },
    { title: "At-Risk Assumptions", value: String((dashboard?.warning ?? 0) + (dashboard?.critical ?? 0)), delta: `${dashboard ? Math.round(((dashboard.warning + dashboard.critical) / dashboard.total_assumptions) * 100) : 0}% of total`, tone: "amber", icon: "warning" },
    { title: "Critical Alerts", value: String(dashboard?.critical ?? 0), delta: "Requires attention", tone: "red", icon: "warning" },
    { title: "Risk Score", value: String(dashboard?.overall_risk_score ?? "—"), delta: "Overall", tone: "trend", icon: "trend" },
  ] : [
    { title: "Active Projects", value: "0", delta: "Create your first project", tone: "neutral", icon: "projects" },
    { title: "Healthy Assumptions", value: "—", delta: "Upload a document to start", tone: "muted", icon: "check" },
    { title: "At-Risk Assumptions", value: "—", delta: "No data yet", tone: "muted", icon: "warning" },
    { title: "Critical Alerts", value: "—", delta: "No data yet", tone: "muted", icon: "warning" },
    { title: "Risk Score", value: "—", delta: "No data yet", tone: "muted", icon: "trend" },
  ];

  const healthScore = dashboard?.overall_risk_score ?? 0;
  const healthTone = healthScore >= 70 ? "green" : healthScore >= 40 ? "amber" : "red";
  const displayAssumptions = assumptions.length > 0
    ? assumptions.map((a: any) => ({ label: a.assumption, value: a.health_score || 50, tone: toneMap[a.status] || "muted", trend: a.status === "critical" ? "↓" : a.status === "warning" ? "—" : "↑" }))
    : mockAssumptions;

  return (
    <>
      {loading ? (
        <div style={{ display: "grid", placeItems: "center", minHeight: 200, color: "#888" }}>
          <p>Loading dashboard…</p>
        </div>
      ) : (
        <>
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
                  <a href="#" onClick={(e) => { e.preventDefault(); onNavigate("assumptions"); }}>View All →</a>
                </div>
                <div className="dashboard-project-summary">
                  <p className="dashboard-project-name">{projects[0]?.name || "No projects yet"}</p>
                  <div className="dashboard-project-score">
                    <span>Overall Health</span>
                    <strong className={`tone-${healthTone}`}>{healthScore}</strong>
                    <small>/100</small>
                  </div>
                  <div className="dashboard-bar">
                    <span className={`fill tone-${healthTone}`} style={{ width: `${healthScore}%` }} />
                  </div>
                </div>
                <div className="dashboard-table-head">
                  <span>Key Assumptions</span>
                  <span>Health Score</span>
                </div>
                <div className="dashboard-assumption-list">
                  {displayAssumptions.map((item) => (
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
                  <a href="#" onClick={(e) => { e.preventDefault(); onNavigate("domain-intelligence"); }}>View All →</a>
                </div>
                <div className="dashboard-domain-layout">
                  <div className="dashboard-domain-list">
                    {mockDomains.map((item) => (
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
                  <a href="#" onClick={(e) => { e.preventDefault(); onNavigate("risk-monitor"); }}>Explore Graph →</a>
                </div>
                <div className="dashboard-graph-stage">
                  <svg viewBox="0 0 400 300">
                    <line x1="200" y1="150" x2="100" y2="100" />
                    <line x1="200" y1="150" x2="300" y2="120" />
                    <line x1="200" y1="150" x2="280" y2="230" />
                    <line x1="200" y1="150" x2="120" y2="210" />
                    <circle cx="200" cy="150" r="18" className="node-center" />
                    <text x="200" y="152">{projects[0]?.name?.slice(0, 12) || "Project"}</text>
                    {displayAssumptions.slice(0, 4).map((a, i) => {
                      const positions = [[100, 100], [300, 120], [280, 230], [120, 210]];
                      const classes = ["node-red", "node-amber", "node-amber", "node-green"];
                      return <circle key={a.label} cx={positions[i][0]} cy={positions[i][1]} r={12} className={classes[i] || "node-amber"} />;
                    })}
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
                    <a href="#" onClick={(e) => { e.preventDefault(); onNavigate("projects"); }}>View All →</a>
                  </div>
                  <div className="dashboard-workspace-list">
                    {(projects.length > 0 ? projects : mockWorkspace).map((item: any) => {
                      const health = item.overall_risk_score ?? parseInt(item.health?.split(":")[1] || "50");
                      const tone = health >= 70 ? "green" : health >= 40 ? "amber" : "red";
                      return (
                        <div className="dashboard-workspace-item" key={item.id || item.title}>
                          <div className={`dashboard-workspace-badge tone-${tone}`}>
                            <Icon name={tone === "green" ? "check" : tone === "amber" ? "money" : "drone"} />
                          </div>
                          <div className="dashboard-workspace-copy">
                            <p className="dashboard-workspace-title">{item.name || item.title}</p>
                            <p className={`dashboard-workspace-health tone-${tone}`}>Health: {health}/100</p>
                          </div>
                          <button className="dashboard-ghost">⋮</button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>

            <div className="col col-right">
              <div className="dashboard-panel dashboard-panel-feed">
                <div className="dashboard-panel-header">
                  <h3>REAL-TIME RISK FEED</h3>
                  <a href="#" onClick={(e) => { e.preventDefault(); onNavigate("risk-monitor"); }}>View All →</a>
                </div>
                <div className="dashboard-feed-list">
                  {mockFeed.map((item) => (
                    <div key={item.title} className={`dashboard-feed-item tone-${item.tone}`}>
                      <div className="dashboard-feed-top">
                        <div className="dashboard-feed-title-row">
                          <div className="dashboard-feed-badge"><Icon name="warning" /></div>
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
                  {copilotMsgs.length === 0 && (
                    <p style={{ color: "#8b8b8b", fontSize: "0.76rem", padding: "8px 0" }}>
                      Ask anything about your project's risks and assumptions.
                    </p>
                  )}
                  {copilotMsgs.map((m, i) => (
                    <div key={i} className={`bubble ${m.role}`}>{m.text}</div>
                  ))}
                  {copilotLoading && <div className="bubble assistant" style={{ opacity: 0.6 }}>Thinking…</div>}
                </div>
                <div className="dashboard-copilot-input">
                  <input
                    placeholder={projects[0] ? "Ask anything about your risks..." : "Create a project first"}
                    value={copilotInput}
                    onChange={(e) => setCopilotInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && sendCopilot()}
                    disabled={!projects[0] || copilotLoading}
                  />
                  <button onClick={sendCopilot} disabled={!projects[0] || copilotLoading}>→</button>
                </div>
              </div>
            </div>
          </section>

          <section className="dashboard-timeline">
            <h3>ASSUMPTION TIMELINE — <span>{projects[0]?.name || "PROJECT"}</span></h3>
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
        </>
      )}
    </>
  );
}
