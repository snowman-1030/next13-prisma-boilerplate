import * as z from "zod";

/**
 * All available Vercel (AWS) regions
 */
export const availableRegions = [
  "arn1",
  "bom1",
  "cdg1",
  "cle1",
  "cpt1",
  "dub1",
  "fra1",
  "gru1",
  "hkg1",
  "hnd1",
  "icn1",
  "kix1",
  "lhr1",
  "pdx1",
  "sfo1",
  "sin1",
  "syd1",
] as const;

/**
 * Values for the datasource ping_response__v2
 */
export const tbIngestPingResponse = z.object({
  id: z.string(),
  workspaceId: z.string(),
  pageId: z.string(),
  monitorId: z.string(),
  timestamp: z.number().int(),
  statusCode: z.number().int(),
  latency: z.number().int(), // in ms
  cronTimestamp: z.number().int().optional().nullable().default(Date.now()),
  url: z.string().url(),
  metadata: z
    .record(z.string(), z.unknown())
    .default({})
    .transform((t) => JSON.stringify(t))
    .optional(),
  region: z.string().min(4).max(4),
});

/**
 * Values from the pip response_list__v1
 */
export const tbBuildResponseList = z.object({
  id: z.string(),
  workspaceId: z.string(),
  pageId: z.string(),
  monitorId: z.string(),
  timestamp: z.number().int(),
  statusCode: z.number().int(),
  latency: z.number().int(), // in ms
  cronTimestamp: z.number().int().nullable().default(Date.now()),
  url: z.string().url(),
  metadata: z
    .string()
    .default("{}")
    .transform((t) => JSON.parse(t)),
  region: z.enum(availableRegions),
});

/**
 * Params for pipe response_list__v1
 */
export const tbParameterResponseList = z.object({
  siteId: z.string().optional().default(""), // REMINDER: remove default once alpha
  monitorId: z.string().default(""), // REMINDER: remove default once alpha
  fromDate: z.number().int().default(0), // always start from a date
  toDate: z.number().int().optional(),
  limit: z.number().int().optional().default(2500), // one day has 2448 pings (17 (regions) * 6 (per hour) * 24)
  region: z.enum(availableRegions).optional(),
  cronTimestamp: z.number().int().optional(),
});

/**
 * All `groupBy` options for the monitoring list
 * - "day" will aggregate data within the same day
 * - "cron" will get data from single cron job
 */
export const groupByRange = ["day", "cron"] as const;

/**
 * Params for pipe monitor_list__v0
 */
export const tbParameterMonitorList = z.object({
  siteId: z.string().optional().default("openstatus"), // REMINDER: remove default once alpha
  monitorId: z.string().optional().default(""), // REMINDER: remove default once alpha
  limit: z.number().int().optional().default(2500), // one day has 2448 pings (17 (regions) * 6 (per hour) * 24)
  cronTimestamp: z.number().int().optional(),
  groupBy: z.enum(groupByRange).optional(), // TODO: rename to frequency: z.enum(["1d", "auto"]) - where "auto" the default periodicity setup
});

/**
 * Values from the pip monitor_list__v0
 */
export const tbBuildMonitorList = z.object({
  count: z.number().int(),
  ok: z.number().int(),
  avgLatency: z.number().int(), // in ms
  cronTimestamp: z.number().int(),
});

export type Ping = z.infer<typeof tbIngestPingResponse>;
export type Region = (typeof availableRegions)[number]; // TODO: rename type AvailabeRegion
export type Monitor = z.infer<typeof tbBuildMonitorList>;
export type ResponseListParams = z.infer<typeof tbParameterResponseList>;
export type MonitorListParams = z.infer<typeof tbParameterMonitorList>;
export type GroupByRange = (typeof groupByRange)[number];
