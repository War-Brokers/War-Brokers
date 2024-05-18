import gamesElo from "./gamesElo"
import killsElo from "./killsElo"
import xp from "./xp"

export type RankingFunc = (limit: number, offset: number) => Promise<unknown[]>

export const getKillsEloRanking = killsElo
export const getGamesEloRanking = gamesElo
export const getXPRanking = xp
