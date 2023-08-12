import { relations, sql } from "drizzle-orm";
import {
  integer,
  primaryKey,
  sqliteTable,
  text,
} from "drizzle-orm/sqlite-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

import { monitorsToIncidents } from "./incident";
import { page } from "./page";
import { workspace } from "./workspace";

export const availableRegions = [
  "auto", // randomly choose region
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
  "iad1",
  "icn1",
  "kix1",
  "lhr1",
  "pdx1",
  "sfo1",
  "sin1",
  "syd1",
] as const;

export const RegionEnum = z.enum(availableRegions);

export const monitor = sqliteTable("monitor", {
  id: integer("id").primaryKey(),
  jobType: text("job_type", ["website", "cron", "other"])
    .default("other")
    .notNull(),
  periodicity: text("periodicity", ["1m", "5m", "10m", "30m", "1h", "other"])
    .default("other")
    .notNull(),
  status: text("status", ["active", "inactive"]).default("inactive").notNull(),
  active: integer("active", { mode: "boolean" }).default(false),

  regions: text("regions").default("").notNull(),

  url: text("url", { length: 512 }).notNull(),

  name: text("name", { length: 256 }).default("").notNull(),
  description: text("description").default("").notNull(),

  workspaceId: integer("workspace_id").references(() => workspace.id),

  createdAt: integer("created_at", { mode: "timestamp" }).default(
    sql`(strftime('%s', 'now'))`,
  ),
  updatedAt: integer("updated_at", { mode: "timestamp" }).default(
    sql`(strftime('%s', 'now'))`,
  ),
});

export const monitorRelation = relations(monitor, ({ one, many }) => ({
  monitorsToPages: many(monitorsToPages),
  monitorsToIncidents: many(monitorsToIncidents),
  workspace: one(workspace, {
    fields: [monitor.workspaceId],
    references: [workspace.id],
  }),
}));

export const monitorsToPages = sqliteTable(
  "monitors_to_pages",
  {
    monitorId: integer("monitor_id")
      .notNull()
      .references(() => monitor.id, { onDelete: "cascade" }),
    pageId: integer("page_id")
      .notNull()
      .references(() => page.id, { onDelete: "cascade" }),
  },
  (t) => ({
    pk: primaryKey(t.monitorId, t.pageId),
  }),
);

export const monitorsToPagesRelation = relations(
  monitorsToPages,
  ({ one }) => ({
    monitor: one(monitor, {
      fields: [monitorsToPages.monitorId],
      references: [monitor.id],
    }),
    page: one(page, {
      fields: [monitorsToPages.pageId],
      references: [page.id],
    }),
  }),
);

export const periodicityEnum = z.enum([
  "1m",
  "5m",
  "10m",
  "30m",
  "1h",
  "other",
]);
// Schema for inserting a Monitor - can be used to validate API requests
export const insertMonitorSchema = createInsertSchema(monitor, {
  periodicity: periodicityEnum,
  url: z.string().url(),
  status: z.enum(["active", "inactive"]).default("inactive"),
  active: z.boolean().default(false),
  regions: z.array(RegionEnum).default([]).optional(),
});

// Schema for selecting a Monitor - can be used to validate API responses
export const selectMonitorSchema = createSelectSchema(monitor, {
  periodicity: periodicityEnum,
  status: z.enum(["active", "inactive"]).default("inactive"),
  jobType: z.enum(["website", "cron", "other"]).default("other"),
  active: z.boolean().default(false),
  regions: z
    .preprocess((val) => {
      if (String(val).length > 0) {
        return String(val).split(",");
      } else {
        return [];
      }
    }, z.array(RegionEnum))
    .default([]),
});

export const allMonitorsSchema = z.array(selectMonitorSchema);
