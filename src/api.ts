const base = import.meta.env.VITE_API_URL ?? 'http://localhost:4000/api';

export async function api<T>(path: string, init?: RequestInit): Promise<T> {
  const token = localStorage.getItem('token');
  
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
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login';
    throw new Error('Unauthorized');
  }

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error ?? `Request failed (${res.status})`);
  }

  return res.json() as Promise<T>;
}

export const post=(path:string,body:unknown={})=>api(path,{method:'POST',body:JSON.stringify(body)});
export const patch=(path:string,body:unknown)=>api(path,{method:'PATCH',body:JSON.stringify(body)});
