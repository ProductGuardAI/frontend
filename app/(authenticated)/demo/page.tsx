'use client';

import { useRouter } from "next/navigation";
import {
  AlertTriangle,
  ArrowRight,
  BrainCircuit,
  CheckCircle2,
  Database,
  FileWarning,
  RefreshCw,
  RotateCcw,
  ScanSearch,
  ShieldCheck,
  Sparkles,
  Tags,
} from "lucide-react";
import { post } from "@/components/api";
import { useState } from "react";
import { Badge } from "@/components/shared";

const scenarios = [
  {
    id: "demo-clean",
    name: "Guardian Aloe Vera Hydrating Gel",
    status: "Ready for approval",
    tone: "green",
    Icon: CheckCircle2,
    problem: "No blocking issue",
    detect: "AI validates complete attributes, documents, claims, and evidence.",
    solve: "Builds a traceable approval package for the in-person reviewer.",
  },
  {
    id: "demo-incomplete",
    name: "BrightGlow Vitamin C Serum",
    status: "Supplier clarification",
    tone: "amber",
    Icon: FileWarning,
    problem: "Missing dossier data + unsupported clinical claim",
    detect: "Finds missing registration, ingredients, volume, and claim evidence.",
    solve: "Generates an editable supplier correction request automatically.",
  },
  {
    id: "demo-risk",
    name: "AcneAway Miracle Cream",
    status: "Compliance hold",
    tone: "red",
    Icon: AlertTriangle,
    problem: "Medical, safety, endorsement, and permanent-result claims",
    detect: "Matches five exact phrases to versioned blocking rules.",
    solve: "Suggests safer wording and blocks approval until human resolution.",
  },
  {
    id: "demo-mismatch",
    name: "PureCare Gentle Cleanser",
    status: "Data conflict",
    tone: "red",
    Icon: ScanSearch,
    problem: "Manufacturer mismatch across documents",
    detect: "Cross-checks legal entity names in the dossier and certificate.",
    solve: "Keeps both values, explains the conflict, and requests corrected evidence.",
  },
  {
    id: "demo-expired",
    name: "NaturePlus Organic Body Lotion",
    status: "Expired evidence",
    tone: "amber",
    Icon: RefreshCw,
    problem: "Organic certificate has expired",
    detect: "Connects the organic claim to its supporting certificate and expiry date.",
    solve: "Requests a current certificate or recommends removing the claim.",
  },
  {
    id: "demo-label",
    name: "K-Beauty Repair Sheet Mask",
    status: "Label correction",
    tone: "amber",
    Icon: Tags,
    problem: "Vietnamese supplementary label missing",
    detect: "Compares submitted packaging against the category checklist.",
    solve: "Produces the missing-label information checklist for the supplier.",
  },
  {
    id: "demo-duplicate",
    name: "FreshMint Oral Rinse",
    status: "Probable duplicate",
    tone: "red",
    Icon: Database,
    problem: "Barcode already belongs to a catalog item",
    detect: "Matches the barcode and flags a probable existing-product duplicate.",
    solve: "Routes the candidate match to a category manager without merging records.",
  },
  {
    id: "demo-low-quality",
    name: "BabySoft Barrier Balm",
    status: "Human review",
    tone: "amber",
    Icon: ScanSearch,
    problem: "Low-quality registration scan",
    detect: "Measures low extraction confidence and refuses to invent unreadable values.",
    solve: "Requests a clearer replacement and preserves human verification.",
  },
] as const;

export default function Demo() {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  const reset = async () => {
    setBusy(true);
    try {
      await post("/demo/reset");
    } catch (err) {
      console.error(err);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="demo-experience">
      <div className="demo-hero">
        <div>
          <p className="eyebrow">LIVE GUIDED DEMONSTRATION</p>
          <h1>See ProductGuard AI find, explain, and route product risks</h1>
          <p>Choose a scenario, follow the AI evidence trail, then complete the final decision as an in-person reviewer.</p>
        </div>
        <button className="button secondary" disabled={busy} onClick={reset}>
          <RotateCcw className={busy ? "spin" : ""} />
          {busy ? "Resetting…" : "Reset all scenarios"}
        </button>
      </div>

      <div className="demo-flow">
        <span>
          <b>1</b>
          <strong>Open a scenario</strong>
          <small>Realistic fictional submission</small>
        </span>
        <ArrowRight />
        <span>
          <b>2</b>
          <strong>Watch AI investigate</strong>
          <small>Rules, evidence, confidence</small>
        </span>
        <ArrowRight />
        <span>
          <b>3</b>
          <strong>Review the fix</strong>
          <small>Suggested correction or wording</small>
        </span>
        <ArrowRight />
        <span>
          <b>4</b>
          <strong>Make the decision</strong>
          <small>Human approval stays mandatory</small>
        </span>
      </div>

      <div className="scenario-heading">
        <div>
          <Sparkles />
          <span>
            <strong>{scenarios.length} interactive approval scenarios</strong>
            <small>Every case opens the full reviewer workspace with findings, sources, scores, and actions.</small>
          </span>
        </div>
        <BadgeLegend />
      </div>

      <div className="scenario-grid">
        {scenarios.map((s) => (
          <button
            className={`scenario-card ${s.tone}`}
            key={s.id}
            onClick={() => router.push(`/products/${s.id}`)}
          >
            <div className="scenario-top">
              <span>
                <s.Icon />
              </span>
              <em>{s.status}</em>
            </div>
            <h2>{s.name}</h2>
            <div className="scenario-stage problem">
              <small>PROBLEM TO EXPLIVE</small>
              <p>{s.problem}</p>
            </div>
            <div className="scenario-stage detection">
              <small>
                <BrainCircuit /> AI AUTOMATICALLY DETECTS
              </small>
              <p>{s.detect}</p>
            </div>
            <div className="scenario-stage solution">
              <small>
                <ShieldCheck /> AI PREPARES THE NEXT STEP
              </small>
              <p>{s.solve}</p>
            </div>
            <strong className="scenario-open">
              Open approval workspace <ArrowRight />
            </strong>
          </button>
        ))}
      </div>

      <section className="card demo-note">
        <ShieldCheck />
        <div>
          <h2>Designed for a live, in-person approval demo</h2>
          <p>
            The AI never grants final legal approval. It structures evidence, applies configured rules, recommends next steps, and prevents unresolved blockers from being approved. The presenter completes the final action in the review workspace.
          </p>
        </div>
      </section>
    </div>
  );
}

function BadgeLegend() {
  return (
    <div className="scenario-legend">
      <span>
        <i className="green" />
        Approval-ready
      </span>
      <span>
        <i className="amber" />
        Supplier action
      </span>
      <span>
        <i className="red" />
        Compliance hold
      </span>
    </div>
  );
}
