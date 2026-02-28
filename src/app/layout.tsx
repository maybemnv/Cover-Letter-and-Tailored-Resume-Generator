import type { Metadata } from "next";
import { Inter, DM_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter-var",
});

const dmMono = DM_Mono({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  variable: "--font-dm-mono-var",
});

export const metadata: Metadata = {
  title: "ResumeAI — Cover Letter & Resume Tailor",
  description:
    "AI-powered resume analysis, cover letter generation, and quick improvement tips using Groq.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${dmMono.variable} antialiased`}
    >
      <body>{children}</body>
    </html>
  );
}
