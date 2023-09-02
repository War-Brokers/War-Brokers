import type { Player } from "@warbrokers/types/src/player"

import { zadd } from "."

const cached = ["xp", "killsELO", "gamesELO"] as const

export default async (player: Player) => {
    for (const i of cached)
        await zadd(`player:${i}`, { member: player.uid, score: player[i] })
}
