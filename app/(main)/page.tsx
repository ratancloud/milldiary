import {
  BarChart3,
  FileSpreadsheet,
  ShieldCheck,
  Wallet,
  ClipboardCheck,
  Users,
  ArrowRight,
  CheckCircle2,
  Zap,
  Star
} from "lucide-react"
import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Home",
};

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-linear-to-b from-slate-50 to-white dark:from-slate-950 dark:to-slate-900">
      {/* Hero Section */}
      <section className="relative overflow-hidden border-b">
        {/* Background decoration */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(59,130,246,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(59,130,246,0.05)_1px,transparent_1px)] bg-size-[32px_32px]" />
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-200 h-100 bg-linear-to-r from-blue-500/20 via-indigo-500/20 to-purple-500/20 blur-3xl" />
        </div>

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
            
            {/* Left Column */}
            <div className="space-y-8">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 rounded-full bg-blue-100 dark:bg-blue-900/30 px-4 py-1.5 text-sm font-medium text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                <Wallet className="h-4 w-4" />
                Accounting & Expense Management for Mills
              </div>

              {/* Heading */}
              <div>
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-slate-900 dark:text-slate-100 leading-tight">
                  Accurate, Organized and{" "}
                  <span className="bg-linear-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                    Reliable Mill Accounting
                  </span>
                </h1>
              </div>

              {/* Description */}
              <p className="text-lg sm:text-xl text-slate-600 dark:text-slate-300 leading-relaxed max-w-xl">
                MillDiary is built for mill owners who want clear records of daily credits, expenses, materials, and savings — without complex accounting software.
              </p>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href='/mill-data' className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-linear-to-r from-blue-600 to-indigo-600 text-white font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40">
                  Start Using MillDiary
                  <ArrowRight className="h-5 w-5" />
                </Link>
                <Link href='/dashboard' className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 font-semibold border-2 border-slate-200 dark:border-slate-700 hover:border-blue-500 dark:hover:border-blue-500 transition-all">
                  View Dashboard
                </Link>
              </div>

              {/* Trust indicators */}
              <div className="flex flex-wrap items-center gap-6 pt-4">
                <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                  <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400" />
                  No credit card required
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                  <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400" />
                  Free 30-day trial
                </div>
              </div>

              <p className="text-sm text-slate-500 dark:text-slate-400">
                Designed for flour mills, oil mills & small manufacturing units
              </p>
            </div>

            {/* Right Column - Feature Cards */}
            <div className="relative">
              {/* Decorative cards */}
              <div className="absolute -top-4 -right-4 w-full h-full rounded-2xl bg-linear-to-br from-blue-100 to-indigo-100 dark:from-blue-900/20 dark:to-indigo-900/20 blur-xl opacity-60" />
              
              {/* Main card */}
              <div className="relative rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-8 shadow-2xl shadow-slate-200/50 dark:shadow-slate-900/50 space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-semibold tracking-wide text-slate-500 dark:text-slate-400 uppercase">
                    Key Capabilities
                  </h3>
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  </div>
                </div>

                <InfoRow
                  icon={BarChart3}
                  title="Daily & Monthly Overview"
                  description="Track credits, debits, and savings with clarity."
                />

                <InfoRow
                  icon={FileSpreadsheet}
                  title="Material-Based Records"
                  description="Flour, Oil, Sarso, Gehum with weight & value."
                />

                <InfoRow
                  icon={ShieldCheck}
                  title="Private & Secure"
                  description="Only you can access your business data."
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="border-b bg-linear-to-br from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-slate-100">500+</div>
              <div className="text-sm text-slate-600 dark:text-slate-400 mt-1">Active Mills</div>
            </div>
            <div className="text-center">
              <div className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-slate-100">₹10Cr+</div>
              <div className="text-sm text-slate-600 dark:text-slate-400 mt-1">Tracked Monthly</div>
            </div>
            <div className="text-center">
              <div className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-slate-100">99.9%</div>
              <div className="text-sm text-slate-600 dark:text-slate-400 mt-1">Uptime</div>
            </div>
            <div className="text-center">
              <div className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-slate-100">24/7</div>
              <div className="text-sm text-slate-600 dark:text-slate-400 mt-1">Support</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 sm:py-28">
        <div className="text-center mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 rounded-full bg-indigo-100 dark:bg-indigo-900/30 px-4 py-1.5 text-sm font-medium text-indigo-700 dark:text-indigo-300">
            <Zap className="h-4 w-4" />
            Features
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 dark:text-slate-100">
            Everything You Need to Run Your Mill Accounts
          </h2>
          <p className="text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
            MillDiary is designed for real business use — simple, reliable, and focused on daily financial clarity.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <FeatureCard
            icon={ClipboardCheck}
            title="Daily Entry Made Simple"
            description="Record mill credits, material usage, and expenses in a structured format every day."
            color="blue"
          />
          <FeatureCard
            icon={BarChart3}
            title="Accurate Monthly Summary"
            description="Get clear monthly totals for credits, debits, and savings without manual calculation."
            color="purple"
          />
          <FeatureCard
            icon={FileSpreadsheet}
            title="Excel Export for Accounting"
            description="Export data anytime for accountants, audits, or offline records."
            color="green"
          />
          <FeatureCard
            icon={ShieldCheck}
            title="Secure & Private Data"
            description="Your business information is protected and accessible only to you."
            color="orange"
          />
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="border-t border-b bg-linear-to-br from-slate-50 to-blue-50/30 dark:from-slate-900 dark:to-blue-950/20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 sm:py-28">
          <div className="text-center mb-16 space-y-4">
            <div className="inline-flex items-center gap-2 rounded-full bg-purple-100 dark:bg-purple-900/30 px-4 py-1.5 text-sm font-medium text-purple-700 dark:text-purple-300">
              <Users className="h-4 w-4" />
              Testimonials
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 dark:text-slate-100">
              Used by Mill Owners Across Regions
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-300">
              Feedback from businesses using MillDiary in their daily operations.
            </p>
          </div>

          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            <TestimonialCard
              name="Ramesh Patel"
              role="Flour Mill Owner"
              quote="MillDiary helped me bring discipline to my daily accounting. Monthly reports are now clear and reliable."
            />
            <TestimonialCard
              name="Suresh Verma"
              role="Oil Mill Manager"
              quote="We shifted from manual registers to MillDiary. It reduced errors and saved time every month."
            />
            <TestimonialCard
              name="Anil Sharma"
              role="Small Mill Business"
              quote="The system is simple and practical. Even staff members can use it without training."
            />
          </div>
        </div>
      </section>
    </main>
  )
}

