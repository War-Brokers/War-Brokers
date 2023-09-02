import { z } from "zod"

export const LocationSchema = z.union([
    z.literal("USA"),
    z.literal("USA_WEST"),
    z.literal("ASIA"),
    z.literal("AUSTRALIA"),
    z.literal("EUROPE"),
    z.literal("INDIA"),
    z.literal("JAPAN"),
    z.literal("RUSSIA"),
    // clan
    z.literal("USA_CLAN"),
    z.literal("USA_CLAN_WEST"),
    // battle royale
    z.literal("AS_BATTLE_ROYALE"),
    z.literal("AU_BATTLE_ROYALE"),
    z.literal("EU_BATTLE_ROYALE"),
    z.literal("NA_BATTLE_ROYALE"),
    // competitive
    z.literal("NA_COMPETITIVE_TESTING"),
])

export type Location = z.infer<typeof LocationSchema>
