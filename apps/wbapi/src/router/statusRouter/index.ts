import { createTRPCRouter } from "@/trpc"

import playerCount from "./playerCount"
import playersOnline from "./playersOnline"
import twitchStreams from "./twitchStreams"

export const tag = "status"

export default createTRPCRouter({
    playerCount: playerCount(tag),
    playersOnline: playersOnline(tag),
    twitchStreams: twitchStreams(tag),
})
