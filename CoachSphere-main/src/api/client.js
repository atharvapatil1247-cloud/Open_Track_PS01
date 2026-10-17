const API_URL =
  import.meta.env.VITE_API_URL ||
  'https://coach-sphere-backend.onrender.com';

export async function apiRequest(path, options = {}) {
  const token = localStorage.getItem('access_token');
  const controller = new AbortController();
  const timeoutId = window.setTimeout(() => controller.abort(), 15000);

  let response;
  try {
    response = await fetch(`${API_URL}${path}`, {
      ...options,
      signal: controller.signal,
      headers: {
        ...(options.body ? { 'Content-Type': 'application/json' } : {}),
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...(options.headers || {}),
      },
    });
  } catch (error) {
    if (error.name === 'AbortError') {
      throw new Error('The backend took too long to respond. Please try again.');
    }

    throw new Error(
      'Unable to reach the backend. Check the backend CORS configuration and your network connection.'
    );
  } finally {
    window.clearTimeout(timeoutId);
  }

  const body = await response.json().catch(() => null);

  if (!response.ok) {
    const detail = body?.detail || body?.message;
    const message = Array.isArray(detail)
      ? detail.map((item) => item.msg).join(', ')
      : detail || `Request failed with status ${response.status}`;

    const error = new Error(message);
    error.status = response.status;

    if (response.status === 401) {
      clearSession();
    }

    throw error;
  }

  return body;
}

export function getAuthToken(result) {
  return (
    result?.access_token ||
    result?.token ||
    result?.data?.access_token ||
    result?.data?.token ||
    null
  );
}

export function saveSession(token, user) {
  localStorage.setItem('access_token', token);
  localStorage.setItem('current_user', JSON.stringify(user));
}

export function clearSession() {
  localStorage.removeItem('access_token');
  localStorage.removeItem('current_user');
}

export function getStoredUser() {
  const storedUser = localStorage.getItem('current_user');

  if (!storedUser) {
    return null;
  }

  try {
    return JSON.parse(storedUser);
  } catch {
    localStorage.removeItem('current_user');
    return null;
  }
}
