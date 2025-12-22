import CreateMillDataClient from "./CreateMillDataClient";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "New Entry",
  description: "Create a new mill data entry",
};

export default function CreateMillDataPage() {
  return <CreateMillDataClient />;
}
