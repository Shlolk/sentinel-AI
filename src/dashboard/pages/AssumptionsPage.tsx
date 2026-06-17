import { useState, useEffect } from "react";
import "../dashboard.css";
import * as api from "../../services/api";

const toneMap: Record<string, string> = { healthy: "green", warning: "amber", critical: "red" };

export default function AssumptionsPage() {
  const [projects, setProjects] = useState<any[]>([]);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [assumptions, setAssumptions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [extracting, setExtracting] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [statusMsg, setStatusMsg] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const p = await api.getProjects();
        setProjects(p);
        if (p.length > 0) {
          setSelectedId(p[0].id);
          const a = await api.getAssumptions(p[0].id).catch(() => []);
          setAssumptions(a);
        }
      } catch {}
      setLoading(false);
    })();
  }, []);

  const switchProject = async (id: number) => {
    setSelectedId(id);
    setAssumptions([]);
    setLoading(true);
    try {
      const a = await api.getAssumptions(id).catch(() => []);
      setAssumptions(a);
    } catch {}
    setLoading(false);
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !selectedId) return;
    setUploading(true);
    setStatusMsg("Uploading document…");
    try {
      await api.uploadDocument(selectedId, file);
      setStatusMsg(`"${file.name}" uploaded successfully`);
    } catch (e: any) {
      setStatusMsg(`Upload error: ${e.message}`);
    }
    setUploading(false);
    e.target.value = "";
    setTimeout(() => setStatusMsg(""), 4000);
  };

  const handleExtract = async () => {
    if (!selectedId) return;
    setExtracting(true);
    setStatusMsg("Extracting assumptions with AI…");
    try {
      const a = await api.extractAssumptions(selectedId);
      setAssumptions(a);
      setStatusMsg(`Found ${a.length} assumptions`);
    } catch (e: any) {
      setStatusMsg(`Error: ${e.message}`);
    }
    setExtracting(false);
    setTimeout(() => setStatusMsg(""), 4000);
  };

  const selectedProject = projects.find((p) => p.id === selectedId);
  const healthScore = assumptions.length > 0
    ? Math.round(assumptions.reduce((sum: number, a: any) => sum + (a.health_score || 0), 0) / assumptions.length)
    : 0;
  const healthTone = healthScore >= 70 ? "green" : healthScore >= 40 ? "amber" : "red";

  return (
    <>
      <div className="dashboard-panel-header" style={{ marginBottom: 16, flexWrap: "wrap", gap: 10 }}>
        <h3 style={{ fontSize: "0.85rem", letterSpacing: "0.14em", textTransform: "uppercase", color: "#c2c2c2" }}>
          Assumptions
        </h3>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
          {projects.map((p) => (
            <button key={p.id} onClick={() => switchProject(p.id)}
              style={{ padding: "6px 14px", borderRadius: 8, border: `1px solid ${selectedId === p.id ? "rgba(255,43,43,0.5)" : "rgba(255,255,255,0.08)"}`, background: selectedId === p.id ? "rgba(255,43,43,0.1)" : "transparent", color: selectedId === p.id ? "#ff2b2b" : "#999", cursor: "pointer", fontSize: "0.68rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em" }}>
              {p.name}
            </button>
          ))}
          <button onClick={() => document.getElementById("doc-upload")?.click()} disabled={uploading || !selectedId}
            style={{ padding: "6px 14px", borderRadius: 8, border: "1px solid rgba(255,255,255,0.15)", background: "transparent", color: "#ccc", cursor: "pointer", fontSize: "0.68rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", opacity: uploading ? 0.5 : 1 }}>
            {uploading ? "Uploading…" : "Upload PDF/DOCX"}
          </button>
          <input id="doc-upload" type="file" accept=".pdf,.docx" onChange={handleUpload} style={{ display: "none" }} />
          <button onClick={handleExtract} disabled={extracting || !selectedId}
            style={{ padding: "6px 14px", borderRadius: 8, border: "1px solid rgba(255,43,43,0.4)", background: "rgba(255,43,43,0.15)", color: "#ff2b2b", cursor: "pointer", fontSize: "0.68rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", opacity: extracting ? 0.5 : 1 }}>
            {extracting ? "Extracting…" : "Extract AI"}
          </button>
        </div>
      </div>

      {statusMsg && (
        <div className="dashboard-panel" style={{ padding: "10px 16px", marginBottom: 16, fontSize: "0.76rem", color: statusMsg.startsWith("Error") ? "#ff2b2b" : "#22c55e" }}>
          {statusMsg}
        </div>
      )}

      {loading ? (
        <div style={{ display: "grid", placeItems: "center", minHeight: 200, color: "#888" }}>
          <p>Loading assumptions…</p>
        </div>
      ) : !selectedProject ? (
        <div className="dashboard-panel" style={{ padding: "40px 20px", textAlign: "center" }}>
          <p style={{ margin: 0, fontWeight: 700, fontSize: "1rem" }}>No projects yet</p>
          <p style={{ margin: "8px 0 0", fontSize: "0.8rem", color: "#8b8b8b" }}>Create a project and upload a document to extract assumptions.</p>
        </div>
      ) : assumptions.length === 0 ? (
        <div className="dashboard-panel" style={{ padding: "40px 20px", textAlign: "center" }}>
          <p style={{ margin: 0, fontWeight: 700, fontSize: "1rem" }}>No assumptions extracted</p>
          <p style={{ margin: "8px 0 0", fontSize: "0.8rem", color: "#8b8b8b" }}>Click "Upload PDF/DOCX" for "{selectedProject.name}", then "Extract AI" to analyze.</p>
        </div>
      ) : (
        <>
          <div className="dashboard-panel" style={{ padding: 20, marginBottom: 20 }}>
            <div className="dashboard-project-summary">
              <p className="dashboard-project-name">{selectedProject.name}</p>
              <div className="dashboard-project-score">
                <span>Average Health</span>
                <strong className={`tone-${healthTone}`}>{healthScore}</strong>
                <small>/100</small>
              </div>
              <div className="dashboard-bar">
                <span className={`fill tone-${healthTone}`} style={{ width: `${healthScore}%` }} />
              </div>
            </div>

            <div className="dashboard-table-head">
              <span>Assumption</span>
              <span>Status • Score</span>
            </div>
            <div className="dashboard-assumption-list">
              {assumptions.map((a: any) => {
                const tone = toneMap[a.status] || "muted";
                return (
                  <div key={a.id} className="dashboard-progress-item">
                    <div className="dashboard-progress-row">
                      <span className="dashboard-progress-label">{a.assumption}</span>
                      <div className="dashboard-progress-meta">
                        <span className={`dashboard-pill tone-${tone}`} style={{ fontSize: "0.55rem", padding: "2px 8px" }}>{a.status}</span>
                        <span className={`dashboard-progress-value tone-${tone}`}>{a.health_score}%</span>
                      </div>
                    </div>
                    <div className="dashboard-progress-track">
                      <div className={`dashboard-progress-fill fill tone-${tone}`} style={{ width: `${a.health_score || 0}%` }} />
                    </div>
                    {a.category && <span style={{ fontSize: "0.62rem", color: "#8b8b8b", marginTop: 2 }}>{a.category}</span>}
                  </div>
                );
              })}
            </div>
          </div>

          <div className="dashboard-panel" style={{ padding: 20 }}>
            <div className="dashboard-panel-header">
              <h3>DETAILED BREAKDOWN</h3>
            </div>
            {assumptions.map((a: any) => {
              const tone = toneMap[a.status] || "muted";
              return (
                <div key={a.id} style={{ marginBottom: 16, padding: "12px 14px", borderRadius: 10, background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.05)" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                    <span style={{ fontWeight: 700, fontSize: "0.85rem" }}>{a.assumption}</span>
                    <span className={`tone-${tone}`} style={{ fontFamily: "'JetBrains Mono', monospace", fontWeight: 700 }}>{a.health_score}/100</span>
                  </div>
                  <div className="dashboard-progress-track" style={{ marginBottom: 6 }}>
                    <div className={`dashboard-progress-fill fill tone-${tone}`} style={{ width: `${a.health_score || 0}%` }} />
                  </div>
                  <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                    {a.category && <span className={`dashboard-pill tone-${tone}`} style={{ fontSize: "0.55rem" }}>{a.category}</span>}
                    <span className={`dashboard-pill`} style={{ fontSize: "0.55rem", background: tone === "red" ? "rgba(255,43,43,0.15)" : tone === "amber" ? "rgba(245,158,11,0.15)" : "rgba(34,197,94,0.15)" }}>{a.status}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}
      <div className="scroll-spacer" />
    </>
  );
}
