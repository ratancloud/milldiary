import { Input } from "../ui/input";

export function ReadOnly({ label, value }: { label: string; value: string }) {
  return (
    <div className="space-y-1">
      <label className="text-sm text-muted-foreground">{label}</label>
      <Input disabled value={value} className="bg-muted/60 text-sm font-semibold tracking-wide" />
    </div>
  );
}