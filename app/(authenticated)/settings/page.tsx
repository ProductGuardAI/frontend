'use client';

import { BrainCircuit, Database, Server, ShieldCheck } from "lucide-react";

export default function SettingsPage() {
  const backendUrl = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000/api';

  return (
    <>
      <div className="page-head">
        <div>
          <p className="eyebrow">CONFIGURATION</p>
          <h1>System settings</h1>
          <p>Runtime configuration is managed server-side through environment variables.</p>
        </div>
      </div>
      <div className="settings-grid">
        <section className="card setting">
          <BrainCircuit />
          <div>
            <h2>AI provider</h2>
            <p>Mock / deterministic demo provider</p>
            <span className="status-dot">Connected</span>
          </div>
        </section>
        <section className="card setting">
          <Server />
          <div>
            <h2>Backend API</h2>
            <p>{backendUrl}</p>
            <span className="status-dot">Configured</span>
          </div>
        </section>
        <section className="card setting">
          <Database />
          <div>
            <h2>Storage</h2>
            <p>JSON demo store · Prisma schema ready for PostgreSQL</p>
            <span className="status-dot">Available</span>
          </div>
        </section>
      </div>
      <section className="card disclaimer">
        <ShieldCheck />
        <div>
          <h2>Compliance disclaimer</h2>
          <p>
            ProductGuard AI provides decision support only. Findings do not constitute legal advice and must be reviewed by qualified compliance personnel for the applicable target market.
          </p>
        </div>
      </section>
    </>
  );
}
