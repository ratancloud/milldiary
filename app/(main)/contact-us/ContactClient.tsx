"use client";

import React, { useState } from "react";
import {
  Mail,
  Phone,
  MapPin,
  Send,
  MessageSquare,
  CheckCircle2,
  Sparkles,
  Clock,
  HelpCircle,
  ChevronDown,
  ShieldCheck,
  Building2,
  Home,
} from "lucide-react";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import toast from "react-hot-toast";

const FAQS = [
  {
    q: "Do I need high-speed internet inside the mill?",
    a: "No! Mill Diary is engineered as an offline-first Progressive Web App (PWA). You can record slips, compute grinding charges, and balance daily cash completely offline during rural network blackouts. All data automatically syncs once connectivity resumes.",
  },
  {
    q: "Can my staff use the system in Hindi?",
    a: "Yes! Mill Diary features instant phonetic transliteration. When your staff types 'Ramesh Rampur' in English letters, the system automatically suggests 'रमेश - रामपुर' and autocompletes the farmer's village profile.",
  },
  {
    q: "How does the AI Slip OCR work?",
    a: "You can snap a photo of any handwritten paper slip or weighing chit with your phone camera. Our AI model extracts the customer name, grain type (Wheat, Mustard, etc.), and weight in kilograms in under 1.5 seconds.",
  },
  {
    q: "How do I export records for accounting and tax filing?",
    a: "With a single click on the Ledger or Dashboard page, you can download clean, audit-ready Excel spreadsheets with daily credit, debit, and crop totals formatted for accountants.",
  },
];

