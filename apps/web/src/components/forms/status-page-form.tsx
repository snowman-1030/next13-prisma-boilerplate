"use client";

import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import type * as z from "zod";

import type { allMonitorsSchema } from "@openstatus/db/src/schema";
import { insertPageSchemaWithMonitors } from "@openstatus/db/src/schema";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Checkbox } from "../ui/checkbox";

// REMINDER: only use the props you need!

type Schema = z.infer<typeof insertPageSchemaWithMonitors>;

interface Props {
  id: string;
  defaultValues?: Schema;
  onSubmit: (values: Schema) => Promise<void>;
  allMonitors?: z.infer<typeof allMonitorsSchema>;
}

export function StatusPageForm({
  id,
  defaultValues,
  onSubmit,
  allMonitors,
}: Props) {
  const form = useForm<Schema>({
    resolver: zodResolver(insertPageSchemaWithMonitors),
    defaultValues: {
      title: defaultValues?.title || "",
      slug: defaultValues?.slug || "", // TODO: verify if is unique
      description: defaultValues?.description || "",
      monitors: [],
      workspaceId: 0,
    },
  });
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit, (e) => {
          console.log(e);
          console.log(form.getValues());
        })}
        id={id}
      >
        <div className="grid w-full items-center  space-y-6">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Title</FormLabel>
                <FormControl>
                  <Input placeholder="" {...field} />
                </FormControl>
                <FormDescription>This is title of your page.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="slug"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Slug</FormLabel>
                <FormControl>
                  <Input placeholder="" {...field} />
                </FormControl>
                <FormDescription>
                  This is your url of your page.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Input placeholder="" {...field} />
                </FormControl>
                <FormDescription>
                  Give your user some information about it.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="monitors"
            render={() => (
              <FormItem>
                <div className="mb-4">
                  <FormLabel className="text-base">Monitor</FormLabel>
                  <FormDescription>
                    Select the monitors you want to display.
                  </FormDescription>
                </div>
                {allMonitors?.map((item) => (
                  <FormField
                    key={item.id}
                    control={form.control}
                    name="monitors"
                    render={({ field }) => {
                      return (
                        <FormItem
                          key={item.id}
                          className="flex flex-row items-start space-x-3 space-y-0"
                        >
                          <FormControl>
                            <Checkbox
                              checked={field.value?.includes(item.id)}
                              onCheckedChange={(checked) => {
                                return checked
                                  ? field.onChange([
                                      ...(field.value || []),
                                      item.id,
                                    ])
                                  : field.onChange(
                                      field.value?.filter(
                                        (value) => value !== item.id,
                                      ),
                                    );
                              }}
                            />
                          </FormControl>
                          <FormLabel className="font-normal">
                            {item.name}
                          </FormLabel>
                        </FormItem>
                      );
                    }}
                  />
                ))}
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </form>
    </Form>
  );
}
