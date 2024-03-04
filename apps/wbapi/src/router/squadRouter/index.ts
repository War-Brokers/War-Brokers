import { createTRPCRouter } from "@/trpc"

import getSquadList from "./getSquadList"
import getSquadMembers from "./getSquadMembers"

export const tag = "squad"

export default createTRPCRouter({
    getSquadList: getSquadList(tag),
    getSquadMembers: getSquadMembers(tag),
})
