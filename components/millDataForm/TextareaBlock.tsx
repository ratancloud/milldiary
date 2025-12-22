export function TextareaBlock({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1 md:col-span-2">
      <label className="text-sm font-medium">{label}</label>
      {children}
    </div>
  );
}
