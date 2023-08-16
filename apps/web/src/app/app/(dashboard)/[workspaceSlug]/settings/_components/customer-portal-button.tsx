"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";

import { LoadingAnimation } from "@/components/loading-animation";
import { Button } from "@/components/ui/button";
import { api } from "@/trpc/client";

interface Props {
  workspaceSlug: string;
}

export function CustomerPortalButton({ workspaceSlug }: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const getUserCustomerPortal = () => {
    startTransition(async () => {
      const url = await api.stripeRouter.getUserCustomerPortal.mutate({
        workspaceSlug,
      });
      if (!url) return;
      router.push(url);
      return;
    });
  };

  return (
    <Button
      size="sm"
      variant="outline"
      onClick={getUserCustomerPortal}
      disabled={isPending}
    >
      {isPending ? <LoadingAnimation /> : "Customer Portal"}
    </Button>
  );
}
