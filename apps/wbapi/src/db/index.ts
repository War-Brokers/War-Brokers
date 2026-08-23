import { drizzle } from "drizzle-orm/postgres-js"
import postgres from "postgres"

import { env } from "@/env"
import { upstreamTimeoutMs } from "@/fetch"

import deletePlayer from "./deletePlayer"
import {
    getGamesEloDistribution,
    getKillsEloDistribution,
    getLevelDistribution,
    getLogLevelDistribution,
    getLogTimeAliveDistribution,
    getLogXPDistribution,
    getTimeAliveDistribution,
    getXPDistribution,
} from "./distribution"
import getDBPlayerCount from "./getDBPlayerCount"
import getPercentile from "./getPercentile"
import getSquadMembers from "./getSquadMembers"
import getSquads from "./getSquads"
import getStatRange from "./getStatRange"
import {
    getGamesEloRanking,
    getKillsEloRanking,
    getTimeAliveRanking,
    getXPRanking,
} from "./ranking"
import searchPlayerByName from "./searchPlayerByName"
import setPlayer from "./setPlayer"

export function initDB() {
    const client = postgres(env.DATABASE_URL, {
        connection: { statement_timeout: upstreamTimeoutMs },
        // Disable prefetch as it is not supported for "Transaction" pool mode
        prepare: false,
    })
    const db = drizzle(client)

    return {
        close: () => client.end(),
        setPlayer: setPlayer(db),
        deletePlayer: deletePlayer(db),
        searchPlayerByName: searchPlayerByName(db),
        getSquads: getSquads(db),
        getSquadMembers: getSquadMembers(db),
        getPercentile: getPercentile(db),
        getStatRange: getStatRange(db),
        getDBPlayerCount: getDBPlayerCount(db),

        getKillsEloDistribution: getKillsEloDistribution(db),
        getGamesEloDistribution: getGamesEloDistribution(db),
        getXPDistribution: getXPDistribution(db),
        getLevelDistribution: getLevelDistribution(db),
        getTimeAliveDistribution: getTimeAliveDistribution(db),
        getLogLevelDistribution: getLogLevelDistribution(db),
        getLogTimeAliveDistribution: getLogTimeAliveDistribution(db),
        getLogXPDistribution: getLogXPDistribution(db),

        getKillsEloRanking: getKillsEloRanking(db),
        getGamesEloRanking: getGamesEloRanking(db),
        getTimeAliveRanking: getTimeAliveRanking(db),
        getXPRanking: getXPRanking(db),
    }
}
