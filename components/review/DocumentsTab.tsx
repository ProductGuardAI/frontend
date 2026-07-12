import { FileText, ExternalLink } from "lucide-react";
import { Badge, human } from "@/components/shared";
import { Confidence } from "./Confidence";
import type { Product } from "@/components/types";

export function DocumentsTab({ p }: { p: Product }) {
  return (
    <section className="card">
      <div className="card-head">
        <div>
          <h2>Document register</h2>
          <p>{p.documents?.length} files attached to this submission</p>
        </div>
      </div>
      <div className="document-grid">
        {p.documents?.map((d) => (
          <article className="document" key={d.id}>
            <span>
              <FileText />
            </span>
            <div>
              <strong>{d.fileName}</strong>
              <p>{human(d.documentType)}</p>
              <small>English</small>{" "}
              <Confidence value={d.classificationConfidence} />
            </div>
            <Badge>{human(d.processingStatus)}</Badge>
            <a
              href={`${process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') ?? 'http://localhost:4000'}${d.fileUrl}`}
              target="_blank"
              rel="noreferrer"
            >
              <ExternalLink />
            </a>
          </article>
        ))}
      </div>
    </section>
  );
}
