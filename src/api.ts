const base=import.meta.env.VITE_API_URL??'http://localhost:4000/api';
export async function api<T>(path:string,init?:RequestInit):Promise<T>{const res=await fetch(`${base}${path}`,{...init,headers:init?.body instanceof FormData?init.headers:{'content-type':'application/json',...init?.headers}});if(!res.ok){const body=await res.json().catch(()=>({}));throw new Error(body.error??`Request failed (${res.status})`);}return res.json() as Promise<T>;}
export const post=(path:string,body:unknown={})=>api(path,{method:'POST',body:JSON.stringify(body)});
export const patch=(path:string,body:unknown)=>api(path,{method:'PATCH',body:JSON.stringify(body)});
