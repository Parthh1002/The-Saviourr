import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/navbar";
import { QuickActionPanel } from "@/components/QuickActionPanel";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "THE SAVIOUR | AI Wildlife Protection",
  description: "AI-Based Wild Animal Hunting Detection & Anti-Poaching Surveillance System",
};

import { SystemProvider } from "@/components/saviour/SystemProvider";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning style={{ colorScheme: 'light' }}>
      <head>
        <meta name="color-scheme" content="light only" />
      </head>
      <body className={`${inter.variable} antialiased min-h-screen flex flex-col bg-background text-foreground`} suppressHydrationWarning>
        <SystemProvider>
          <Navbar />
          {children}
          <QuickActionPanel />
        </SystemProvider>
      </body>
    </html>
  );
}
