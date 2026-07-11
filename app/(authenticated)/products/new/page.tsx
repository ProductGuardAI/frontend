'use client';

import { useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { UploadCloud, FileText, X, ArrowLeft, ArrowRight, Sparkles, Files } from 'lucide-react';
import { api } from '@/components/api';
import type { Product } from '@/components/types';

const allowed = ['application/pdf','image/png','image/jpeg','application/vnd.openxmlformats-officedocument.wordprocessingml.document','text/csv','text/plain'];

export function validateFiles(incoming: File[], existing: File[] = []) {
  const names = new Set(existing.map(file => `${file.name}-${file.size}`));
  const valid: File[] = [];
  const errors: string[] = [];
  for (const file of incoming) {
    if (!allowed.includes(file.type)) errors.push(`${file.name}: unsupported file type`);
    else if (file.size > 15 * 1024 * 1024) errors.push(`${file.name}: exceeds 15 MB`);
    else if (names.has(`${file.name}-${file.size}`)) errors.push(`${file.name}: duplicate file`);
    else { valid.push(file); names.add(`${file.name}-${file.size}`); }
  }
  return { valid, errors };
}

export default function NewProduct() {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [files, setFiles] = useState<File[]>([]);
  const [errors, setErrors] = useState<string[]>([]);
  const [busy, setBusy] = useState(false);

  const pick = (incoming: File[]) => {
    const result = validateFiles(incoming, files);
    setFiles(current => [...current, ...result.valid]);
    setErrors(result.errors);
  };

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!files.length) { setErrors(['Add at least one supporting document so AI can identify the product.']); return; }
    setBusy(true); setErrors([]);
    try {
      const product = await api<Product>('/products', {
        method: 'POST',
        body: JSON.stringify({
          name: `AI extraction pending ${Date.now()}`,
          brand: 'Pending AI extraction',
          supplier: 'Pending AI extraction',
          category: 'General retail products',
          targetMarket: 'Vietnam',
          internalOwner: 'AI intake',
          notes: 'Product record created automatically from uploaded supporting documents.',
        }),
      });
      const data = new FormData();
      files.forEach(file => data.append('files', file));
      await api(`/products/${product.id}/documents`, { method: 'POST', body: data });
      await api(`/products/${product.id}/process`, { method: 'POST', body: JSON.stringify({}) });
      router.push(`/products/${product.id}/processing`);
    } catch (error) {
      setErrors([error instanceof Error ? error.message : 'Could not create and process this product']);
      setBusy(false);
    }
  };

  return <>
    <button className="back" onClick={() => router.back()}><ArrowLeft/>Back to products</button>
    <div className="page-head"><div><p className="eyebrow">AI DOCUMENT INTAKE</p><h1>Submit a product for review</h1><p>Upload the supplier dossier once. ProductGuard AI extracts the product data and separates every document automatically.</p></div></div>
    <form className="form-layout document-first-form" onSubmit={submit}>
      <div className="card form-card">
        <div className="step-title"><span><Sparkles/></span><div><h2>Supporting documents</h2><p>Product details are read directly from these files — no duplicate manual entry.</p></div></div>
        <div className="ai-intake-note"><Files/><div><strong>What happens next</strong><p>AI identifies the product, classifies each file, extracts attributes and claims, checks compliance, and prepares one structured case for human review.</p></div></div>
        <input ref={inputRef} type="file" hidden multiple accept=".pdf,.png,.jpg,.jpeg,.docx,.csv,.txt" onChange={event => pick(Array.from(event.target.files ?? []))}/>
        <div className="drop" onClick={() => inputRef.current?.click()} onDragOver={event => event.preventDefault()} onDrop={event => { event.preventDefault(); pick(Array.from(event.dataTransfer.files)); }}>
          <UploadCloud/><strong>Drop the complete product dossier here</strong><p>Labels, registration certificates, ingredient lists, packaging, claims and supporting evidence</p><button type="button" className="button secondary">Select files</button>
        </div>
        {files.map((file,index)=><div className="file" key={`${file.name}-${file.size}`}><span><FileText/></span><div><strong>{file.name}</strong><small>{(file.size/1024/1024).toFixed(2)} MB · Ready for AI classification</small></div><button type="button" className="icon" aria-label={`Remove ${file.name}`} onClick={()=>setFiles(files.filter((_,itemIndex)=>itemIndex!==index))}><X/></button></div>)}
        {errors.map(message=><p className="field-error" key={message}>{message}</p>)}
      </div>
      <div className="submit-bar"><div><strong>{files.length} document{files.length===1?'':'s'} selected</strong><small>AI extraction, segregation and compliance checks start immediately</small></div><button disabled={busy||!files.length} className="button" type="submit">{busy?'Creating and extracting…':'Create & process with AI'}<ArrowRight/></button></div>
    </form>
  </>;
}