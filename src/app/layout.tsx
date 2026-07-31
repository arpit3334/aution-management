import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Sidebar } from "@/components/ui/Sidebar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "e-Auction Dashboard",
  description: "NetSingularity e-Auction Platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="h-full flex overflow-hidden text-slate-900">
        <Sidebar />
        <div className="flex-1 flex flex-col min-w-0">
          <header className="h-[52px] bg-white border-b border-slate-200 flex items-center justify-between px-5 shrink-0 z-10">
            <div>
              <div className="text-[14px] font-semibold text-slate-900">e-Auction dashboard</div>
              <div className="text-[11.5px] text-slate-500">Procurement › e-Auction</div>
            </div>
            <div className="flex items-center gap-2.5">
              <div className="text-[12.5px] text-slate-500">NetSingularity · FY2025</div>
              <div className="w-7 h-7 rounded-full bg-slate-900 flex items-center justify-center text-[11px] font-semibold text-white">
                SJ
              </div>
            </div>
          </header>
          <main className="flex-1 overflow-y-auto bg-slate-50">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
