import type { Metadata } from "next";
import DashboardClient from "./DashboardClient";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Overview and insights for managing mill data",
};

export default function DashboardPage() {
  return <DashboardClient />;
}
