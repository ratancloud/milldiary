import SignUpForm from "@/components/auth/signup-form";

export const metadata = {
  title: "Signup",
};

export default function SignUpPage() {
  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-background">
      {/* ---------- BACKGROUND DECORATION ---------- */}
      <div className="pointer-events-none absolute inset-0">
        {/* Soft grid */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(0,0,0,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,0,0,0.03)_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,rgba(255,255,255,0.1)_1px,transparent_1px), linear-gradient(to_bottom,rgba(255,255,255,0.04)_1px,transparent_1px)] bg-size-[32px_32px]"/>

        {/* Gradient glow */}
        <div className="absolute -top-24 left-1/2 h-105 w-105 -translate-x-1/2 rounded-full bg-primary/20 blur-[120px]" />
      </div>
      <div className="relative w-[90vw] md:w-full max-w-md">
        <SignUpForm />
      </div>
    </div>
  );
}
