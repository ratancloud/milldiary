import type { Metadata } from "next";
import MillDataClient from "./MillDataClient";

export const metadata: Metadata = {
  title: "Monthly Data",
  description: "Monthly mill data, credits, debits, and financial summaries",
};

export default function MillDataPage() {
  return <MillDataClient />;
}
