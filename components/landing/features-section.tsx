import {
  FileSpreadsheet,
  BarChart3,
  ShieldCheck,
  ClipboardCheck,
} from "lucide-react";

const features = [
  {
    icon: ClipboardCheck,
    title: "Daily Entry Made Simple",
    description:
      "Record mill credits, material usage, and expenses in a structured format every day.",
  },
  {
    icon: BarChart3,
    title: "Accurate Monthly Summary",
    description:
      "Get clear monthly totals for credits, debits, and savings without manual calculation.",
  },
  {
    icon: FileSpreadsheet,
    title: "Excel Export for Accounting",
    description:
      "Export data anytime for accountants, audits, or offline records.",
  },
  {
    icon: ShieldCheck,
    title: "Secure & Private Data",
    description:
      "Your business information is protected and accessible only to you.",
  },
];

export function FeaturesSection() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-24">
      <div className="mb-14 text-center space-y-3">
        <h2 className="text-3xl font-semibold">
          Everything You Need to Run Your Mill Accounts
        </h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          MillDiary is designed for real business use — simple, reliable,
          and focused on daily financial clarity.
        </p>
      </div>

      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
        {features.map((feature) => (
          <div
            key={feature.title}
            className="rounded-xl border bg-background p-6 space-y-4"
          >
            <feature.icon className="h-6 w-6 text-primary" />
            <h3 className="text-base font-medium">{feature.title}</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {feature.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
