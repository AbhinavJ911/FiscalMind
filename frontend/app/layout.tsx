import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Sidebar } from "@/components/Sidebar";
import { Header } from "@/components/Header";
import { ChatProvider } from "@/context/ChatContext";
import { UIProvider } from "@/context/UIContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "FiscalMind - Government Financial Intelligence",
  description: "Advanced analytics for Indian Union Budget data",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} min-h-screen bg-background antialiased overflow-hidden`}>
        <UIProvider>
          <ChatProvider>
            <div className="flex h-screen">
              <Sidebar />
              <div className="flex flex-1 flex-col overflow-hidden">
                <Header />
                <main className="flex-1 overflow-y-auto p-6 scroll-smooth">
                  {children}
                </main>
              </div>
            </div>
          </ChatProvider>
        </UIProvider>
      </body>
    </html>
  );
}
