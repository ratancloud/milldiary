"use client";
import { useState } from "react";
import { Mail, Phone, MapPin, Send, MessageSquare } from "lucide-react";
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
import toast from "react-hot-toast";

export const metadata = {
  title: "About",
};

export default function ContactClient() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: any) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = () => {
    setIsSubmitting(true);

    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false);
      toast.success("Message sent successfully! We,ll be in touch soon.")
      setFormData({
        name: "",
        email: "",
        company: "",
        subject: "",
        message: "",
      });
    }, 1500);
  };

  return (
    <main className="min-h-screen bg-linear-to-b from-slate-50 to-white dark:from-slate-950 dark:to-slate-900">
      {/* Hero Header */}
      <section className="relative overflow-hidden border-b bg-linear-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-blue-950/30 dark:via-indigo-950/30 dark:to-purple-950/30">
        <div className="absolute inset-0 bg-grid-slate-200/50 dark:bg-grid-slate-800/50 mask-[linear-gradient(0deg,transparent,black)]"></div>
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 sm:py-28">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 rounded-full bg-blue-100 dark:bg-blue-900/50 px-4 py-1.5 text-sm font-medium text-blue-700 dark:text-blue-300 mb-6">
              <MessageSquare className="h-4 w-4" />
              We&apos;re Here to Help
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight bg-linear-to-r from-slate-900 via-blue-900 to-indigo-900 dark:from-slate-100 dark:via-blue-100 dark:to-indigo-100 bg-clip-text text-transparent">
              Get in Touch
            </h1>
            <p className="mt-6 max-w-2xl mx-auto text-lg sm:text-xl text-slate-600 dark:text-slate-300 leading-relaxed">
              Have questions about MillDiary? We&apos;d love to hear from you.
              Send us a message and we&apos;ll respond as soon as possible.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Info Cards */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 -mt-8 relative z-10">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg shadow-slate-200/50 dark:shadow-slate-900/50 p-6 border border-slate-200 dark:border-slate-700">
            <div className="flex flex-col items-center text-center gap-3">
              <div className="p-3 rounded-xl bg-blue-100 dark:bg-blue-900/30">
                <Mail className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <div className="font-semibold text-slate-900 dark:text-slate-100">
                  Email Us
                </div>
                <div className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                  support@milldiary.com
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg shadow-slate-200/50 dark:shadow-slate-900/50 p-6 border border-slate-200 dark:border-slate-700">
            <div className="flex flex-col items-center text-center gap-3">
              <div className="p-3 rounded-xl bg-purple-100 dark:bg-purple-900/30">
                <Phone className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <div className="font-semibold text-slate-900 dark:text-slate-100">
                  Call Us
                </div>
                <div className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                  +91 371234567
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg shadow-slate-200/50 dark:shadow-slate-900/50 p-6 border border-slate-200 dark:border-slate-700">
            <div className="flex flex-col items-center text-center gap-3">
              <div className="p-3 rounded-xl bg-green-100 dark:bg-green-900/30">
                <MapPin className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <div className="font-semibold text-slate-900 dark:text-slate-100">
                  Visit Us
                </div>
                <div className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                  Patna,Bihar
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Form */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20">
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl shadow-slate-200/50 dark:shadow-slate-900/50 border border-slate-200 dark:border-slate-700 p-8 sm:p-10">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-slate-100 mb-2">
            Send us a Message
          </h2>
          <p className="text-slate-600 dark:text-slate-300 mb-8">
            Fill out the form below and we&apos;ll get back to you within 24
            hours.
          </p>

          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <Label className="mb-2 block">Full Name *</Label>
                <Input
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="John Doe"
                />
              </div>

              <div>
                <Label className="mb-2 block">Email Address *</Label>
                <Input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="john@company.com"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <Label className="mb-2 block">Company Name</Label>
                <Input
                  name="company"
                  value={formData.company}
                  onChange={handleChange}
                  placeholder="Company Inc."
                />
              </div>

              <div>
                <Label className="mb-2 block">Subject *</Label>
                <Select
                  value={formData.subject}
                  onValueChange={(value) =>
                    setFormData((prev) => ({ ...prev, subject: value }))
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select a subject" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="general">General Inquiry</SelectItem>
                    <SelectItem value="support">Technical Support</SelectItem>
                    <SelectItem value="sales">Sales Question</SelectItem>
                    <SelectItem value="partnership">Partnership</SelectItem>
                    <SelectItem value="feedback">Feedback</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label className="mb-2 block">Message *</Label>
              <Textarea
                name="message"
                rows={6}
                value={formData.message}
                onChange={handleChange}
                placeholder="Tell us how we can help..."
                className="resize-none"
              />
            </div>

            <Button onClick={handleSubmit} disabled={isSubmitting}>
              {isSubmitting ? (
                "Sending..."
              ) : (
                <>
                  <Send className="h-5 w-5" />
                  Send Message
                </>
              )}
            </Button>
          </div>
        </div>
      </section>
    </main>
  );
}
