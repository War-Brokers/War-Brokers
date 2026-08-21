import trpc from "$lib/trpc"

import type { PageServerLoad } from "./$types"

export const load = (async () => {
    return {
        // We're going against the design guideline here and awaiting the data on the server instead
        // of streaming it in to prevent massive layout shift or pagination. The DB query resolves
        // really quickly (PostgreSQL is on the same network) so the tradeoff is acceptable.
        squads: await trpc.squad.getSquadList.query(),
    }
}) satisfies PageServerLoad
