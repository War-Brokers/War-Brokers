import { z } from "zod"

export const regionSchema = z.union([
    z.literal("USA"),
    z.literal("USA_WEST"),
    z.literal("ASIA"),
    z.literal("AUSTRALIA"),
    z.literal("EUROPE"),
    z.literal("INDIA"),
    z.literal("JAPAN"),
    z.literal("RUSSIA"),
    // 4V4
    z.literal("ASIA_4V4"),
    z.literal("EU_4V4"),
    z.literal("USA_4V4"),
    // Dead City
    z.literal("AS_DEAD_CITY"),
    z.literal("DEAD_CITY"),
    z.literal("EU_DEAD"), // Fallback emitted when an EU user declines browser storage.
    z.literal("EU_DEAD_CITY"),
    // clan
    z.literal("AUSTRALIA_CLAN"),
    z.literal("INDIA_CLAN"),
    z.literal("EUROPE_CLAN"),
    z.literal("USA_CLAN"),
    z.literal("USA_WEST_CLAN"),
    // battle royale
    z.literal("AS_BATTLE_ROYALE"),
    z.literal("AU_BATTLE_ROYALE"),
    z.literal("EU_BATTLE_ROYALE"),
    z.literal("NA_BATTLE_ROYALE"),
    // competitive
    z.literal("NA_COMPETITIVE"),
    z.literal("NA_COMPETITIVE_TESTING"),
])

export type Region = z.infer<typeof regionSchema>
