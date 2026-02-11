import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Link from 'next/link';

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "Workflow Builder Lite",
  description: "A premium tool to build and run simple text workflows.",
};

function Header() {
  return (
    <header className="border-b border-white/10 bg-[#020617]/80 backdrop-blur-xl sticky top-0 z-50 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2 group cursor-pointer">
          <div className="h-8 w-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold text-lg shadow-[0_0_15px_rgba(99,102,241,0.5)] transition-transform group-hover:scale-110">
            W
          </div>
          <span className="font-bold text-xl tracking-tight text-white group-hover:text-indigo-400 transition-colors">Workflow Lite</span>
        </div>
        <nav className="flex items-center gap-6">
          <Link href="/" className="text-sm font-medium text-slate-400 hover:text-white transition-colors hover:bg-white/5 px-3 py-1.5 rounded-full">
            Builder
          </Link>
          <Link href="/history" className="text-sm font-medium text-slate-400 hover:text-white transition-colors hover:bg-white/5 px-3 py-1.5 rounded-full">
            History
          </Link>
          <Link href="/status" className="text-sm font-medium text-slate-400 hover:text-white transition-colors hover:bg-white/5 px-3 py-1.5 rounded-full">
            Status
          </Link>
        </nav>
      </div>
    </header>
  );
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} font-sans min-h-screen bg-background text-foreground antialiased selection:bg-indigo-500/30 selection:text-indigo-200 overflow-y-scroll`}>
        {/* Premium Dark Background */}
        <div className="fixed inset-0 -z-10 h-full w-full bg-[#020617]"></div>
        <div className="fixed inset-0 -z-10 h-full w-full bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:16px_16px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-20"></div>
        {/* Ambient Glows */}
        <div className="fixed top-0 left-0 w-full h-[500px] bg-gradient-to-b from-indigo-500/10 via-transparent to-transparent -z-10 blur-3xl"></div>
        <div className="fixed bottom-[-10%] right-[-10%] w-[500px] h-[500px] rounded-full bg-purple-500/10 blur-[128px] -z-10"></div>

        <Header />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-in fade-in slide-in-from-bottom-2 duration-700">
          {children}
        </main>
      </body>
    </html>
  );
}
