import type { Metadata } from "next";
import "./globals.css";
export const metadata: Metadata = {
  title: "Ascend — Every Achievement Counts",
  description: "A school achievement platform celebrating learning, effort, and growth."
};
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
