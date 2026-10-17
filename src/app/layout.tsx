import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "MIR RAJ | Tech Store Bangladesh",
  description: "Shop tech essentials, mobile accessories and smart gadgets at MIR RAJ Bangladesh.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="bn"><body>{children}</body></html>;
}
