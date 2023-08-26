import { createTRPCRouter } from "@/trpc"

import getPlayer from "./getPlayer"

export const tag = "player"

export default createTRPCRouter({
    getPlayer: getPlayer(tag),
})
