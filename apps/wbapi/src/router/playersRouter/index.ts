import { createTRPCRouter } from "@/trpc"

import getPlayer from "./getPlayer"
import searchByName from "./searchByName"

export const tag = "player"

export default createTRPCRouter({
    getPlayer: getPlayer(tag),
    searchByName: searchByName(tag),
})
