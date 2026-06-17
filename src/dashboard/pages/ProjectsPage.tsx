import { useState, useEffect } from "react";
import "../dashboard.css";
import Icon from "./Icon";
import * as api from "../../services/api";

export default function ProjectsPage() {
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: "", domain: "", description: "" });
  const [creating, setCreating] = useState(false);

  const fetchProjects = async () => {
    try {
      const p = await api.getProjects();
      setProjects(p);
    } catch {}
    setLoading(false);
  };

  useEffect(() => { fetchProjects(); }, []);

  const handleCreate = async () => {
    if (!form.name.trim()) return;
    setCreating(true);
    try {
      await api.createProject({ name: form.name, domain: form.domain || undefined, description: form.description || undefined });
      setForm({ name: "", domain: "", description: "" });
      setShowForm(false);
      await fetchProjects();
    } catch (e: any) {
      alert(e.message);
    }
    setCreating(false);
  };

  const toneFromScore = (score: number) => {
    if (score >= 70) return "green";
    if (score >= 40) return "amber";
    return "red";
  };

  return (
    <>
      <div className="dashboard-panel-header" style={{ marginBottom: 16 }}>
        <h3 style={{ fontSize: "0.85rem", letterSpacing: "0.14em", textTransform: "uppercase", color: "#c2c2c2" }}>
          All Projects ({projects.length})
        </h3>
        <button
          className="primary-button"
          style={{ background: "transparent", border: "1px solid rgba(255,43,43,0.3)", color: "#ff2b2b", padding: "8px 16px", borderRadius: 10, cursor: "pointer", fontSize: "0.72rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em" }}
          onClick={() => setShowForm(!showForm)}
        >
          + New Project
        </button>
      </div>

      {showForm && (
        <div className="dashboard-panel" style={{ padding: 20, marginBottom: 20 }}>
          <h4 style={{ margin: "0 0 14px", fontSize: "0.85rem", color: "#ccc" }}>Create New Project</h4>
          <div style={{ display: "grid", gap: 12 }}>
            <input placeholder="Project name *" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
              style={{ padding: "10px 14px", borderRadius: 10, border: "1px solid rgba(255,255,255,0.08)", background: "rgba(20,20,20,0.76)", color: "#fff", font: "inherit", outline: "none" }} />
            <input placeholder="Domain (e.g. Logistics, Finance)" value={form.domain} onChange={(e) => setForm({ ...form, domain: e.target.value })}
              style={{ padding: "10px 14px", borderRadius: 10, border: "1px solid rgba(255,255,255,0.08)", background: "rgba(20,20,20,0.76)", color: "#fff", font: "inherit", outline: "none" }} />
            <textarea placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3}
              style={{ padding: "10px 14px", borderRadius: 10, border: "1px solid rgba(255,255,255,0.08)", background: "rgba(20,20,20,0.76)", color: "#fff", font: "inherit", outline: "none", resize: "vertical" }} />
            <div style={{ display: "flex", gap: 10 }}>
              <button onClick={handleCreate} disabled={creating || !form.name.trim()}
                style={{ padding: "10px 20px", borderRadius: 10, border: "none", background: "#ff2b2b", color: "#fff", cursor: "pointer", fontWeight: 700, opacity: creating || !form.name.trim() ? 0.5 : 1 }}>
                {creating ? "Creating…" : "Create Project"}
              </button>
              <button onClick={() => setShowForm(false)}
                style={{ padding: "10px 20px", borderRadius: 10, border: "1px solid rgba(255,255,255,0.1)", background: "transparent", color: "#999", cursor: "pointer" }}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {loading ? (
        <div style={{ display: "grid", placeItems: "center", minHeight: 200, color: "#888" }}>
          <p>Loading projects…</p>
        </div>
      ) : projects.length === 0 ? (
        <div className="dashboard-panel" style={{ padding: "40px 20px", textAlign: "center" }}>
          <Icon name="projects" />
          <p style={{ margin: "12px 0 4px", fontWeight: 700, fontSize: "1rem" }}>No projects yet</p>
          <p style={{ margin: 0, fontSize: "0.8rem", color: "#8b8b8b" }}>Create your first project to get started.</p>
        </div>
      ) : (
        <div style={{ display: "grid", gap: 12 }}>
          {projects.map((p) => {
            const tone = toneFromScore(p.overall_risk_score);
            return (
              <div key={p.id} className="dashboard-panel" style={{ padding: "14px 18px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16, transition: "background 180ms ease" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 14, minWidth: 0, flex: 1 }}>
                  <div className={`dashboard-workspace-badge tone-${tone}`}>
                    <Icon name={tone === "green" ? "check" : tone === "amber" ? "warning" : "drone"} />
                  </div>
                  <div style={{ minWidth: 0 }}>
                    <p style={{ margin: 0, fontWeight: 700, fontSize: "0.9rem" }}>{p.name}</p>
                    <p style={{ margin: "4px 0 0", fontSize: "0.72rem", color: "#8b8b8b" }}>{p.domain || "No domain"}</p>
                  </div>
                </div>
                <div className="dashboard-project-score" style={{ margin: 0, gap: 8 }}>
                  <span className={`tone-${tone}`} style={{ fontWeight: 700, fontSize: "1rem", fontFamily: "'JetBrains Mono', monospace" }}>{p.overall_risk_score}</span>
                  <small>/100</small>
                </div>
                <div className="dashboard-bar" style={{ width: 120 }}>
                  <span className={`fill tone-${tone}`} style={{ width: `${p.overall_risk_score}%`, display: "block", height: "100%", borderRadius: "inherit" }} />
                </div>
                <div style={{ textAlign: "right", flexShrink: 0, fontSize: "0.6rem", color: "#8b8b8b" }}>
                  {new Date(p.created_at).toLocaleDateString()}
                </div>
              </div>
            );
          })}
        </div>
      )}
      <div className="scroll-spacer" />
    </>
  );
}
