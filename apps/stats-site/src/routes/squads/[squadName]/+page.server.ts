import { error } from "@sveltejs/kit"

import APGEmblem from "$lib/img/squads/APG.png"
import CAESAREmblem from "$lib/img/squads/CAESAR.png"
import HFEmblem from "$lib/img/squads/HF.png"
import LPEmblem from "$lib/img/squads/LP.png"
import trpc from "$lib/trpc"

import type { PageServerLoad } from "./$types"

const squadConfigs: Record<
    string,
    {
        emblem?: string
        fullName?: string
        discordInvite?: string
        leaderUids?: readonly string[]
    }
> = {
    APG: {
        emblem: APGEmblem,
        leaderUids: [
            "60d08b15d142afee4b1dfabe", // Did You Get Sniped?
        ],
    },
    CAESAR: {
        emblem: CAESAREmblem,
        leaderUids: [
            "600722c9bfea71503dbd4905", // Colonel Grant
            "6006c985d142af9d4670c226", // Nyarlatoteph
            "63c8fbcfd142aff929a28ea2", // Colonel Fires
            "63c8ffa1d142afe031a28e1d", // Commander Phönix
            "5f086e2dd142afe8153aef05", // THE DOZER
            "63dbce11fe3c7a6a6807aa5f", // 7|Ammo
            "638b25a0bfea713b7218483b", // Achilles007
            "6698bdf3d142af601f50256a", // What! U Died ?
            "65cee709bfea711b1bd2fb1a", // CoolCoolCool
        ],
    },
    HF: {
        emblem: HFEmblem,
        discordInvite: "nZhsAWttge", // cspell:disable-line
        leaderUids: [
            "5ebfc077fd3c7a7302d0c765", // DaVince
        ],
    },
    LP: {
        emblem: LPEmblem,
        fullName: "Llama's Pyjamas",
        discordInvite: "2fsar34APa", // cspell:disable-line
    },
    TheEnd: {
        discordInvite: "USnVxNnVwj",
    },
}

export const load = (async ({ fetch, params: { squadName } }) => {
    const squadConfig = squadConfigs[squadName]

    const members = await trpc.squad.getSquadMembers.query({ squadName })

    if (members.length === 0 && !squadConfig) {
        error(404, { message: `Squad "${squadName}" does not exist.` })
    }

    return {
        // This might might be undefined if read from +page.server.ts via
        // `$derived(page.params.squadName)` so we're passing it here.
        squadName,

        squadConfig,

        members,

        serverMembersCount: squadConfig?.discordInvite
            ? fetch(
                  `https://discord.com/api/v10/invites/${squadConfig.discordInvite}?with_counts=true`,
              ).then(async (res) => {
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
              })
            : undefined,

        leaders: squadConfig?.leaderUids
            ? Promise.all(
                  squadConfig.leaderUids.map((uid) => trpc.players.getPlayer.query({ uid })),
              )
            : undefined,
    }
}) satisfies PageServerLoad
