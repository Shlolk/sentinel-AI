import { useState, useEffect } from "react";
import "../dashboard.css";
import Icon from "./Icon";
import * as api from "../../services/api";

const domainMeta = [
  { name: "Regulatory", icon: "shield", desc: "Policy changes, compliance updates, and regulatory filings across jurisdictions." },
  { name: "Technology & Infrastructure", icon: "warning", desc: "Cybersecurity threats, infrastructure changes, and technology disruptions." },
  { name: "Market & Economics", icon: "money", desc: "Market trends, economic indicators, and competitive intelligence." },
  { name: "Environmental", icon: "trend", desc: "Climate events, weather patterns, and environmental policy changes." },
  { name: "Geopolitical", icon: "settings", desc: "Political developments, trade policies, and international relations." },
  { name: "Clinical & Life Sciences", icon: "drone", desc: "Clinical trial results, drug approvals, and medical research." },
];

const recentIntelligence = [
  { domain: "Regulatory", title: "DGCA publishes new commercial drone guidelines", confidence: "92%", time: "12 min ago", tone: "red" },
  { domain: "Environmental", title: "IMD forecasts above-average monsoon in target regions", confidence: "81%", time: "45 min ago", tone: "amber" },
  { domain: "Market & Economics", title: "Crude oil prices projected to rise 12% in Q3", confidence: "76%", time: "1 hr ago", tone: "amber" },
  { domain: "Clinical & Life Sciences", title: "FDA fast-tracks novel mRNA therapy candidate", confidence: "88%", time: "3 hrs ago", tone: "green" },
  { domain: "Technology", title: "Zero-day vulnerability discovered in major cloud platform", confidence: "95%", time: "5 hrs ago", tone: "red" },
];

export default function DomainIntelligencePage() {
  const [projects, setProjects] = useState<any[]>([]);

  useEffect(() => {
    api.getProjects().then(setProjects).catch(() => {});
  }, []);

  const domainActivity = domainMeta.map((d, i) => ({
    ...d,
    updates: Math.max(1, Math.floor(Math.random() * 20) + projects.length),
    status: i < 2 ? "critical" : i < 4 ? "monitoring" : "stable",
    tone: i < 1 ? "red" : i < 3 ? "amber" : i < 5 ? "green" : "amber",
  }));

  return (
    <>
      <section className="dashboard-metrics" style={{ marginBottom: 20 }}>
        {[
          { title: "Active Domains", value: `${domainActivity.length}`, delta: "All monitored", tone: "green", icon: "shield" },
          { title: "Projects Tracked", value: String(projects.length), delta: "Active projects", tone: "neutral", icon: "projects" },
          { title: "Total Signals", value: `${domainActivity.reduce((s, d) => s + d.updates, 0)}`, delta: "24h window", tone: "neutral", icon: "trend" },
          { title: "Domains", value: `${domainActivity.filter((d) => d.status === "critical").length}`, delta: "Need attention", tone: "red", icon: "warning" },
          { title: "Sources", value: "142", delta: "+8 new sources", tone: "neutral", icon: "search" },
        ].map((item) => (
          <div key={item.title} className="dashboard-panel dashboard-metric-card">
            <div className={`dashboard-metric-icon tone-${item.tone}`}><Icon name={item.icon} /></div>
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

      <div style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr", gap: 20, marginBottom: 20 }}>
        <div className="dashboard-panel" style={{ padding: 16 }}>
          <div className="dashboard-panel-header">
            <h3>DOMAIN OVERVIEW</h3>
          </div>
          <div style={{ display: "grid", gap: 12 }}>
            {domainActivity.map((d) => (
              <div key={d.name} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 12px", borderRadius: 10, background: "rgba(255,255,255,0.03)" }}>
                <div className={`dashboard-domain-icon tone-${d.tone}`}><Icon name={d.icon} /></div>
                <div style={{ minWidth: 0, flex: 1 }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <p style={{ margin: 0, fontWeight: 700, fontSize: "0.82rem" }}>{d.name}</p>
                    <span className={`dashboard-pill tone-${d.tone}`} style={{ fontSize: "0.55rem" }}>{d.updates} signals</span>
                  </div>
                  <p style={{ margin: "4px 0 0", fontSize: "0.68rem", color: "#8b8b8b" }}>{d.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="dashboard-panel dashboard-panel-feed">
          <div className="dashboard-panel-header">
            <h3>RECENT INTELLIGENCE</h3>
          </div>
          <div className="dashboard-feed-list">
            {recentIntelligence.map((item) => (
              <div key={item.title} className={`dashboard-feed-item tone-${item.tone}`}>
                <div className="dashboard-feed-top">
                  <div className="dashboard-feed-title-row">
                    <div className="dashboard-feed-badge"><Icon name="warning" /></div>
                    <div>
                      <p className={`dashboard-feed-title tone-${item.tone}`} style={{ fontSize: "0.68rem" }}>{item.title}</p>
                      <span className="dashboard-pill" style={{ fontSize: "0.5rem", padding: "2px 6px", marginTop: 4, background: "rgba(255,255,255,0.05)" }}>{item.domain}</span>
                    </div>
                  </div>
                </div>
                <div className="dashboard-feed-footer" style={{ marginTop: 8 }}>
                  <span className={`dashboard-impact tone-${item.tone}`} style={{ fontSize: "0.58rem" }}>{item.confidence} confidence</span>
                  <span className="dashboard-meta" style={{ fontSize: "0.58rem" }}>{item.time}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="dashboard-panel dashboard-panel-tall" style={{ padding: 16 }}>
        <div className="dashboard-panel-header">
          <h3>DOMAIN INTELLIGENCE CENTER</h3>
        </div>
        <div className="dashboard-domain-layout">
          <div className="dashboard-domain-list">
            {domainActivity.slice(0, 4).map((d) => (
              <div className="dashboard-domain-item" key={d.name}>
                <div className={`dashboard-domain-icon tone-${d.tone}`}><Icon name={d.icon} /></div>
                <div>
                  <p>{d.name}</p>
                  <span>{d.updates} signals • {d.status}</span>
                </div>
              </div>
            ))}
          </div>
          <div className="dashboard-domain-visual">
            <img alt="Domain Intelligence" src="/dashboard-assert.webp" />
          </div>
        </div>
      </div>
      <div className="scroll-spacer" />
    </>
  );
}
