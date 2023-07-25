import * as React from "react";

import { Container } from "@/components/dashboard/container";
import { Header } from "@/components/dashboard/header";
import { api } from "@/trpc/server";

export default async function IncidentPage({
  params,
}: {
  params: { workspaceSlug: string };
}) {
  const incidents = await api.incident.getIncidentByWorkspace.query({
    workspaceSlug: params.workspaceSlug,
  });
  return (
    <div className="grid gap-6 md:grid-cols-2 md:gap-8">
      <Header title="Incidents" description="Overview of all your incidents." />
    </div>
  );
}
