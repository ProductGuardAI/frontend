import { CheckCircle2, AlertTriangle } from "lucide-react";
import { Badge, human } from "@/components/shared";
import type { Product } from "@/components/types";

export function RequirementsTab({ p }: { p: Product }) {
  return (
    <section className="card">
      <div className="card-head">
        <div>
          <h2>Category requirements</h2>
          <p>
            {p.category} · {p.targetMarket}
          </p>
        </div>
      </div>
      {p.requirements?.map((r) => (
        <div className="requirement" key={r.id}>
          {r.status === "present" ? (
            <CheckCircle2 className="ok" />
          ) : (
            <AlertTriangle className="warn" />
          )}
          <div>
            <strong>{r.description}</strong>
            <small>
              {human(r.requirementType)} ·{" "}
              {r.mandatory ? "Mandatory" : "Optional"}
              {r.source && ` · ${r.source}`}
            </small>
          </div>
          <Badge tone={r.status}>{human(r.status)}</Badge>
        </div>
      ))}
    </section>
  );
}
