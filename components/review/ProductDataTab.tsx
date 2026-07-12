import { useState } from "react";
import { Check, CheckCircle2, Edit3, AlertCircle } from "lucide-react";
import { Badge, human } from "@/components/shared";
import { Confidence } from "./Confidence";
import { patch, post } from "@/components/api";
import type { Product } from "@/components/types";

export function ProductDataTab({ p, reload }: { p: Product; reload: () => void }) {
  const [editing, setEditing] = useState("");
  const [value, setValue] = useState("");
  const [toast, setToast] = useState<{ msg: string; ok: boolean } | null>(null);
  const [busy, setBusy] = useState(false);

  const showToast = (msg: string, ok: boolean) => {
    setToast({ msg, ok });
    setTimeout(() => setToast(null), 4000);
  };

  const save = async (id: string) => {
    if (!value.trim()) {
      showToast("Value cannot be empty", false);
      return;
    }
    setBusy(true);
    try {
      await patch(`/attributes/${id}`, {
        normalizedValue: value,
        reviewStatus: "reviewer_edited",
      });
      showToast("Attribute updated", true);
      setEditing("");
      reload();
    } catch (err: any) {
      showToast(err.message || "Failed to update attribute", false);
    } finally {
      setBusy(false);
    }
  };

  const verify = async (id: string) => {
    setBusy(true);
    try {
      await post(`/attributes/${id}/verify`, {});
      showToast("Attribute verified", true);
      reload();
    } catch (err: any) {
      showToast(err.message || "Failed to verify attribute", false);
    } finally {
      setBusy(false);
    }
  };

  return (
    <section className="card">
      {toast && (
        <div className={`toast ${toast.ok ? "" : "error"}`} style={toast.ok ? {} : { backgroundColor: "#a42335" }}>
          {toast.ok ? <Check /> : <AlertCircle />}
          {toast.msg}
        </div>
      )}
      <div className="card-head">
        <div>
          <h2>Structured product information</h2>
          <p>Every value retains its source and confidence.</p>
        </div>
      </div>
      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Attribute</th>
              <th>Raw value</th>
              <th>Normalized value</th>
              <th>Confidence</th>
              <th>Source</th>
              <th>Status</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {p.attributes?.map((a) => (
              <tr key={a.id}>
                <td>
                  <strong>{human(a.attributeKey)}</strong>
                </td>
                <td>{a.rawValue}</td>
                <td>
                  {editing === a.id ? (
                    <input
                      autoFocus
                      value={value}
                      onChange={(e) => setValue(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") save(a.id);
                        if (e.key === "Escape") setEditing("");
                      }}
                    />
                  ) : (
                    <strong>{a.normalizedValue}</strong>
                  )}
                </td>
                <td>
                  <Confidence value={a.confidence} />
                </td>
                <td>
                  <small>{a.sourceLocation}</small>
                </td>
                <td>
                  <Badge>{human(a.reviewStatus)}</Badge>
                </td>
                <td>
                  <div className="row-actions">
                    {editing === a.id ? (
                      <button onClick={() => save(a.id)} disabled={busy} title="Save">
                        <Check />
                      </button>
                    ) : (
                      <button
                        onClick={() => {
                          setEditing(a.id);
                          setValue(a.normalizedValue);
                        }}
                        title="Edit"
                      >
                        <Edit3 />
                      </button>
                    )}
                    <button
                      title="Verify"
                      onClick={() => verify(a.id)}
                      disabled={busy}
                    >
                      <CheckCircle2 />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}