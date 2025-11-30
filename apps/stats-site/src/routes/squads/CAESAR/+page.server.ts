import trpc from "$lib/trpc"

import type { PageServerLoad } from "./$types"

export const load = (async () => {
    return {
        members: await trpc.squad.getSquadMembers.query({
            squadName: "CAESAR",
        }),
    }
}) satisfies PageServerLoad
