import trpc from "$lib/trpc"

import type { PageServerLoad } from "./$types"

export const load = (async () => {
    const res = await fetch("https://discord.com/api/v10/invites/nZhsAWttge?with_counts=true")
    const squadLeaders = [
        // cspell:disable-next-line
        await trpc.players.getPlayer.query({ uid: "5d0fb3a0bfea71355fef4595" }), // Nanderson
        await trpc.players.getPlayer.query({ uid: "5ebfc077fd3c7a7302d0c765" }), // DaVince
    ]
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
        squadLeaders,
        serverMembersCount: invite.approximate_member_count,
        members: await trpc.squad.getSquadMembers.query({ squadName: "HF" }),
    }
}) satisfies PageServerLoad
