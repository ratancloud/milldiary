const testimonials = [
  {
    name: "Ramesh Patel",
    role: "Flour Mill Owner",
    quote:
      "MillDiary helped me bring discipline to my daily accounting. Monthly reports are now clear and reliable.",
  },
  {
    name: "Suresh Verma",
    role: "Oil Mill Manager",
    quote:
      "We shifted from manual registers to MillDiary. It reduced errors and saved time every month.",
  },
  {
    name: "Anil Sharma",
    role: "Small Mill Business",
    quote:
      "The system is simple and practical. Even staff members can use it without training.",
  },
];

export function TestimonialsSection() {
  return (
    <section className="border-t bg-muted/40">
      <div className="mx-auto max-w-7xl px-6 py-24">
        <div className="mb-14 text-center space-y-3">
          <h2 className="text-3xl font-semibold">
            Used by Mill Owners Across Regions
          </h2>
          <p className="text-muted-foreground">
            Feedback from businesses using MillDiary in their daily operations.
          </p>
        </div>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((t) => (
            <div
              key={t.name}
              className="rounded-xl border bg-background p-6 space-y-4"
            >
              <p className="text-sm text-muted-foreground leading-relaxed">
                “{t.quote}”
              </p>
              <div>
                <p className="text-sm font-medium">{t.name}</p>
                <p className="text-xs text-muted-foreground">{t.role}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
