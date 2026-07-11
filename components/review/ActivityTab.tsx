import { Clock3, Download } from "lucide-react";
import { human } from "@/components/shared";
import type { Product } from "@/components/types";

export function ActivityTab({ p }: { p: Product }) {
  return (
    <section className="card timeline">
      <div className="card-head">
        <div>
          <h2>Activity history</h2>
          <p>Immutable case events and reviewer actions</p>
        </div>
        <Download />
      </div>
      {p.activity?.map((a) => (
        <div className="timeline-item" key={a.id}>
          <span>
            <Clock3 />
          </span>
          <div>
            <strong>{human(a.action)}</strong>
            <p>{a.notes}</p>
            <small>
              {a.reviewerName} · {new Date(a.createdAt).toLocaleString()}
            </small>
          </div>
        </div>
      ))}
    </section>
  );
}
