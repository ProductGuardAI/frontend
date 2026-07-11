import { FileText, Check, MessageSquare } from "lucide-react";
import { Badge, Empty, human } from "@/components/shared";
import { Confidence } from "./Confidence";
import { post, patch } from "@/components/api";
import type { Product } from "@/components/types";

export function FindingsTab({ p, reload, user }: { p: Product; reload: () => void; user: { fullName?: string; role?: string } | null }) {
  const resolve = async (id: string, kind: string) => {
    const note =
      window.prompt(
        `Reviewer note for ${kind}`,
        "Reviewed against submitted evidence"
      ) ?? "";
    if (note || window.confirm(`Continue without a note?`)) {
      try {
        await post(`/findings/${id}/${kind}`, { 
          note, 
          role: user?.role || "compliance_reviewer",
          reviewerName: user?.fullName || "Demo Reviewer"
        });
        reload();
      } catch (err: any) {
        console.error(err);
        alert(err.message || `Failed to ${kind} finding`);
      }
    }
  };

  return (
    <div className="findings">
      {p.findings?.length ? (
        p.findings.map((f) => (
          <article className={`finding ${f.severity}`} key={f.id}>
            <div className="finding-head">
              <Badge tone={f.severity}>{human(f.severity)}</Badge>
              <Badge>{human(f.status)}</Badge>
              <Confidence value={f.confidence} />
            </div>
            <h2>“{f.detectedText}”</h2>
            <p>{f.explanation}</p>
            <div className="finding-meta">
              <div>
                <small>SOURCE</small>
                <strong>
                  <FileText />
                  {p.documents?.find((d) => d.id === f.sourceDocumentId)?.fileName ?? "Document"} · {f.sourceLocation}
                </strong>
              </div>
              <div>
                <small>EVIDENCE REQUIRED</small>
                <strong>{f.requiredEvidence}</strong>
              </div>
              <div>
                <small>EVIDENCE STATUS</small>
                <Badge tone={f.evidenceStatus}>{human(f.evidenceStatus)}</Badge>
              </div>
              <div>
                <small>RULE PROVENANCE</small>
                <strong>{f.ruleSource ?? "AI assisted — human verification required"}</strong>
                {f.ruleVersion && <small>Version {f.ruleVersion}</small>}
              </div>
            </div>
            <div className="replacement">
              <small>SUGGESTED COMPLIANT WORDING</small>
              <p>“{f.suggestedReplacement}”</p>
            </div>
            <div className="finding-actions">
              <button
                className="button secondary"
                onClick={() => resolve(f.id, "resolve")}
              >
                <Check />
                Resolve
              </button>
              <button
                className="button ghost"
                onClick={() => resolve(f.id, "override")}
              >
                Override
              </button>
              <button
                className="button ghost"
                onClick={async () => {
                  const reviewerNote = window.prompt(
                    "Internal note",
                    f.reviewerNote ?? ""
                  );
                  if (reviewerNote !== null) {
                    try {
                      await patch(`/findings/${f.id}`, { reviewerNote });
                      reload();
                    } catch (err: any) {
                      console.error(err);
                      alert(err.message || "Failed to update note");
                    }
                  }
                }}
              >
                <MessageSquare />
                Add note
              </button>
            </div>
            {f.reviewerNote && (
              <p className="review-note">
                <strong>Reviewer note:</strong> {f.reviewerNote}
              </p>
            )}
          </article>
        ))
      ) : (
        <Empty text="No compliance findings" />
      )}
    </div>
  );
}
