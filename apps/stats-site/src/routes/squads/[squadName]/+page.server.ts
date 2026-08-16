import { error } from "@sveltejs/kit"

import trpc from "$lib/trpc"

import type { PageServerLoad } from "./$types"

const discordInviteCodes: Record<string, string> = {
    TheEnd: "USnVxNnVwj",
}

export const load = (async ({ params: { squadName } }) => {
    const members = await trpc.squad.getSquadMembers.query({ squadName })

    if (members.length === 0) error(404, { message: `Squad "${squadName}" does not exist.` })

    const discordInviteCode = discordInviteCodes[squadName]
    let serverMembersCount: number | undefined

    if (discordInviteCode) {
        const res = await fetch(
            `https://discord.com/api/v10/invites/${discordInviteCode}?with_counts=true`,
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

        serverMembersCount = invite.approximate_member_count
    }

    return {
        discordInviteCode,
        serverMembersCount,
        squadName,
        members,
    }
}) satisfies PageServerLoad
