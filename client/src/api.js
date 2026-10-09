const API_BASE = '/api';

export async function fetchJson(url, options = {}) {
  const res = await fetch(url, options);
  if (!res.ok) {
    const errorBody = await res.json().catch(() => ({}));
    throw new Error(errorBody.message || errorBody.error || `HTTP error ${res.status}`);
  }
  return res.json();
}

export const getJobs = (params = {}) => {
  const query = new URLSearchParams();
  if (params.status && params.status !== 'all') query.set('status', params.status);
  if (params.role && params.role !== 'all') query.set('role', params.role);
  if (params.search) query.set('search', params.search);
  if (params.minScore) query.set('minScore', params.minScore);

  const qs = query.toString() ? `?${query.toString()}` : '';
  return fetchJson(`${API_BASE}/jobs${qs}`);
};

export const getJobById = (id) => fetchJson(`${API_BASE}/jobs/${id}`);

export const getStats = () => fetchJson(`${API_BASE}/jobs/stats`);

export const approveJob = (id) =>
  fetchJson(`${API_BASE}/jobs/${id}/approve`, { method: 'PATCH' });

export const applyJob = (id) =>
  fetchJson(`${API_BASE}/jobs/${id}/apply`, { method: 'PATCH' });

export const skipJob = (id) =>
  fetchJson(`${API_BASE}/jobs/${id}/skip`, { method: 'PATCH' });

export const restoreJob = (id) =>
  fetchJson(`${API_BASE}/jobs/${id}/restore`, { method: 'PATCH' });

export const deleteJob = (id) =>
  fetchJson(`${API_BASE}/jobs/${id}`, { method: 'DELETE' });

export const updateJobStage = (id, stage) =>
  fetchJson(`${API_BASE}/jobs/${id}/stage`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ stage })
  });

export const discoverLiveJobs = (query = 'react') =>
  fetchJson(`${API_BASE}/jobs/discover-live`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query })
  });

export const tailorResume = (id) =>
  fetchJson(`${API_BASE}/jobs/${id}/tailor-resume`, { method: 'POST' });

export const generateOutreach = (id) =>
  fetchJson(`${API_BASE}/jobs/${id}/generate-outreach`, { method: 'POST' });

export const getInterviewPrep = (id) =>
  fetchJson(`${API_BASE}/jobs/${id}/interview-prep`, { method: 'POST' });

export const addJob = (jobData) =>
  fetchJson(`${API_BASE}/jobs`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(jobData)
  });

export const rematchAllJobs = () =>
  fetchJson(`${API_BASE}/jobs/rematch`, { method: 'POST' });

export const resetStore = () =>
  fetchJson(`${API_BASE}/jobs/reset`, { method: 'POST' });

export const getResume = () => fetchJson(`${API_BASE}/resume`);

export const updateResume = (profile, autoRematch = false) =>
  fetchJson(`${API_BASE}/resume`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ...profile, autoRematch })
  });

export const uploadResumeFile = async (file) => {
  const formData = new FormData();
  formData.append('resumeFile', file);
  const res = await fetch(`${API_BASE}/resume/upload`, {
    method: 'POST',
    body: formData
  });
  if (!res.ok) {
    const errorBody = await res.json().catch(() => ({}));
    throw new Error(errorBody.message || errorBody.error || `Upload failed with HTTP ${res.status}`);
  }
  return res.json();
};

export const getActivities = () => fetchJson(`${API_BASE}/activity`);
