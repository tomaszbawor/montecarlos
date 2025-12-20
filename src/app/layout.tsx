/// app/layout.tsx
import "./globals.css";
import { RegistryProvider } from "@effect-atom/atom-react/RegistryContext";
import type { Metadata } from "next";
import { AppShell } from "@/app/app-shell";

export const metadata: Metadata = {
  title: "Monte Carlo App",
  description: "",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <RegistryProvider>
          <AppShell>{children}</AppShell>
        </RegistryProvider>
      </body>
    </html>
  );
}
