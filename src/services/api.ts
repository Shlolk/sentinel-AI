const API_BASE = "http://localhost:8000";

function getHeaders(): HeadersInit {
  const uid = localStorage.getItem("firebase_uid");
  return {
    "Content-Type": "application/json",
    ...(uid ? { "x-firebase-uid": uid } : {}),
  };
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: { ...getHeaders(), ...(options.headers as Record<string, string> || {}) },
  });
  if (!res.ok) {
    const err = await res.text();
    throw new Error(err || `Request failed: ${res.status}`);
  }
  if (res.status === 204) return undefined as T;
  return res.json();
}

// ── Health ──

export async function healthCheck() {
  return request<{ status: string; database: string }>("/health");
}

// ── User Sync ──

export async function syncUser(firebase_uid: string, email: string) {
  return request<{ id: number; firebase_uid: string; email: string }>("/users/sync", {
    method: "POST",
    body: JSON.stringify({ firebase_uid, email }),
  });
}

// ── Projects ──

export async function createProject(data: { name: string; domain?: string; description?: string }) {
  return request<{ id: number; user_id: number; name: string; domain: string | null; description: string | null; overall_risk_score: number; created_at: string }>(
    "/projects",
    { method: "POST", body: JSON.stringify(data) }
  );
}

export async function getProjects() {
  return request<
    { id: number; user_id: number; name: string; domain: string | null; description: string | null; overall_risk_score: number; created_at: string }[]
  >("/projects");
}

export async function getProject(id: number) {
  return request<{ id: number; user_id: number; name: string; domain: string | null; description: string | null; overall_risk_score: number; created_at: string }>(
    `/projects/${id}`
  );
}

export async function deleteProject(id: number) {
  return request<void>(`/projects/${id}`, { method: "DELETE" });
}

// ── Documents ──

export async function uploadDocument(project_id: number, file: File) {
  const uid = localStorage.getItem("firebase_uid");
  const formData = new FormData();
  formData.append("file", file);
  const res = await fetch(`${API_BASE}/documents/upload?project_id=${project_id}`, {
    method: "POST",
    headers: uid ? { "x-firebase-uid": uid } : {},
    body: formData,
  });
  if (!res.ok) {
    const err = await res.text();
    throw new Error(err || "Upload failed");
  }
  return res.json();
}

export async function getDocuments(project_id: number) {
  return request<
    { id: number; project_id: number; file_name: string; file_path: string | null; extracted_text: string | null; uploaded_at: string }[]
  >(`/documents/${project_id}`);
}

// ── Assumptions ──

export async function extractAssumptions(project_id: number) {
  return request<
    { id: number; assumption: string; category: string | null; health_score: number | null; status: string | null; created_at: string }[]
  >("/assumptions/extract", {
    method: "POST",
    body: JSON.stringify({ project_id }),
  });
}

export async function getAssumptions(project_id: number) {
  return request<
    { id: number; assumption: string; category: string | null; health_score: number | null; status: string | null; created_at: string }[]
  >(`/assumptions/${project_id}`);
}

// ── Dashboard ──

export async function getDashboard(project_id: number) {
  return request<{
    total_assumptions: number;
    healthy: number;
    warning: number;
    critical: number;
    overall_risk_score: number;
  }>(`/dashboard/${project_id}`);
}

// ── Alerts ──

export async function getAlerts(project_id: number) {
  return request<
    { id: number; title: string | null; message: string | null; severity: string | null; confidence: number | null; created_at: string }[]
  >(`/alerts/${project_id}`);
}

// ── Recommendations ──

export async function getRecommendations(project_id: number) {
  return request<
    { id: number; recommendation: string | null; expected_risk_reduction: number | null; created_at: string }[]
  >(`/recommendations/${project_id}`);
}

// ── Copilot ──

export async function chatCopilot(project_id: number, question: string) {
  return request<{ answer: string }>("/copilot/chat", {
    method: "POST",
    body: JSON.stringify({ project_id, question }),
  });
}
