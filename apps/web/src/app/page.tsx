import Link from "next/link";
import { ChevronRight } from "lucide-react";

import { Shell } from "@/components/dashboard/shell";
import { MarketingLayout } from "@/components/layout/marketing-layout";
import { Cards } from "@/components/marketing/cards";
import { FAQs } from "@/components/marketing/faqs";
import { Plans } from "@/components/marketing/plans";
import { Tracker } from "@/components/tracker";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getMonitorListData } from "@/lib/tb";

export default async function Page() {
  const data = await getMonitorListData({ monitorId: "openstatusPing" });

  return (
    <MarketingLayout>
      <div className="grid gap-8">
        <Shell className="text-center">
          <Link
            href="https://twitter.com/mxkaske/status/1685666982786404352?s=20"
            target="_blank"
            rel="noreferrer"
          >
            <Badge variant="outline">
              Announcement Post <ChevronRight className="ml-1 h-3 w-3" />
            </Badge>
          </Link>
          <h1 className="text-foreground font-cal mb-6 mt-2 text-3xl">
            Open-source monitoring service
          </h1>
          <p className="text-muted-foreground mx-auto mb-6 max-w-lg text-lg">
            OpenStatus is an open source alternative to your current monitoring
            service with a beautiful status page.
          </p>
          <div className="my-4 flex items-center justify-center gap-2">
            <Button asChild className="rounded-full">
              <Link href="/app">Get Started</Link>
            </Button>
            <Button asChild variant="link">
              <Link href="/github" target="_blank">
                Star on GitHub
              </Link>
            </Button>
          </div>
        </Shell>
        <Shell className="text-center">
          <h2 className="font-cal mb-3 text-2xl">Status</h2>
          <Button asChild variant="outline" className="rounded-full">
            <Link href="/play">Playground</Link>
          </Button>
          {data && (
            <Tracker
              data={data}
              id="openstatusPing"
              name="Ping"
              url="https://www.openstatus.dev/api/ping"
            />
          )}
        </Shell>
        <Cards />
        <Plans />
        <Shell>
          <FAQs />
        </Shell>
      </div>
    </MarketingLayout>
  );
}
