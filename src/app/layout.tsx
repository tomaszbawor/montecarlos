/// app/layout.tsx
import "./globals.css";
import { RegistryProvider } from "@effect-atom/atom-react/RegistryContext";
import type { Metadata } from "next";

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
        <RegistryProvider>{children}</RegistryProvider>
      </body>
    </html>
  );
}
