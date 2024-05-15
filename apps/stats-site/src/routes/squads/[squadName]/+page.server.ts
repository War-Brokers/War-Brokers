import { error } from "@sveltejs/kit"

import trpc from "$lib/trpc"

import type { PageServerLoad } from "./$types"

export const load = (async ({ params: { squadName } }) => {
    const members = await trpc.squad.getSquadMembers.query({ squadName })

    if (members.length === 0)
        error(404, { message: `Squad "${squadName}" does not exist.` })

    return {
        squadName,
        members,
    }
}) satisfies PageServerLoad