export default function ContactClient() {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    millName: "",
    millType: "flour",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [expandedFaq, setExpandedFaq] = useState<number | null>(0);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim() || !formData.phone.trim()) {
      toast.error("Please fill in your name and phone number.");
      return;
    }

    setIsSubmitting(true);

    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false);
      toast.success("Thank you! A Mill Diary specialist will reach out within 4 hours.");
      setFormData({
        name: "",
        phone: "",
        email: "",
        millName: "",
        millType: "flour",
        message: "",
      });
    }, 1200);
  };

  return (
    <main className="min-h-screen bg-background text-foreground selection:bg-primary selection:text-primary-foreground">

      {/* 1. Hero Header */}
      <section className="relative overflow-hidden pt-24 pb-16 sm:pt-32 sm:pb-24 border-b border-border/70 bg-background">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(39,35,32,0.04)_1px,transparent_1px),linear-gradient(to_bottom,rgba(39,35,32,0.04)_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-size-[36px_36px]" />
          <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-[550px] h-[350px] rounded-full bg-primary/15 blur-[120px]" />
        </div>

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-6">
          <div className="text-center space-y-5">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/25 bg-primary/10 px-4 py-1.5 text-xs font-semibold text-primary">
              <MessageSquare className="h-3.5 w-3.5" />
              <span>Support & Mill Setup Assistance</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-foreground leading-[1.15]">
              We&apos;re Here for <br className="hidden sm:inline" />
              <span className="text-primary underline decoration-primary/30 decoration-wavy decoration-2">
                India&apos;s Mill Operators
              </span>
            </h1>

            <p className="max-w-2xl mx-auto text-base sm:text-lg text-muted-foreground leading-relaxed">
              Need help onboarding your mill, configuring regional grain deduction rules (katauti), or deploying Mill Diary on your team&apos;s devices? Get in touch today.
            </p>
          </div>
        </div>
      </section>

      {/* 2. Contact Channel Cards */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 -mt-6 relative z-10">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">

          {/* Card 1: Phone / WhatsApp */}
          <div className="rounded-2xl border border-border/80 bg-card p-6 shadow-[var(--card-shadow)] hover:shadow-[var(--card-hover-shadow)] transition-all flex flex-col items-center text-center space-y-3">
            <div className="h-12 w-12 rounded-xl bg-primary/15 text-primary flex items-center justify-center">
              <Phone className="h-6 w-6" />
            </div>
            <div>
              <h3 className="font-bold text-foreground text-base">Call & WhatsApp</h3>
              <p className="text-xs text-muted-foreground mt-0.5">Mon–Sat: 8:00 AM – 7:00 PM IST</p>
              <div className="text-sm font-bold text-primary font-mono mt-1">+91 93041 23456</div>
            </div>
          </div>

          {/* Card 2: Email */}
          <div className="rounded-2xl border border-border/80 bg-card p-6 shadow-[var(--card-shadow)] hover:shadow-[var(--card-hover-shadow)] transition-all flex flex-col items-center text-center space-y-3">
            <div className="h-12 w-12 rounded-xl bg-primary/15 text-primary flex items-center justify-center">
              <Mail className="h-6 w-6" />
            </div>
            <div>
              <h3 className="font-bold text-foreground text-base">Email Support</h3>
              <p className="text-xs text-muted-foreground mt-0.5">Average response under 4 hours</p>
              <div className="text-sm font-bold text-primary font-mono mt-1">support@milldiary.com</div>
            </div>
          </div>

          {/* Card 3: Location */}
          <div className="rounded-2xl border border-border/80 bg-card p-6 shadow-[var(--card-shadow)] hover:shadow-[var(--card-hover-shadow)] transition-all flex flex-col items-center text-center space-y-3">
            <div className="h-12 w-12 rounded-xl bg-primary/15 text-primary flex items-center justify-center">
              <MapPin className="h-6 w-6" />
            </div>
            <div>
              <h3 className="font-bold text-foreground text-base">Operations Hub</h3>
              <p className="text-xs text-muted-foreground mt-0.5">Grain Belt Regional Center</p>
              <div className="text-sm font-semibold text-foreground mt-1">Patna, Bihar, India</div>
            </div>
          </div>

        </div>
      </section>

      {/* 3. Main Form & FAQ Layout */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">

          {/* Left Column: Contact Form (7 cols) */}
          <div className="lg:col-span-7 rounded-3xl border border-border/80 bg-card p-6 sm:p-10 shadow-[var(--card-shadow)] space-y-6">
            <div>
              <Badge variant="accent" className="text-xs font-semibold">Direct Message</Badge>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground mt-2">
                Send Us an Inquiry
              </h2>
              <p className="text-sm text-muted-foreground mt-1">
                Fill out the details below and a dedicated mill workflow consultant will connect with you.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="name" className="text-xs font-semibold">
                    Full Name <span className="text-primary">*</span>
                  </Label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="e.g. Ramesh Patel"
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="phone" className="text-xs font-semibold">
                    Phone / WhatsApp <span className="text-primary">*</span>
                  </Label>
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="e.g. 98765 43210"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="email" className="text-xs font-semibold">
                    Email Address (Optional)
                  </Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="e.g. ramesh@patelmill.com"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="millName" className="text-xs font-semibold">
                    Mill Name & City
                  </Label>
                  <Input
                    id="millName"
                    name="millName"
                    value={formData.millName}
                    onChange={handleChange}
                    placeholder="e.g. Patel Chakki, Dewas"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="millType" className="text-xs font-semibold">
                  Mill Operations Type
                </Label>
                <Select
                  value={formData.millType}
                  onValueChange={(value) =>
                    setFormData((prev) => ({ ...prev, millType: value }))
                  }
                >
                  <SelectTrigger id="millType" className="w-full">
                    <SelectValue placeholder="Select type of mill" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="flour">Flour Mill (Aata Chakki)</SelectItem>
                    <SelectItem value="oil">Mustard Oil Expeller (Sarso Kolhu)</SelectItem>
                    <SelectItem value="multi">Combined Multi-Crop Mill</SelectItem>
                    <SelectItem value="support">Technical Support for Existing User</SelectItem>
                    <SelectItem value="feature">Custom Feature / Regional Request</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="message" className="text-xs font-semibold">
                  How can we help your mill?
                </Label>
                <Textarea
                  id="message"
                  name="message"
                  rows={4}
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Tell us about your daily grinding capacity, staff count, or specific requirements..."
                  className="resize-none"
                />
              </div>

              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full sm:w-auto px-8 py-3 text-sm font-semibold gap-2 shadow-[0_4px_16px_rgba(166,83,46,0.25)]"
              >
                {isSubmitting ? (
                  "Transmitting..."
                ) : (
                  <>
                    <Send className="h-4 w-4" />
                    <span>Send Message</span>
                  </>
                )}
              </Button>
            </form>
          </div>

          {/* Right Column: Quick FAQs (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            <div>
              <Badge variant="secondary" className="text-xs font-semibold">Quick Answers</Badge>
              <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground mt-2">
                Frequently Asked Questions
              </h3>
              <p className="text-xs text-muted-foreground mt-1">
                Immediate answers to common questions about running Mill Diary.
              </p>
            </div>

            <div className="space-y-3">
              {FAQS.map((faq, index) => {
                const isExpanded = expandedFaq === index;
                return (
                  <div
                    key={index}
                    className="rounded-xl border border-border/80 bg-card overflow-hidden transition-all shadow-2xs"
                  >
                    <button
                      onClick={() => setExpandedFaq(isExpanded ? null : index)}
                      className="w-full p-4 text-left flex items-center justify-between gap-3 select-none cursor-pointer hover:bg-secondary/30 transition-colors"
                    >
                      <span className="text-sm font-bold text-foreground flex items-center gap-2">
                        <HelpCircle className="h-4 w-4 text-primary shrink-0" />
                        {faq.q}
                      </span>
                      <ChevronDown
                        className={`h-4 w-4 text-muted-foreground shrink-0 transition-transform duration-200 ${isExpanded ? "rotate-180 text-primary" : ""
                          }`}
                      />
                    </button>
                    {isExpanded && (
                      <div className="px-4 pb-4 pt-1 text-xs text-muted-foreground leading-relaxed border-t border-border/50">
                        {faq.a}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Direct WhatsApp Callout */}
            <div className="p-5 rounded-2xl border border-primary/30 bg-primary/5 space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-primary">
                <Sparkles className="h-4 w-4" />
                <span>Need immediate guidance right now?</span>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Connect directly with our mill onboarding specialists on WhatsApp for a 5-minute interactive walkthrough.
              </p>
              <div className="pt-1">
                <a
                  href="https://wa.me/919304123456"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-primary hover:underline"
                >
                  <span>Chat on WhatsApp (+91 93041 23456)</span>
                  <span>→</span>
                </a>
              </div>
            </div>

          </div>

        </div>
      </section>

    </main>
  );
}
