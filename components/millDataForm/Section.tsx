export function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold border-b pb-2 text-primary">{title}</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">{children}</div>
    </div>
  );
}