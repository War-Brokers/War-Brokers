import { Readable } from "node:stream"
import type { ReadableStream as NodeReadableStream } from "node:stream/web"

import { parse } from "csv-parse"
import { z } from "zod"

import { fetchDailyStats } from "."

type DailyKillsPlayer = {
    uid: string
    nick: string
    squad: string | null
    dailyKills: number
}

type DailyKillsSnapshot = {
    players: readonly DailyKillsPlayer[]
    range: {
        min: number
        max: number
    }
}

const DAILY_KILLS_CACHE_TIME_MS = 24 * 60 * 60 * 1000
const dailyKillsColumns = new Set(["uid", "nick", "squad", "total_kills"])
let dailyKillsCache:
    | {
          expiresAt: number
          snapshot: DailyKillsSnapshot
      }
    | undefined
let dailyKillsPromise: Promise<DailyKillsSnapshot> | undefined

async function parseDailyKills(response: Response) {
    if (response.body === null) throw new Error("Daily stats response has no body")

    const source = Readable.fromWeb(
        // Node and fetch expose equivalent streams with incompatible library types.
        // eslint-disable-next-line @typescript-eslint/no-unsafe-type-assertion
        response.body as unknown as NodeReadableStream,
    )
    const parser = source.pipe(
        parse({
            columns: (columns) =>
                columns.map((column) => (dailyKillsColumns.has(column) ? column : undefined)),
            skip_empty_lines: true,
        }),
    )
    source.on("error", (error) => parser.destroy(error))
    const players: DailyKillsPlayer[] = []

    for await (const parsed of parser) {
        const row = z.record(z.string()).parse(parsed)
        const uid = row["uid"]
        const nick = row["nick"]
        if (!uid || !nick) continue

        const dailyKills = Number(row["total_kills"])
        if (!Number.isFinite(dailyKills) || dailyKills <= 0) continue

        const squad = row["squad"] || null

        players.push({ uid, nick, squad, dailyKills })

        if (players.length % 100 === 0) {
            await new Promise<void>((resolve) => setImmediate(resolve))
        }
    }

    return players
}

async function loadDailyKills() {
    const response = await fetchDailyStats()
    if (!response.ok) throw new Error(`Daily stats request failed with status ${response.status}`)

    const players = (await parseDailyKills(response)).sort(
        (left, right) => right.dailyKills - left.dailyKills || left.uid.localeCompare(right.uid),
    )
    const highestRankedPlayer = players[0]
    const lowestRankedPlayer = players.at(-1)

    return {
        players,
        range:
            highestRankedPlayer === undefined || lowestRankedPlayer === undefined
                ? { min: 0, max: 0 }
                : {
                      min: lowestRankedPlayer.dailyKills,
                      max: highestRankedPlayer.dailyKills,
                  },
    } satisfies DailyKillsSnapshot
}

function getDailyKillsSnapshot() {
    if (dailyKillsCache !== undefined && dailyKillsCache.expiresAt > Date.now()) {
        return Promise.resolve(dailyKillsCache.snapshot)
    }

    if (dailyKillsPromise === undefined) {
        dailyKillsPromise = loadDailyKills()
            .then((snapshot) => {
                dailyKillsCache = {
                    expiresAt: Date.now() + DAILY_KILLS_CACHE_TIME_MS,
                    snapshot,
                }
                return snapshot
            })
            .finally(() => {
                dailyKillsPromise = undefined
            })
    }

    return dailyKillsPromise
}

export async function getDailyKillsRanking(limit: number, offset: number = 0) {
    const { players } = await getDailyKillsSnapshot()
    return players.slice(offset, offset + limit)
}

export async function getDailyKillsPlayerCount() {
    const { players } = await getDailyKillsSnapshot()
    return players.length
}

export async function getDailyKillsRange() {
    const { range } = await getDailyKillsSnapshot()
    return range
}
