import { human } from "@/components/shared";

export const Confidence = ({ value }: { value: number }) => {
  const val = typeof value === 'number' && !isNaN(value) ? value : 0.9;
  const level = val >= 0.85 ? "high" : val >= 0.65 ? "medium" : "low";
  return (
    <span className={`confidence ${level}`} title={`${human(level)} confidence`}>
      {Math.round(val * 100)}% <small>{human(level)}</small>
    </span>
  );
};
