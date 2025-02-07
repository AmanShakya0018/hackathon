import { cn } from "@/lib/utils";
import { Toaster } from "@/components/ui/toaster";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <div className={cn("relative flex min-h-dvh flex-col max-w-full mx-auto")}>
        <div className="flex flex-row">
          <main className="flex-1 px-6 max-w-5xl mx-auto">{children}</main>
        </div>
        <Toaster />
      </div>
    </>
  );
}