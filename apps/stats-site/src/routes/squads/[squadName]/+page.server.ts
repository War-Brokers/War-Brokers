import { error } from "@sveltejs/kit"

import trpc from "$lib/trpc"

import type { PageServerLoad } from "./$types"

const discordInviteCodes: Record<string, string> = {
    TheEnd: "USnVxNnVwj",
}

export const load = (({ fetch, params: { squadName } }) => {
    const members = trpc.squad.getSquadMembers.query({ squadName }).then((members) => {
        if (members.length === 0) error(404, { message: `Squad "${squadName}" does not exist.` })

        return members
    })
    const discordInviteCode = discordInviteCodes[squadName]
    const serverMembersCount = discordInviteCode
        ? fetch(`https://discord.com/api/v10/invites/${discordInviteCode}?with_counts=true`).then(
              async (res) => {
                  const invite: unknown = await res.json()

                  if (
                      typeof invite !== "object" ||
                      invite === null ||
                      !("approximate_member_count" in invite) ||
                      typeof invite.approximate_member_count !== "number"
                  ) {
                      throw new TypeError("Discord invite response is missing a member count")
                  }

                  return invite.approximate_member_count
              },
          )
        : undefined

    return {
        discordInviteCode,
        serverMembersCount,
        squadName,
        members,
    }
}) satisfies PageServerLoad
