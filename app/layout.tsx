import type { Metadata } from "next";
import { Hind_Siliguri, Noto_Sans_Bengali, Space_Grotesk } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";

const hindSiliguri = Hind_Siliguri({
  variable: "--font-hind-siliguri",
  subsets: ["bengali", "latin"],
  weight: ["500", "600", "700"],
});

const notoBengali = Noto_Sans_Bengali({
  variable: "--font-noto-bengali",
  subsets: ["bengali", "latin"],
  weight: ["400", "500", "600"],
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

export const metadata: Metadata = {
  title: "কাজকরো | KajKoro — ছোট কাজ, বড় ভরসা",
  description:
    "ঘণ্টাভিত্তিক ছোট কাজের জন্য যাচাইকৃত কর্মী খুঁজুন, অথবা নিজের সময় অনুযায়ী কাজ করে আয় করুন।",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="bn">
      <body
        className={`${hindSiliguri.variable} ${notoBengali.variable} ${spaceGrotesk.variable} antialiased`}
      >
        <div className="rickshaw-strip" />
        <Navbar />
        <main>{children}</main>
      </body>
    </html>
  );
}
