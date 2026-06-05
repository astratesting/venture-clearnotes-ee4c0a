import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "ClearNotes | AI-Powered Meeting Summaries for Project Managers",
  description: "Save 2-3 hours weekly with ClearNotes. AI-driven action item extraction tailored for project management. Integrates with Asana and Trello. Focus on deliverables, not documentation.",
  keywords: ["meeting summaries", "project management", "AI action items", "Asana integration", "Trello integration", "meeting notes"],
  authors: [{ name: "Venture" }],
  openGraph: {
    title: "ClearNotes | AI-Powered Meeting Summaries",
    description: "Save 2-3 hours weekly with AI-driven action item extraction for project managers.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="antialiased font-sans">
        {children}
      </body>
    </html>
  );
}
