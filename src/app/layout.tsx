import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Providers } from "@/components/providers";
import { DemoPill } from "@/components/demo-pill";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://corelane.demo"),
  title: {
    default: "Corelane — Operate every lane",
    template: "%s · Corelane",
  },
  description:
    "A fictional SaaS demo unifying bookings, billing, and support across public, customer, and admin surfaces.",
  openGraph: {
    type: "website",
    siteName: "Corelane",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased`}>
        <Providers>
          {children}
          <DemoPill />
        </Providers>
      </body>
    </html>
  );
}
