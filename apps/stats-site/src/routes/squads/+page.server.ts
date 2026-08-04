import trpc from "$lib/trpc"

import type { PageServerLoad } from "./$types"

export const load = (() => {
    return {
        squads: trpc.squad.getSquadList.query(),
    }
}) satisfies PageServerLoad
