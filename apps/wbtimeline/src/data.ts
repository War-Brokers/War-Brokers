import { z } from "zod"

import source from "./data.yaml"

const timelineEntrySchema = z.strictObject({
    timestamp: z.string(),
    category: z.enum(["community", "development"]),
    subcategory: z.string().optional(),
    title: z.string(),
    description: z
        .string()
        .nullable()
        .transform((description) => description ?? ""),
    media: z.array(z.string()).optional(),
})

const timelineSchema = z.array(timelineEntrySchema)

export type TimelineEntry = z.infer<typeof timelineEntrySchema>

export const data = timelineSchema.parse(source)
