import trpc from "$lib/trpc"

import type { PageServerLoad } from "./$types"

export const load = (async () => {
    return {
        squadLeader: await trpc.players.getPlayer.query({
            uid: "60d08b15d142afee4b1dfabe",
        }),
        members: await trpc.squad.getSquadMembers.query({ squadName: "APG" }),
    }
}) satisfies PageServerLoad
