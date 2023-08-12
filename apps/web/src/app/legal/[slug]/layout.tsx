import * as React from "react";

import { MarketingLayout } from "@/components/layout/marketing-layout";

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <MarketingLayout>{children}</MarketingLayout>;
}
