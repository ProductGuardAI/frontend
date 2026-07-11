import { useState } from "react";
import { Check, CheckCircle2, Edit3 } from "lucide-react";
import { Badge, human } from "@/components/shared";
import { Confidence } from "./Confidence";
import { patch, post } from "@/components/api";
import type { Product } from "@/components/types";

export function ProductDataTab({ p, reload }: { p: Product; reload: () => void }) {
  const [editing, setEditing] = useState("");
  const [value, setValue] = useState("");

  const save = async (id: string) => {
    try {
      await patch(`/attributes/${id}`, {
        normalizedValue: value,
        reviewStatus: "reviewer_edited",
      });
      setEditing("");
      reload();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <section className="card">
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
                      <button onClick={() => save(a.id)}>
                        <Check />
                      </button>
                    ) : (
                      <button
                        onClick={() => {
                          setEditing(a.id);
                          setValue(a.normalizedValue);
                        }}
                      >
                        <Edit3 />
                      </button>
                    )}
                    <button
                      title="Verify"
                      onClick={async () => {
                        try {
                          await post(`/attributes/${a.id}/verify`);
                          reload();
                        } catch (err) {
                          console.error(err);
                        }
                      }}
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
