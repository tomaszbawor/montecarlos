import { notFound } from "next/navigation";
import { DistributionShowcase } from "@/features/distributions/components/distribution-showcase";
import { getDistributionDefinition } from "@/lib/distribution/registry";

export default async function DistributionPage({
  params,
}: {
  params: Promise<{ distributionId: string }>;
}) {
  const { distributionId } = await params;
  const def = getDistributionDefinition(distributionId);
  if (!def) notFound();

  return (
    <div className="p-6 md:p-8">
      <div className="mx-auto w-full max-w-5xl space-y-6">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold">{def.name}</h1>
          <p className="text-sm text-muted-foreground">{def.description}</p>
        </div>
        <DistributionShowcase distributionId={def.id} />
      </div>
    </div>
  );
}
