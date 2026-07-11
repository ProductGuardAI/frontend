import { useState } from "react";
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

  const generate = async () => {
    try {
      const v = (await post(`/products/${p.id}/clarification`)) as any;
      setGenerated(v.message);
      setNote(v.message);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="modal-back">
      <div className="modal">
        <h2>{human(action)}</h2>
        <p>
          {action === "request_supplier_information"
            ? "Generate or edit a structured clarification request."
            : "Document the reason for this reviewer decision."}
        </p>
        {action === "request_supplier_information" && (
          <button className="button secondary" onClick={generate}>
            Generate from findings
          </button>
        )}
        <textarea
          rows={generated ? 12 : 6}
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Add reviewer notes…"
        />
        <div>
          <button className="button ghost" onClick={close}>
            Cancel
          </button>
          <button className="button" onClick={() => submit(action, note)}>
            Record decision
          </button>
        </div>
      </div>
    </div>
  );
}