function InfoRow({ icon: Icon, title, description } : { icon: any; title: string; description: string }) {
  return (
    <div className="flex items-start gap-4">
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-linear-to-br from-blue-500 to-indigo-500 shadow-lg shadow-blue-500/30">
        <Icon className="h-5 w-5 text-white" />
      </div>
      <div>
        <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">{title}</p>
        <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed mt-0.5">
          {description}
        </p>
      </div>
    </div>
  )
}

function FeatureCard({ icon: Icon, title, description, color } : { icon: any; title: string; description: string; color: "blue" | "purple" | "green" | "orange" }) {
  const colorClasses = {
    blue: "from-blue-500 to-blue-600 shadow-blue-500/30",
    purple: "from-purple-500 to-purple-600 shadow-purple-500/30",
    green: "from-green-500 to-green-600 shadow-green-500/30",
    orange: "from-orange-500 to-orange-600 shadow-orange-500/30"
  }

  return (
    <div className="group relative rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-8 space-y-4 transition-all hover:shadow-xl hover:shadow-slate-200/50 dark:hover:shadow-slate-900/50 hover:-translate-y-1">
      <div className={`inline-flex p-3 rounded-xl bg-linear-to-br ${colorClasses[color]} shadow-lg`}>
        <Icon className="h-6 w-6 text-white" />
      </div>
      <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">{title}</h3>
      <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
        {description}
      </p>
    </div>
  )
}

function TestimonialCard({ name, role, quote }: { name: string; role: string; quote: string }) {
  return (
    <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-8 space-y-4 shadow-lg shadow-slate-200/50 dark:shadow-slate-900/50">
      <div className="flex gap-1">
        {[...Array(5)].map((_, i) => (
          <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
        ))}
      </div>
      <p className="text-slate-600 dark:text-slate-300 leading-relaxed italic">
        &quot;{quote}&quot;
      </p>
      <div className="pt-4 border-t border-slate-200 dark:border-slate-700">
        <p className="font-semibold text-slate-900 dark:text-slate-100">{name}</p>
        <p className="text-sm text-slate-500 dark:text-slate-400">{role}</p>
      </div>
    </div>
  )
}