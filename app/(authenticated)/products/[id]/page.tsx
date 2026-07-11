'use client';

import { useState, use, useEffect } from "react";
import { useParams } from "next/navigation";
import {
  CheckCircle2,
  Check,
  MessageSquare,
  ShieldAlert,
} from "lucide-react";
import { api, post } from "@/components/api";
import { Badge, ErrorBox, human, Score, Spinner } from "@/components/shared";
import { useLoad } from "@/components/hooks";
import type { Product } from "@/components/types";

// Import modularized components
import { OverviewTab } from "@/components/review/OverviewTab";
import { ProductDataTab } from "@/components/review/ProductDataTab";
import { DocumentsTab } from "@/components/review/DocumentsTab";
import { RequirementsTab } from "@/components/review/RequirementsTab";
import { ClaimsTab } from "@/components/review/ClaimsTab";
import { FindingsTab } from "@/components/review/FindingsTab";
import { ActivityTab } from "@/components/review/ActivityTab";
import { DecisionModal } from "@/components/review/DecisionModal";

const tabs = [
  "Overview",
  "Product data",
  "Documents",
  "Requirements",
  "Claims",
  "Compliance findings",
  "Activity",
];

export default function ReviewPage() {
  const params = useParams();
  const id = params?.id as string;

  const q = useLoad(() => api<Product>(`/products/${id}`), [id]);
  const [tab, setTab] = useState("Overview");
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");
  const [modal, setModal] = useState("");
  const [user, setUser] = useState<{ fullName?: string; role?: string } | null>(null);

  useEffect(() => {
    const userJson = localStorage.getItem('user');
    if (userJson && userJson !== 'undefined') {
      try {
        setUser(JSON.parse(userJson));
      } catch {
        setUser(null);
      }
    }
  }, []);

  const act = async (action: string, notes = "") => {
    setError("");
    try {
      await post(`/products/${id}/review`, {
        action,
        reviewerName: user?.fullName || "Demo Reviewer",
        role: user?.role || "compliance_reviewer",
        notes,
      });
      setNotice(`${human(action)} recorded`);
      setModal("");
      q.reload();
      setTimeout(() => setNotice(""), 4000);
    } catch (err: any) {
      console.error(err);
      setError(err.message || `Failed to perform action: ${action}`);
      setTimeout(() => setError(""), 6000);
    }
  };

  if (q.loading) return <Spinner />;
  if (q.error || !q.data) return <ErrorBox message={q.error} retry={q.reload} />;

  const p = q.data;

  return (
    <>
      {notice && (
        <div className="toast">
          <CheckCircle2 />
          {notice}
        </div>
      )}
      {error && (
        <div className="toast" style={{ backgroundColor: '#a42335' }}>
          <ShieldAlert />
          {error}
        </div>
      )}
      <div className="review-head">
        <div className="product-avatar">{p.name.slice(0, 2).toUpperCase()}</div>
        <div className="review-title">
          <div>
            <Badge>{human(p.status)}</Badge>
            <span>Updated {new Date(p.updatedAt).toLocaleString()}</span>
          </div>
          <h1>{p.name}</h1>
          <p>
            {p.brand} · {p.supplier?.name} · {p.category} · {p.targetMarket}
          </p>
        </div>
        <div className="scores">
          <Score label="Completeness" value={p.completenessScore} />
          <Score
            label="Risk"
            value={p.riskScore}
            tone={p.riskScore > 40 ? "red" : "amber"}
          />
          <Score label="Readiness" value={p.readinessScore} tone="blue" />
        </div>
      </div>
      <div className="action-row">
        <button
          className="button green"
          onClick={() => act("approve", "Approved after human review")}
        >
          <Check />
          Approve
        </button>
        <button
          className="button secondary"
          onClick={() => setModal("request_supplier_information")}
        >
          <MessageSquare />
          Request information
        </button>
        <button
          className="button secondary danger-text"
          onClick={() =>
            act("escalate_to_compliance", "Escalated for specialist review")
          }
        >
          <ShieldAlert />
          Escalate
        </button>
        <button className="button ghost" onClick={() => setModal("reject")}>
          Reject
        </button>
      </div>
      <div className="tabs">
        {tabs.map((tName) => (
          <button
            className={tab === tName ? "active" : ""}
            onClick={() => setTab(tName)}
            key={tName}
          >
            {tName}
            {tName === "Compliance findings" && (
              <b>{p.findings?.filter((x) => ["open", "needs_human_review", "confirmed"].includes(x.status)).length}</b>
            )}
          </button>
        ))}
      </div>
      <div className="tab-content">
        {tab === "Overview" && <OverviewTab p={p} onTab={setTab} />}
        {tab === "Product data" && <ProductDataTab p={p} reload={q.reload} />}
        {tab === "Documents" && <DocumentsTab p={p} />}
        {tab === "Requirements" && <RequirementsTab p={p} />}
        {tab === "Claims" && <ClaimsTab p={p} />}
        {tab === "Compliance findings" && <FindingsTab p={p} reload={q.reload} user={user} />}
        {tab === "Activity" && <ActivityTab p={p} />}
      </div>
      {modal && (
        <DecisionModal
          action={modal}
          p={p}
          close={() => setModal("")}
          submit={act}
        />
      )}
    </>
  );
}
