import { z } from "zod"

export const regionSchema = z.enum([
    "USA",
    "USA_WEST",
    "ASIA",
    "AUSTRALIA",
    "EUROPE",
    "INDIA",
    "JAPAN",
    "RUSSIA",
    // 4V4
    "ASIA_4V4",
    "EU_4V4",
    "USA_4V4",
    // Dead City
    "AS_DEAD_CITY",
    "DEAD_CITY",
    "EU_DEAD", // Fallback emitted when an EU user declines browser storage.
    "EU_DEAD_CITY",
    // clan
    "AUSTRALIA_CLAN",
    "INDIA_CLAN",
    "EUROPE_CLAN",
    "USA_CLAN",
    "USA_WEST_CLAN",
    // battle royale
    "AS_BATTLE_ROYALE",
    "AU_BATTLE_ROYALE",
    "EU_BATTLE_ROYALE",
    "NA_BATTLE_ROYALE",
    // competitive
    "NA_COMPETITIVE",
    "NA_COMPETITIVE_TESTING",
])

export type Region = z.infer<typeof regionSchema>
