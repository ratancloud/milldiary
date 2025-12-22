import { Briefcase, LineChart, ShieldCheck, TrendingUp, Users, Zap } from "lucide-react"

export const metadata = {
  title: "About"
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-linear-to-b from-slate-50 to-white dark:from-slate-950 dark:to-slate-900">
      {/* Hero Header with Gradient */}
      <section className="relative overflow-hidden border-b bg-linear-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-blue-950/30 dark:via-indigo-950/30 dark:to-purple-950/30">
        <div className="absolute inset-0 bg-grid-slate-200/50 dark:bg-grid-slate-800/50 mask-[linear-gradient(0deg,transparent,black)]"></div>
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 sm:py-28">
          <div className="inline-flex items-center gap-2 rounded-full bg-blue-100 dark:bg-blue-900/50 px-4 py-1.5 text-sm font-medium text-blue-700 dark:text-blue-300 mb-6">
            <Zap className="h-4 w-4" />
            Modern Expense Management
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight bg-linear-to-r from-slate-900 via-blue-900 to-indigo-900 dark:from-slate-100 dark:via-blue-100 dark:to-indigo-100 bg-clip-text text-transparent">
            About MillDiary
          </h1>
          <p className="mt-6 max-w-3xl text-lg sm:text-xl text-slate-600 dark:text-slate-300 leading-relaxed">
            A modern expense management solution built to help business owners and teams maintain accurate financial records, monitor spending, and make informed decisions with confidence.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
              <div className="h-2 w-2 rounded-full bg-green-500"></div>
              Trusted by 500+ businesses
            </div>
            <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
              <div className="h-2 w-2 rounded-full bg-blue-500"></div>
              99.9% uptime
            </div>
            <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
              <div className="h-2 w-2 rounded-full bg-purple-500"></div>
              Bank-level security
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 -mt-8 relative z-10">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg shadow-slate-200/50 dark:shadow-slate-900/50 p-6 border border-slate-200 dark:border-slate-700">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-blue-100 dark:bg-blue-900/30">
                <TrendingUp className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <div className="text-2xl font-bold text-slate-900 dark:text-slate-100">$10M+</div>
                <div className="text-sm text-slate-600 dark:text-slate-400">Tracked Monthly</div>
              </div>
            </div>
          </div>
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg shadow-slate-200/50 dark:shadow-slate-900/50 p-6 border border-slate-200 dark:border-slate-700">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-purple-100 dark:bg-purple-900/30">
                <Users className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <div className="text-2xl font-bold text-slate-900 dark:text-slate-100">5,000+</div>
                <div className="text-sm text-slate-600 dark:text-slate-400">Active Users</div>
              </div>
            </div>
          </div>
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg shadow-slate-200/50 dark:shadow-slate-900/50 p-6 border border-slate-200 dark:border-slate-700">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-green-100 dark:bg-green-900/30">
                <ShieldCheck className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <div className="text-2xl font-bold text-slate-900 dark:text-slate-100">100%</div>
                <div className="text-sm text-slate-600 dark:text-slate-400">Data Security</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">

          {/* Left Column */}
          <div className="space-y-8">
            <div>
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
                What We Do
              </h2>
              <div className="mt-2 h-1 w-20 bg-linear-to-r from-blue-600 to-indigo-600 rounded-full"></div>
            </div>
            
            <p className="text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
              MillDiary enables businesses to systematically record, categorize, and analyze their day-to-day expenses. The platform is designed for clarity and ease of use, allowing organizations to reduce manual errors and maintain transparent financial documentation.
            </p>
            
            <p className="text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
              Whether managing operational costs or reviewing historical spending patterns, MillDiary provides the tools needed to stay organized and financially disciplined.
            </p>

            <div className="pt-4">
              <button className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-linear-to-r from-blue-600 to-indigo-600 text-white font-medium hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40">
                Get Started Today
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>

          {/* Right Column - Feature Cards */}
          <div className="space-y-5">
            <div className="group relative overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-7 transition-all hover:shadow-xl hover:shadow-slate-200/50 dark:hover:shadow-slate-900/50 hover:-translate-y-1">
              <div className="absolute top-0 right-0 w-32 h-32 bg-linear-to-br from-blue-500/10 to-transparent rounded-full -mr-16 -mt-16"></div>
              <div className="relative flex items-start gap-4">
                <div className="shrink-0 p-3 rounded-xl bg-linear-to-br from-blue-500 to-blue-600 shadow-lg shadow-blue-500/30">
                  <Briefcase className="h-6 w-6 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-2">
                    Designed for Businesses
                  </h3>
                  <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                    Built with real business workflows in mind, from small enterprises to growing organizations. Scalable and adaptable to your needs.
                  </p>
                </div>
              </div>
            </div>

            <div className="group relative overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-7 transition-all hover:shadow-xl hover:shadow-slate-200/50 dark:hover:shadow-slate-900/50 hover:-translate-y-1">
              <div className="absolute top-0 right-0 w-32 h-32 bg-linear-to-br from-purple-500/10 to-transparent rounded-full -mr-16 -mt-16"></div>
              <div className="relative flex items-start gap-4">
                <div className="shrink-0 p-3 rounded-xl bg-linear-to-br from-purple-500 to-purple-600 shadow-lg shadow-purple-500/30">
                  <LineChart className="h-6 w-6 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-2">
                    Clear Financial Insights
                  </h3>
                  <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                    Gain better visibility into expenses through structured data and easy-to-understand summaries. Make data-driven decisions.
                  </p>
                </div>
              </div>
            </div>

            <div className="group relative overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-7 transition-all hover:shadow-xl hover:shadow-slate-200/50 dark:hover:shadow-slate-900/50 hover:-translate-y-1">
              <div className="absolute top-0 right-0 w-32 h-32 bg-linear-to-br from-green-500/10 to-transparent rounded-full -mr-16 -mt-16"></div>
              <div className="relative flex items-start gap-4">
                <div className="shrink-0 p-3 rounded-xl bg-linear-to-br from-green-500 to-green-600 shadow-lg shadow-green-500/30">
                  <ShieldCheck className="h-6 w-6 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-2">
                    Accuracy & Reliability
                  </h3>
                  <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                    Focused on data consistency, security, and long-term reliability. Your financial data is always safe and accurate.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}