import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { DISTRIBUTIONS } from "@/lib/distribution/registry";
import { cn } from "@/lib/utils";

export default function DistributionsPage() {
  return (
    <div className="p-6 md:p-8">
      <div className="mx-auto w-full max-w-5xl space-y-6">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold">Distributions</h1>
          <p className="text-sm text-muted-foreground">
            Interactive showcases for distribution algorithms in this codebase.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {DISTRIBUTIONS.map((d) => (
            <Card key={d.id} className="flex flex-col">
              <CardHeader className="flex-1">
                <CardTitle>{d.name}</CardTitle>
                <CardDescription>{d.description}</CardDescription>
              </CardHeader>
              <CardFooter>
                <Link
                  href={`/distributions/${d.id}`}
                  className={cn(buttonVariants({ variant: "outline" }))}
                >
                  Open
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
