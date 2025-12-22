import { FieldError } from "react-hook-form";

export function NumberInput({
  label,
  error,
  children,
}: {
  label: string;
  children: React.ReactNode;
} & { error?: FieldError }) {
  return (
    <div className="space-y-1">
      <label className="text-sm font-medium">{label}</label>
      {children}
      {error && (
        <p className="text-xs font-medium text-destructive">{error.message}</p>
      )}
    </div>
  );
}
