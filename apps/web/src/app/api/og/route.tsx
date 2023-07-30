import { ImageResponse } from "next/server";

import { getMonitorListData } from "@/lib/tb";
import { cn, formatDate } from "@/lib/utils";

export const runtime = "edge";

const size = {
  width: 1200,
  height: 630,
};

const TITLE = "Open Status";
const DESCRIPTION = "An Open Source Alternative for your next Status Page";
const LIMIT = 40;

const interRegular = fetch(
  new URL("../../../public/fonts/Inter-Regular.ttf", import.meta.url),
).then((res) => res.arrayBuffer());

const interLight = fetch(
  new URL("../../../public/fonts/Inter-Light.ttf", import.meta.url),
).then((res) => res.arrayBuffer());

const calSemiBold = fetch(
  new URL("../../../public/fonts/CalSans-SemiBold.ttf", import.meta.url),
).then((res) => res.arrayBuffer());

export async function GET(req: Request) {
  const interRegularData = await interRegular;
  const interLightData = await interLight;
  const calSemiBoldData = await calSemiBold;

  const { searchParams } = new URL(req.url);

  const title = searchParams.has("title") ? searchParams.get("title") : TITLE;
  const description = searchParams.has("description")
    ? searchParams.get("description")
    : DESCRIPTION;
  const monitorId = searchParams.has("monitorId")
    ? searchParams.get("monitorId")
    : undefined;

  // currently, we only show the tracker for a single(!) monitor
  const data =
    (monitorId &&
      (await getMonitorListData({
        monitorId,
        groupBy: "day",
        limit: LIMIT,
      }))) ||
    [];

  const uptime = data?.reduce(
    (prev, curr) => {
      prev.ok += curr.ok;
      prev.count += curr.count;
      return prev;
    },
    { ok: 0, count: 0 },
  );

  return new ImageResponse(
    (
      <div tw="relative flex flex-col bg-white items-center justify-center w-full h-full">
        <div
          tw="flex w-full h-full absolute inset-0"
          // not every css variable is supported
          style={{
            backgroundImage: "radial-gradient(#cbd5e1 10%, transparent 10%)",
            backgroundSize: "24px 24px",
          }}
        ></div>
        <div
          tw="flex w-full h-full absolute inset-0 opacity-70"
          style={{
            backgroundColor: "white",
            backgroundImage:
              "radial-gradient(farthest-corner at 100px 100px, #cbd5e1, white 80%)", // tbd: switch color position
          }}
        ></div>
        <div tw="max-w-4xl relative flex flex-col">
          <h1 style={{ fontFamily: "Cal" }} tw="text-6xl">
            {title}
          </h1>
          <p tw="text-slate-600 text-3xl">{description}</p>
          {data && data.length > 0 ? (
            <div tw="flex flex-col w-full mt-6">
              <div tw="flex flex-row items-center justify-between -mb-1 text-black font-light">
                <p tw="">{formatDate(new Date())}</p>
                <p tw="mr-1">
                  {((uptime.ok / uptime.count) * 100).toFixed(2)}% uptime
                </p>
              </div>
              <div tw="flex flex-row relative">
                {/* Empty State */}
                {new Array(LIMIT).fill(null).map((_, i) => {
                  return (
                    <div
                      key={i}
                      tw="h-16 w-3 rounded-full mr-1 bg-black/20"
                    ></div>
                  );
                })}
                <div tw="flex flex-row absolute right-0">
                  {data.map((item, i) => {
                    const { variant } = getStatus(item.ok / item.count);
                    return (
                      <div
                        key={i}
                        tw={cn("h-16 w-3 rounded-full mr-1", {
                          "bg-green-500": variant === "up",
                          "bg-red-500": variant === "down",
                          "bg-yellow-500": variant === "degraded",
                        })}
                      ></div>
                    );
                  })}
                </div>
              </div>
              <div tw="flex flex-row items-center justify-between -mt-3 text-slate-500 text-sm">
                <p tw="">{LIMIT} days ago</p>
                <p tw="mr-1">today</p>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        {
          name: "Inter",
          data: interRegularData,
          style: "normal",
          weight: 400,
        },
        {
          name: "Inter",
          data: interLightData,
          style: "normal",
          weight: 300,
        },
        {
          name: "Cal",
          data: calSemiBoldData,
          style: "normal",
          weight: 600,
        },
      ],
    },
  );
}

// FIXME this is a temporary solution (taken from Tracker)
const getStatus = (
  ratio: number,
): { label: string; variant: "up" | "degraded" | "down" } => {
  if (ratio >= 0.98) return { label: "Operational", variant: "up" };
  if (ratio >= 0.5) return { label: "Degraded", variant: "degraded" };
  return { label: "Downtime", variant: "down" };
};
