import { human } from "@/components/shared";

export const Confidence = ({ value }: { value: number }) => {
  const level = value >= 0.85 ? "high" : value >= 0.65 ? "medium" : "low";
  return (
    <span className={`confidence ${level}`} title={`${human(level)} confidence`}>
      {Math.round(value * 100)}% <small>{human(level)}</small>
    </span>
  );
};
