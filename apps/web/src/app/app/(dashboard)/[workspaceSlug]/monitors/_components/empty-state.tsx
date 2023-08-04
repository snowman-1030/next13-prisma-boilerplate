import Link from "next/link";

import { EmptyState as DefaultEmptyState } from "@/components/dashboard/empty-state";
import { Button } from "@/components/ui/button";

export function EmptyState() {
  return (
    <DefaultEmptyState
      icon="activity"
      title="No monitors"
      description="Create your first monitor"
      action={
        <Button asChild>
          <Link href="./monitors/edit">Create</Link>
        </Button>
      }
    />
  );
}
