import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "BA Coach Pro — Your Personal Business Analyst Coach",
  description:
    "A full-scale AI business analyst coach and educator: 53 coached BA techniques, guided learning tracks, exam-style quizzes, flashcards, a live stakeholder interview simulator with voice, and Harvard-style case discussions. Built with Z.ai GLM.",
  keywords: [
    "business analyst",
    "BA coach",
    "business analysis",
    "AI tutor",
    "requirements engineering",
    "CBAP",
    "PMI-PBA",
    "elicitation",
    "Z.ai",
    "GLM",
  ],
  authors: [{ name: "Roman — rommark.dev" }],
  metadataBase: new URL("https://ba-coach-pro.vercel.app"),
  openGraph: {
    title: "BA Coach Pro — Learn Business Analysis with an AI Coach",
    description:
      "53 BA techniques coached step-by-step, voice interviews, case-method classroom, quizzes and flashcards.",
    siteName: "BA Coach Pro",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "BA Coach Pro",
    description: "Your personal AI Business Analyst coach — study, practise, deliver.",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#1a2026" },
    { media: "(prefers-color-scheme: light)", color: "#fafcfc" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
