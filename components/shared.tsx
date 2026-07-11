import type { ReactNode } from "react";
import { PackageSearch, RefreshCw } from "lucide-react";

export const human = (s: any) => {
  if (typeof s !== "string") return "";
  return s.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
};

export function Badge({
  children,
  tone,
}: {
  children: ReactNode;
  tone?: string;
}) {
  return (
    <span
      className={`badge ${tone ?? String(children).toLowerCase().replace(/ /g, "_")}`}
    >
      {children}
    </span>
  );
}

export function Score({
  label,
  value,
  tone = "green",
}: {
  label: string;
  value: number;
  tone?: string;
}) {
  return (
    <div className="score">
      <div
        className="score-ring"
        style={
          {
            "--score": `${value * 3.6}deg`,
            "--tone": `var(--${tone})`,
          } as React.CSSProperties
        }
      >
        <strong>{value}</strong>
      </div>
      <span>{label}</span>
    </div>
  );
}

export function Empty({ text }: { text: string }) {
  return (
    <div className="empty">
      <PackageSearch size={34} />
      <p>{text}</p>
    </div>
  );
}

export function Spinner() {
  return <div className="spinner" aria-label="Loading" />;
}

export function ErrorBox({
  message,
  retry,
}: {
  message: string;
  retry?: () => void;
}) {
  return (
    <div className="error">
      <p>{message}</p>
      {retry && (
        <button className="button secondary" onClick={retry}>
          <RefreshCw size={16} />
          Retry
        </button>
      )}
    </div>
  );
}
