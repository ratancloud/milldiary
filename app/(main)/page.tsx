import { Metadata } from "next";
import { HeroSection } from "@/components/landing/HeroSection";
import { InteractiveSvgWorkflow } from "@/components/landing/InteractiveSvgWorkflow";
import { BentoFeatures } from "@/components/landing/BentoFeatures";
import { LiveMillCalculator } from "@/components/landing/LiveMillCalculator";
import { TestimonialsSection } from "@/components/landing/TestimonialsSection";
import { CtaSection } from "@/components/landing/CtaSection";

export const metadata: Metadata = {
  title: "Mill Diary | Modern Operating System & Grinding Ledger for Flour & Oil Mills",
  description:
    "Organize daily grinding slips, eliminate manual register math, track accurate wheat and mustard yields, and separate mill expenses from personal debits with MillDiary.",
};

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-background text-foreground selection:bg-primary selection:text-primary-foreground">
      {/* 1. Hero Section */}
      <HeroSection />

      {/* 2. Star Interactive SVG Engine Walkthrough */}
      <div id="interactive-workflow">
        <InteractiveSvgWorkflow />
      </div>

      {/* 3. Bento Features Grid */}
      <BentoFeatures />

      {/* 4. Interactive Live ROI & Yield Estimator */}
      <LiveMillCalculator />

      {/* 5. Authentic Mill Owner Testimonials */}
      <TestimonialsSection />

      {/* 6. Closing High-Conversion CTA Banner */}
      <CtaSection />
    </main>
  );
}