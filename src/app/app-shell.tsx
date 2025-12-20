"use client";

import { BarChart3, FileIcon, Home, Menu } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import * as React from "react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

type NavItem = {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
};

const NAV_ITEMS: readonly NavItem[] = [
  { href: "/", label: "Monte Carlo", icon: Home },
  { href: "/distributions", label: "Distributions", icon: BarChart3 },
  { href: "/csv-import", label: "Import Tasks from Csv File", icon: FileIcon },
] as const;

function NavList({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();

  return (
    <nav className="grid gap-1 p-2">
      {NAV_ITEMS.map((item) => {
        const Icon = item.icon;
        const isActive =
          pathname === item.href ||
          (item.href !== "/" && pathname.startsWith(`${item.href}/`));

        return (
          <Button
            key={item.href}
            asChild
            variant={isActive ? "secondary" : "ghost"}
            className={cn("justify-start gap-2", isActive && "font-semibold")}
            onClick={onNavigate}
          >
            <Link href={item.href}>
              <Icon className="h-4 w-4" />
              {item.label}
            </Link>
          </Button>
        );
      })}
    </nav>
  );
}

function DesktopSidebar() {
  return (
    <aside className="hidden md:flex md:w-64 md:flex-col md:border-r md:bg-background">
      <div className="px-4 py-4">
        <div className="text-sm font-semibold">Montecarlos</div>
        <div className="text-xs text-muted-foreground">
          Monte Carlo playground
        </div>
      </div>
      <Separator />
      <ScrollArea className="flex-1">
        <NavList />
      </ScrollArea>
    </aside>
  );
}

function MobileHeader() {
  const [open, setOpen] = React.useState(false);

  return (
    <div className="flex items-center gap-2 border-b bg-background px-3 py-2 md:hidden">
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button size="icon" variant="outline" aria-label="Open navigation">
            <Menu className="h-4 w-4" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-72 p-0">
          <div className="px-4 py-4">
            <div className="text-sm font-semibold">Montecarlos</div>
            <div className="text-xs text-muted-foreground">
              Monte Carlo playground
            </div>
          </div>
          <Separator />
          <ScrollArea className="h-[calc(100vh-73px)]">
            <NavList onNavigate={() => setOpen(false)} />
          </ScrollArea>
        </SheetContent>
      </Sheet>
      <div className="text-sm font-medium">Montecarlos</div>
    </div>
  );
}

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background">
      <div className="flex min-h-screen">
        <DesktopSidebar />
        <div className="flex min-w-0 flex-1 flex-col">
          <MobileHeader />
          <main className="min-w-0 flex-1">{children}</main>
        </div>
      </div>
    </div>
  );
}
