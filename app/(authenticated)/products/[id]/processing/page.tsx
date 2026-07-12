'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { CheckCircle2, Circle, LoaderCircle, ShieldCheck } from 'lucide-react';
import { api } from '@/components/api';

const stages = [
  'Uploading',
  'Extracting text',
  'Classifying documents',
  'Extracting product information',
  'Standardizing values',
  'Checking requirements',
  'Analyzing claims',
  'Matching evidence',
  'Calculating scores',
  'Generating review summary',
];

export default function Processing() {
  const params = useParams();
  const id = params?.id as string;
  const router = useRouter();
  const [progress, setProgress] = useState(5);
  const [status, setStatus] = useState('running');
  const [error, setError] = useState('');

  useEffect(() => {
    if (!id) return;

    const timer = setInterval(async () => {
      try {
        const j = await api<{ progress: number; status: string; error?: string }>(
          `/products/${id}/processing-status`
        );
        setProgress(j.progress);
        setStatus(j.status);
        if (j.status === 'completed') {
          clearInterval(timer);
          setTimeout(() => router.push(`/products/${id}`), 700);
        }
        if (j.status === 'failed') {
          clearInterval(timer);
          setError(j.error ?? 'Processing failed');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Connection error');
      }
    }, 700);

    return () => clearInterval(timer);
  }, [id, router]);

  const active = Math.min(9, Math.floor(progress / 10));

  return (
    <div className="processing">
      <div className="process-mark">
        <ShieldCheck />
      </div>
      <p className="eyebrow">PRODUCTGUARD AI</p>
      <h1>
        {status === 'completed'
          ? 'Review package ready'
          : 'Building your review package'}
      </h1>
      <p>Documents are being converted into traceable product data and compliance findings.</p>
      <div className="process-card">
        <div className="process-top">
          <strong>AI processing</strong>
          <span>{progress}%</span>
        </div>
        <div className="big-bar">
          <i style={{ width: `${progress}%` }} />
        </div>
        <div className="stages">
          {stages.map((s, i) => (
            <div
              className={i === active ? 'active' : i < active ? 'done' : ''}
              key={s}
            >
              {i < active ? (
                <CheckCircle2 />
              ) : i === active ? (
                <LoaderCircle className="spin" />
              ) : (
                <Circle />
              )}
              <span>{s}</span>
            </div>
          ))}
        </div>
        {error && (
          <div className="error">
            <p>{error}</p>
            <button className="button" onClick={() => router.push(`/products/${id}`)}>
              Return to case
            </button>
          </div>
        )}
      </div>
      <small>AI processing extracts product data and checks compliance from your uploaded documents.</small>
    </div>
  );
}
