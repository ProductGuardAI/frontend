import { useState } from "react";
import { FileText, Check, MessageSquare, X, AlertCircle } from "lucide-react";
import { Badge, Empty, human } from "@/components/shared";
import { Confidence } from "./Confidence";
import { post, patch } from "@/components/api";
import type { Product } from "@/components/types";

export function FindingsTab({ p, reload, user }: { p: Product; reload: () => void; user: { fullName?: string; role?: string } | null }) {
  const [editingFinding, setEditingFinding] = useState<string | null>(null);
  const [editNote, setEditNote] = useState("");
  const [editKind, setEditKind] = useState<string>("");
  const [toast, setToast] = useState<{ msg: string; ok: boolean } | null>(null);
  const [busy, setBusy] = useState(false);

  const showToast = (msg: string, ok: boolean) => {
    setToast({ msg, ok });
    setTimeout(() => setToast(null), 4000);
  };

  const startEdit = (id: string, kind: string, currentNote: string) => {
    setEditingFinding(id);
    setEditKind(kind);
    setEditNote(currentNote || (kind === "resolve" ? "Reviewed against submitted evidence" : ""));
  };

  const cancelEdit = () => {
    setEditingFinding(null);
    setEditKind("");
    setEditNote("");
  };

  const submitFindingAction = async (id: string, kind: string) => {
    if (kind === "override") {
      const finding = p.findings?.find((f) => f.id === id);
      if (finding?.blocking && editNote.trim().length < 10) {
        showToast("Override requires a reason of at least 10 characters", false);
        return;
      }
    }
    if (kind === "resolve" && !editNote.trim()) {
      showToast("Please add a note for the resolution", false);
      return;
    }

    setBusy(true);
    try {
      await post(`/findings/${id}/${kind}`, {
        note: editNote,
        role: user?.role || "compliance_reviewer",
        reviewerName: user?.fullName || "Demo Reviewer",
      });
      showToast(`${kind === "resolve" ? "Resolved" : "Overridden"} successfully`, true);
      cancelEdit();
      reload();
    } catch (err: any) {
      showToast(err.message || `Failed to ${kind} finding`, false);
    } finally {
      setBusy(false);
    }
  };

  const saveNote = async (id: string) => {
    setBusy(true);
    try {
      await patch(`/findings/${id}`, { reviewerNote: editNote });
      showToast("Note saved", true);
      cancelEdit();
      reload();
    } catch (err: any) {
      showToast(err.message || "Failed to save note", false);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="findings">
      {toast && (
        <div className={`toast ${toast.ok ? "" : "error"}`} style={toast.ok ? {} : { backgroundColor: "#a42335" }}>
          {toast.ok ? <Check /> : <AlertCircle />}
          {toast.msg}
        </div>
      )}
      {p.findings?.length ? (
        p.findings.map((f) => (
          <article className={`finding ${f.severity}`} key={f.id}>
            <div className="finding-head">
              <Badge tone={f.severity}>{human(f.severity)}</Badge>
              <Badge>{human(f.status)}</Badge>
              <Confidence value={f.confidence} />
            </div>
            <h2>&ldquo;{f.detectedText}&rdquo;</h2>
            <p>{f.explanation}</p>
            <div className="finding-meta">
              <div>
                <small>SOURCE</small>
                <strong>
                  <FileText />
                  {p.documents?.find((d) => d.id === f.sourceDocumentId)?.fileName ?? "Document"} &middot; {f.sourceLocation}
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
              <p>&ldquo;{f.suggestedReplacement}&rdquo;</p>
            </div>

            {editingFinding === f.id ? (
              <div className="finding-edit-form">
                <textarea
                  rows={3}
                  value={editNote}
                  onChange={(e) => setEditNote(e.target.value)}
                  placeholder={
                    editKind === "override"
                      ? "Provide a specific override reason (min 10 characters for blocking findings)..."
                      : editKind === "resolve"
                        ? "Add a resolution note..."
                        : "Add an internal note..."
                  }
                />
                {f.blocking && editKind === "override" && editNote.trim().length < 10 && (
                  <p className="field-error">Blocking findings require at least 10 characters.</p>
                )}
                <div className="finding-edit-actions">
                  <button className="button" disabled={busy} onClick={() => {
                    if (editKind === "note") saveNote(f.id);
                    else submitFindingAction(f.id, editKind);
                  }}>
                    <Check size={16} />
                    {busy ? "Saving..." : "Save"}
                  </button>
                  <button className="button ghost" onClick={cancelEdit} disabled={busy}>
                    <X size={16} />
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div className="finding-actions">
                  {!["resolved", "overridden", "dismissed"].includes(f.status) && (
                    <>
                      <button
                        className="button secondary"
                        onClick={() => startEdit(f.id, "resolve", "")}
                      >
                        <Check />
                        Resolve
                      </button>
                      <button
                        className="button ghost"
                        onClick={() => startEdit(f.id, "override", "")}
                      >
                        Override
                      </button>
                    </>
                  )}
                  <button
                    className="button ghost"
                    onClick={() => startEdit(f.id, "note", f.reviewerNote ?? "")}
                  >
                    <MessageSquare />
                    {f.reviewerNote ? "Edit note" : "Add note"}
                  </button>
                </div>
                {f.reviewerNote && (
                  <p className="review-note">
                    <strong>Reviewer note:</strong> {f.reviewerNote}
                  </p>
                )}
              </>
            )}
          </article>
        ))
      ) : (
        <Empty text="No compliance findings" />
      )}
    </div>
  );
}