import { AlertTriangle, FileText, Info, ShieldAlert } from "lucide-react";
import { Badge, Empty, human } from "@/components/shared";
import { Confidence } from "./Confidence";
import type { Product } from "@/components/types";

export function OverviewTab({ p, onTab }: { p: Product; onTab: (s: string) => void }) {
  const missing =
    p.requirements?.filter((r) => r.mandatory && r.status !== "present") ?? [];
  const risks =
    p.findings?.filter((f) => f.status === "open").slice(0, 4) ?? [];

  return (
    <div className="overview-grid">
      <section className="card span2">
        <div className="card-head">
          <div>
            <p className="eyebrow">EXECUTIVE SUMMARY</p>
            <h2>AI-assisted review summary</h2>
          </div>
          <Info />
        </div>
        <p className="summary">{p.summary}</p>
        <div className="recommend">
          <ShieldAlert />
          <div>
            <strong>Recommended decision</strong>
            <p>
              {human(p.status)}. Review every cited source before taking a final
              action.
            </p>
          </div>
        </div>
      </section>

      <section className="card">
        <div className="card-head">
          <h2>Product readiness</h2>
        </div>
        <div className="readiness-big">
          <strong>{p.readinessScore}</strong>
          <span>/100</span>
        </div>
        <div className="big-bar">
          <i style={{ width: `${p.readinessScore}%` }} />
        </div>
        <p>
          {p.readinessScore >= 80
            ? "The case is close to a final decision."
            : "Corrections are required before approval."}
        </p>
      </section>

      <section className="card span2">
        <div className="card-head">
          <div>
            <h2>Key compliance risks</h2>
            <p>Highest priority open findings</p>
          </div>
          <button onClick={() => onTab("Compliance findings")}>View all</button>
        </div>
        {risks.length ? (
          risks.map((f) => (
            <div className="risk-row" key={f.id}>
              <Badge tone={f.severity}>{human(f.severity)}</Badge>
              <div>
                <strong>“{f.detectedText}”</strong>
                <p>{f.explanation}</p>
                <small>
                  <FileText /> {f.sourceLocation}
                </small>{" "}
                <Confidence value={f.confidence} />
              </div>
            </div>
          ))
        ) : (
          <Empty text="No open compliance findings" />
        )}
      </section>

      <section className="card">
        <div className="card-head">
          <div>
            <h2>Missing information</h2>
            <p>{missing.length} items require attention</p>
          </div>
        </div>
        {missing.length ? (
          missing.map((r) => (
            <div className="missing" key={r.id}>
              <AlertTriangle />
              <div>
                <strong>{r.description}</strong>
                <small>
                  {human(r.requirementType)} · {human(r.status)}
                </small>
              </div>
            </div>
          ))
        ) : (
          <Empty text="All mandatory items are present" />
        )}
      </section>
    </div>
  );
}
