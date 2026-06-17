import { useState, useEffect } from "react";
import "../dashboard.css";
import Icon from "./Icon";
import * as api from "../../services/api";

const mockFeed = [
  { title: "New DGCA regulation detected for commercial drone operations", tag: "Drone Delivery Project", impact: "High Impact", meta: "92% confidence • 12 min ago", tone: "red" },
  { title: "Severe weather anomaly predicted in target regions", tag: "Agriculture Expansion Plan", impact: "Medium Impact", meta: "81% confidence • 45 min ago", tone: "amber" },
  { title: "Fuel prices increased by 8% in last 7 days", tag: "Logistics Operations", impact: "Medium Impact", meta: "76% confidence • 1 hr ago", tone: "amber" },
  { title: "Cybersecurity vulnerability disclosed in payment infrastructure", tag: "Fintech Expansion Plan", impact: "High Impact", meta: "95% confidence • 2 hrs ago", tone: "red" },
  { title: "Supply chain disruption risk in Southeast Asia", tag: "Healthcare Rollout Strategy", impact: "Medium Impact", meta: "68% confidence • 4 hrs ago", tone: "amber" },
];

const timelineData = [
  ["Jan", "Created", "green"], ["Feb", "Healthy", "green"], ["Mar", "Warning", "amber"],
  ["Apr", "Regulation", "red"], ["May", "Critical", "red"], ["Jun", "Mitigate", "muted"],
];

export default function RiskMonitorPage() {
  const [projects, setProjects] = useState<any[]>([]);
  const [alerts, setAlerts] = useState<any[]>([]);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  useEffect(() => {
    (async () => {
      try {
        const p = await api.getProjects();
        setProjects(p);
        if (p.length > 0) {
          setSelectedId(p[0].id);
          const a = await api.getAlerts(p[0].id).catch(() => []);
          setAlerts(a);
        }
      } catch {}
    })();
  }, []);

  const criticalAlerts = alerts.filter((a) => a.severity === "critical");
  const warnings = alerts.filter((a) => a.severity === "warning");

  return (
    <>
      <section className="dashboard-metrics">
        <div className="dashboard-panel dashboard-metric-card">
          <div className="dashboard-metric-icon tone-red"><Icon name="warning" /></div>
          <div><p className="dashboard-eyebrow">Critical Alerts</p><div className="dashboard-metric-line"><span className="dashboard-metric-value tone-red">{criticalAlerts.length}</span><span className="dashboard-metric-delta tone-red">From backend</span></div></div>
        </div>
        <div className="dashboard-panel dashboard-metric-card">
          <div className="dashboard-metric-icon tone-amber"><Icon name="warning" /></div>
          <div><p className="dashboard-eyebrow">Warnings</p><div className="dashboard-metric-line"><span className="dashboard-metric-value tone-amber">{warnings.length}</span></div></div>
        </div>
        <div className="dashboard-panel dashboard-metric-card">
          <div className="dashboard-metric-icon tone-green"><Icon name="check" /></div>
          <div><p className="dashboard-eyebrow">Active Projects</p><div className="dashboard-metric-line"><span className="dashboard-metric-value tone-green">{projects.length}</span></div></div>
        </div>
        <div className="dashboard-panel dashboard-metric-card">
          <div className="dashboard-metric-icon tone-neutral"><Icon name="trend" /></div>
          <div><p className="dashboard-eyebrow">Total Alerts</p><div className="dashboard-metric-line"><span className="dashboard-metric-value tone-neutral">{alerts.length}</span></div></div>
        </div>
        <div className="dashboard-panel dashboard-metric-card">
          <div className="dashboard-metric-icon tone-muted"><Icon name="shield" /></div>
          <div><p className="dashboard-eyebrow">Monitored Projects</p><div className="dashboard-metric-line"><span className="dashboard-metric-value tone-muted">{projects.filter((p) => p.overall_risk_score > 0).length}</span></div></div>
        </div>
      </section>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 20 }}>
        <div className="dashboard-panel dashboard-panel-radar" style={{ minHeight: 260 }}>
          <h3>RISK RADAR</h3>
          <div className="dashboard-radar-stage">
            <svg viewBox="0 0 100 100">
              <polygon points="50,10 90,30 90,70 50,90 10,70 10,30" />
              <polygon points="50,20 82,36 82,64 50,80 18,64 18,36" />
              <polygon points="50,15 85,35 75,70 50,85 15,65 20,30" className="radar-fill" />
            </svg>
            <div className="dashboard-radar-labels">
              <span>Regulatory</span><span>Operational</span><span>Technology</span>
              <span>Financial</span><span>Market</span><span>Environment</span>
            </div>
          </div>
        </div>

        <div className="dashboard-panel" style={{ padding: 16 }}>
          <div className="dashboard-panel-header">
            <h3>ALERT SUMMARY</h3>
            {projects.length > 0 && (
              <div style={{ display: "flex", gap: 6 }}>
                {projects.slice(0, 3).map((p) => (
                  <button key={p.id} onClick={() => { setSelectedId(p.id); api.getAlerts(p.id).then(setAlerts).catch(() => {}); }}
                    style={{ padding: "4px 10px", borderRadius: 6, border: `1px solid ${selectedId === p.id ? "rgba(255,43,43,0.4)" : "rgba(255,255,255,0.08)"}`, background: selectedId === p.id ? "rgba(255,43,43,0.1)" : "transparent", color: selectedId === p.id ? "#ff2b2b" : "#999", cursor: "pointer", fontSize: "0.6rem", fontWeight: 700 }}>
                    {p.name.split(" ")[0]}
                  </button>
                ))}
              </div>
            )}
          </div>
          <div style={{ display: "grid", gap: 10 }}>
            {alerts.length === 0 && <p style={{ color: "#8b8b8b", fontSize: "0.76rem" }}>No alerts yet. Extract assumptions to generate alerts.</p>}
            {alerts.map((a: any) => (
              <div key={a.id} style={{ padding: "10px 12px", borderRadius: 10, background: "rgba(255,255,255,0.03)", borderLeft: `3px solid ${a.severity === "critical" ? "var(--red)" : a.severity === "warning" ? "var(--amber)" : "#666"}` }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
                  <span style={{ fontWeight: 700, fontSize: "0.76rem" }}>{a.title}</span>
                  <span style={{ fontSize: "0.6rem", color: "#8b8b8b" }}>{a.created_at ? new Date(a.created_at).toLocaleString() : ""}</span>
                </div>
                {a.message && <p style={{ margin: 0, fontSize: "0.7rem", color: "#aaa" }}>{a.message}</p>}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="dashboard-panel dashboard-panel-feed">
        <div className="dashboard-panel-header">
          <h3>REAL-TIME RISK FEED</h3>
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

      <section className="dashboard-timeline" style={{ marginTop: 20 }}>
        <h3>RISK TIMELINE — <span>REGULATIONS REMAIN FAVORABLE</span></h3>
        <div className="dashboard-timeline-line" />
        <div className="dashboard-timeline-nodes">
          {timelineData.map(([month, label, tone]) => (
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
  );
}
