import type { Player } from "@warbrokers/types/src/player"

import { redis } from "."

const cached = ["xp", "killsELO", "gamesELO"] as const

export default (player: Player) => {
    for (const i of cached)
        redis().zadd(`player:${i}`, { member: player.uid, score: player[i] })
}
