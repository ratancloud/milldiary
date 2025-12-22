import type { Metadata } from "next";
import ContactClient from "./ContactClient";

export const metadata: Metadata = {
  title: "Contact Us",
  description: "Get in touch with the Mill Diary team for support, sales, or general inquiries",
};

export default function ContactPage() {
  return <ContactClient />;
}
