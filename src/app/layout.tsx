import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { Toaster } from "sonner";
import { SupabaseProvider } from "@/components/providers/supabase-provider";
import { RealtimeProductsProvider } from "@/components/providers/realtime-products-provider";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { Footer } from "@/components/layout/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "DevCircuit | High-Performance Gear for Developers",
  description: "Premium mechanical keyboards, ergonomic mice, and desk accessories for coding setups.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <SupabaseProvider>
          <RealtimeProductsProvider>
            <ThemeProvider
              attribute="class"
              defaultTheme="dark"
              enableSystem
              disableTransitionOnChange
            >
              <Navbar />
              <main className="min-h-screen pb-16 md:pb-0">
                {children}
              </main>
              <Footer />
            </ThemeProvider>
          </RealtimeProductsProvider>
        </SupabaseProvider>
        <Toaster position="top-right" richColors />
      </body>
    </html>
  );
}
