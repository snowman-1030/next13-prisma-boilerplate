"use client";

import { useRouter } from "next/navigation";

import { Dialog, DialogContent } from "@/components/ui/dialog";

export function Modal({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      router.back();
    }
  };

  return (
    <Dialog open onOpenChange={handleOpenChange}>
      {/* overflow-auto should happen inside content table */}
      <DialogContent className="max-h-screen w-full overflow-auto sm:max-w-3xl">
        {children}
      </DialogContent>
    </Dialog>
  );
}
