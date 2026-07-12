const base = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000/api';

export async function api<T>(path: string, init?: RequestInit): Promise<T> {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  
  const headers: HeadersInit = {
    ...(init?.body instanceof FormData ? {} : { 'content-type': 'application/json' }),
    ...(token ? { 'authorization': `Bearer ${token}` } : {}),
    ...init?.headers,
  };

  const res = await fetch(`${base}${path}`, {
    ...init,
    headers,
  });

  if (res.status === 401) {
    if (typeof window !== 'undefined') {
      const refreshToken = localStorage.getItem('refreshToken');
      if (refreshToken && path !== '/auth/refresh') {
        try {
          const refreshRes = await fetch(`${base}/auth/refresh`, {
            method: 'POST',
            headers: { 'content-type': 'application/json' },
            body: JSON.stringify({ refreshToken }),
          });
          
          if (refreshRes.ok) {
            const refreshData = await refreshRes.json();
            const tokens = refreshData.data;
            if (tokens && tokens.token) {
              localStorage.setItem('token', tokens.token);
              if (tokens.refreshToken) {
                localStorage.setItem('refreshToken', tokens.refreshToken);
              }
              // Retry the original request with new token
              const retryHeaders: HeadersInit = {
                ...(init?.body instanceof FormData ? {} : { 'content-type': 'application/json' }),
                'authorization': `Bearer ${tokens.token}`,
                ...init?.headers,
              };
              const retryRes = await fetch(`${base}${path}`, {
                ...init,
                headers: retryHeaders,
              });
              if (retryRes.ok) {
                const json = await retryRes.json();
                if (json && typeof json === 'object' && 'data' in json && 'status' in json && 'message' in json) {
                  return json.data as T;
                }
                return json as T;
              }
            }
          }
        } catch (e) {
          console.error('Failed to auto-refresh token:', e);
        }
      }

      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    throw new Error('Unauthorized');
  }

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.message || body.error || `Request failed (${res.status})`);
  }

  const json = await res.json();
  if (json && typeof json === 'object' && 'data' in json && 'status' in json && 'message' in json) {
    return json.data as T;
  }
  return json as T;
}

export const post = (path: string, body: unknown = {}) => api(path, { method: 'POST', body: JSON.stringify(body) });
export const patch = (path: string, body: unknown) => api(path, { method: 'PATCH', body: JSON.stringify(body) });
