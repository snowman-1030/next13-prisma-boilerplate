"use client";

import * as React from "react";
import { useRouter } from "next/navigation";

import { Icons } from "@/components/icons";
import { LoadingAnimation } from "@/components/loading-animation";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { api } from "@/trpc/client";

export function DeleteIncidentUpdateButtonIcon({ id }: { id: number }) {
  const router = useRouter();
  const [alertOpen, setAlertOpen] = React.useState(false);
  const [isPending, startTransition] = React.useTransition();

  async function onDelete() {
    startTransition(async () => {
      await api.incident.deleteIncidentUpdate.mutate({ id });
      router.refresh();
      setAlertOpen(false);
    });
  }

  return (
    <AlertDialog open={alertOpen} onOpenChange={(value) => setAlertOpen(value)}>
      <AlertDialogTrigger asChild>
        <Button
          size="icon"
          variant="outline"
          className="border-destructive/50 text-destructive/80 hover:text-destructive hover:bg-destructive/10 h-7 w-7 p-0"
        >
          <Icons.trash className="h-4 w-4" />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete the
            monitor.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={(e) => {
              e.preventDefault();
              onDelete();
            }}
            disabled={isPending}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {!isPending ? "Delete" : <LoadingAnimation />}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
