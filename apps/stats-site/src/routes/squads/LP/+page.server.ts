import trpc from "$lib/trpc"

import type { PageServerLoad } from "./$types"

export const load = (async () => {
    const res = await fetch(
        "https://discord.com/api/v10/invites/2fsar34APa?with_counts=true",
    )
    return {
        serverMembersCount: (await res.json())
            .approximate_member_count as number,
        members: await trpc.squad.getSquadMembers.query({ squadName: "LP" }),
    }
}) satisfies PageServerLoad
