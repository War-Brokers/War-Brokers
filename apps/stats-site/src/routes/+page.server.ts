import { playersOnline as getPlayersOnline } from "@warbrokers/fetch/src/status/playersOnline"
import { twitchStreamCount } from "@warbrokers/fetch/src/status/twitchStreamCount"

import type { PageServerLoad } from "./$types"

export const load = (async () => {
    let playersOnlineResult:
        | undefined
        | Awaited<ReturnType<typeof getPlayersOnline>>
    let twitchStreamsResult:
        | undefined
        | Awaited<ReturnType<typeof twitchStreamCount>>

    await Promise.allSettled([
        (async () => {
            playersOnlineResult = await getPlayersOnline()
        })(),

        (async () => {
            twitchStreamsResult = await twitchStreamCount()
        })(),
    ])

    return {
        playersOnlineResult,
        twitchStreamsResult,
    }
}) satisfies PageServerLoad
