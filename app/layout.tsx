// app/layout.tsx
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "StrataHelix",
  description: "DNA-powered wellness intelligence platform",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-[#0B1014] text-[#F9FAFB] antialiased">
        <div className="min-h-screen flex flex-col">
          <header className="border-b border-[#1F2933]">
            <div className="mx-auto max-w-6xl px-4 py-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                {/* Simple logo placeholder */}
                <div className="h-8 w-8 rounded-md bg-gradient-to-b from-[#27E0C0] to-[#2563EB] flex items-center justify-center">
                  <span className="text-xs font-semibold">SH</span>
                </div>
                <span className="font-semibold tracking-tight">StrataHelix</span>
              </div>
              <nav className="flex items-center gap-6 text-sm text-[#9CA3AF]">
                <a href="/" className="hover:text-[#F9FAFB] transition">
                  Home
                </a>
                <a href="/pricing" className="hover:text-[#F9FAFB] transition">
                  Pricing
                </a>
                <a href="/upload" className="hover:text-[#F9FAFB] transition">
                  Upload DNA
                </a>
              </nav>
            </div>
          </header>
          <main className="flex-1">{children}</main>
          <footer className="border-t border-[#1F2933] mt-12">
            <div className="mx-auto max-w-6xl px-4 py-6 text-xs text-[#6B7280] flex flex-wrap justify-between gap-2">
              <span>© {new Date().getFullYear()} StrataHelix. All rights reserved.</span>
              <span>Educational only · Not medical advice.</span>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}
