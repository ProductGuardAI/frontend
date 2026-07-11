import { Badge, Empty, human } from "@/components/shared";
import { Confidence } from "./Confidence";
import type { Product } from "@/components/types";

export function ClaimsTab({ p }: { p: Product }) {
  return (
    <section className="card">
      <div className="card-head">
        <div>
          <h2>Extracted marketing and packaging claims</h2>
          <p>Evidence status is matched against submitted documents.</p>
        </div>
      </div>
      {p.claims?.length ? (
        p.claims.map((c) => (
          <div className="claim" key={c.id}>
            <div>
              <strong>“{c.claimText}”</strong>
              <small>
                {human(c.claimType)} · Source: {c.sourceLocation}
              </small>{" "}
              <Confidence value={c.confidence} />
            </div>
            <Badge tone={c.riskLevel}>{human(c.riskLevel)} risk</Badge>
            <Badge tone={c.evidenceStatus}>
              Evidence {human(c.evidenceStatus)}
            </Badge>
          </div>
        ))
      ) : (
        <Empty text="No claims were extracted" />
      )}
    </section>
  );
}
