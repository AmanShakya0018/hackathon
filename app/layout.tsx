import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Provider from "@/provider/provider";
import { Toaster } from "@/components/ui/toaster";
import { Analytics } from "@vercel/analytics/react"
import { cn } from "@/lib/utils";

const inter = Inter({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "TranslatorAI - Create LinkedIn and Twitter Posts",
  description: "Generate professional LinkedIn and Twitter posts with ease. Enhance your social media presence with customized content."
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning={true}>
      <body
        className={`${inter.className}  h-screen bg-white dark:bg-black antialiased`}
      >
        <Provider>
          <div className={cn("relative flex min-h-dvh flex-col")}>
            <main className="flex-1 px-6">{children}</main>
            <Toaster />
          </div>
        </Provider>
        <Analytics />
      </body>
    </html>
  );
}
