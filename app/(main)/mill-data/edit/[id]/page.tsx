import type { Metadata } from "next";
import EditMillDataClient from "./EditMillDataClient";

export const metadata: Metadata = {
  title: "Edit Entry",
  description: "Edit and update an existing mill data entry",
};

export default function EditMillDataPage() {
  return <EditMillDataClient />;
}
