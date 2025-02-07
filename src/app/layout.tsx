// app/layout.tsx
import "./globals.css";
import { ReactQueryProvider } from "@/app/lib/react-query-provider";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "My Monte Carlo App",
  description: "Persist state with React Query",
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
