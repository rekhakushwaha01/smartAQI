const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';
const TOKEN_KEY = 'smartaqi_token';
const USER_KEY = 'smartaqi_user';

export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function getStoredUser() {
  try {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function persistSession(token, user) {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

export function clearSession() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}

async function authRequest(endpoint, options = {}) {
  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data.message || 'Request failed');
  }
  return data;
}

export async function registerUser({ name, email, password, location }) {
  return authRequest('/auth/register', {
    method: 'POST',
    body: JSON.stringify({ name, email, password, location }),
  });
}

export async function loginUser({ email, password }) {
  return authRequest('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
}

export async function fetchMe() {
  const token = getToken();
  if (!token) throw new Error('Not logged in');
  return authRequest('/auth/me', {
    headers: { Authorization: `Bearer ${token}` },
  });
}

export async function saveHealthAssessment(payload) {
  const token = getToken();
  if (!token) throw new Error('Login required');
  return authRequest('/health/assess', {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
    body: JSON.stringify(payload),
  });
}

export async function fetchHealthHistory() {
  const token = getToken();
  if (!token) throw new Error('Login required');
  return authRequest('/health/history', {
    headers: { Authorization: `Bearer ${token}` },
  });
}
