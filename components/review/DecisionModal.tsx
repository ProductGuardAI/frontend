import { useState } from "react";
import { Loader2 } from "lucide-react";
import { human } from "@/components/shared";
import { post } from "@/components/api";
import type { Product } from "@/components/types";

export function DecisionModal({
  action,
  p,
  close,
  submit,
}: {
  action: string;
  p: Product;
  close: () => void;
  submit: (a: string, n: string) => void;
}) {
  const [note, setNote] = useState("");
  const [generated, setGenerated] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const isRequestInfo = action === "request_supplier_information";
  const isReject = action === "reject";

  const generate = async () => {
    setBusy(true);
    setError("");
    try {
      const v = (await post(`/products/${p.id}/clarification`)) as any;
      setGenerated(v.message);
      setNote(v.message);
    } catch (err: any) {
      setError(err.message || "Failed to generate clarification note");
    } finally {
      setBusy(false);
    }
  };

  const handleSubmit = () => {
    if (isReject && !note.trim()) {
      setError("Please provide a reason for rejection");
      return;
    }
    submit(action, note);
  };

  return (
    <div className="modal-back" onClick={(e) => { if (e.target === e.currentTarget) close(); }}>
      <div className="modal">
        <h2>{human(action)}</h2>
        <p>
          {isRequestInfo
            ? "Generate or edit a structured clarification request for the supplier."
            : isReject
              ? "Document the reason for rejecting this submission."
              : "Document the reason for this reviewer decision."}
        </p>
        {error && (
          <div className="error" role="alert" style={{ marginBottom: "12px" }}>
            {error}
          </div>
        )}
        {isRequestInfo && (
          <button className="button secondary" onClick={generate} disabled={busy}>
            {busy ? <Loader2 className="spin" size={16} /> : null}
            {busy ? "Generating..." : "Generate from findings"}
          </button>
        )}
        <textarea
          rows={generated ? 12 : 6}
          value={note}
          onChange={(e) => { setNote(e.target.value); setError(""); }}
          placeholder={
            isRequestInfo
              ? "Add or edit the clarification request..."
              : isReject
                ? "Reason for rejection (required)..."
                : "Add reviewer notes..."
          }
        />
        <div style={{ display: "flex", gap: "12px", justifyContent: "flex-end", marginTop: "16px" }}>
          <button className="button ghost" onClick={close}>
            Cancel
          </button>
          <button className="button" onClick={handleSubmit}>
            Record decision
          </button>
        </div>
      </div>
    </div>
  );
}