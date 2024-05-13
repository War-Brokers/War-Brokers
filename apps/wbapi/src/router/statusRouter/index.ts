import { createTRPCRouter } from "@/trpc"

import DBplayerCount from "./DBplayerCount"
import playerCount from "./playerCount"
import playersOnline from "./playersOnline"
import serverList from "./serverList"
import twitchStreams from "./twitchStreams"

export const tag = "status"

export default createTRPCRouter({
    dbPlayerCount: DBplayerCount(tag),
    playerCount: playerCount(tag),
    playersOnline: playersOnline(tag),
    serverList: serverList(tag),
    twitchStreams: twitchStreams(tag),
})
