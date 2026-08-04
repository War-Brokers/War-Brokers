import trpc from "$lib/trpc"

import type { PageServerLoad } from "./$types"

export const load = (async () => {
    const res = await fetch(
        "https://discord.com/api/v10/invites/2fsar34APa?with_counts=true",
    )
    const invite: unknown = await res.json()

    if (
        typeof invite !== "object" ||
        invite === null ||
        !("approximate_member_count" in invite) ||
        typeof invite.approximate_member_count !== "number"
    ) {
        throw new TypeError("Discord invite response is missing a member count")
    }

    return {
        serverMembersCount: invite.approximate_member_count,
        members: await trpc.squad.getSquadMembers.query({ squadName: "LP" }),
    }
}) satisfies PageServerLoad
