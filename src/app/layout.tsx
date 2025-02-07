/// app/layout.tsx
import "./globals.css";
import type { Metadata } from "next";
import { ReactQueryProvider } from "@/app/lib/react-query-provider";

export const metadata: Metadata = {
  title: "Monte Carlo App",
  description: "Persisting with TanStack Query v5",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <ReactQueryProvider>{children}</ReactQueryProvider>
      </body>
    </html>
  );
}
