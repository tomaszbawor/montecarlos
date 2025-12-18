/// app/layout.tsx
import "./globals.css";
import type { Metadata } from "next";
import { AtomProvider } from "@/app/lib/atom-provider";

export const metadata: Metadata = {
  title: "Monte Carlo App",
  description: "State managed with Effect atoms",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <AtomProvider>{children}</AtomProvider>
      </body>
    </html>
  );
}
