import trpc from "$lib/trpc"

import type { PageServerLoad } from "./$types"

export const load = (async () => {
    return {
        squads: await trpc.squad.getSquadList.query(),
    }
}) satisfies PageServerLoad
