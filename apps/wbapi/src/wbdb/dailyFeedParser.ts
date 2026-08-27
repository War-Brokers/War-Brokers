import { Readable } from "node:stream"
import type { ReadableStream as NodeReadableStream } from "node:stream/web"

import { parse } from "csv-parse"
import { z } from "zod"

export type DailyFeedRow = {
    uid: string
    nick: string
    squad: string | null
    totalKills: number | undefined
    winsByMode: Readonly<Record<string, number>>
}

const dailyFeedColumns = new Set(["uid", "nick", "squad", "total_kills"])
const winsColumnPattern = /^wins\.(m\d\d)$/

function isDailyFeedColumn(column: string) {
    return dailyFeedColumns.has(column) || winsColumnPattern.test(column)
}

function normalizeDailyFeedRow(row: Record<string, string>) {
    const uid = row["uid"]
    const nick = row["nick"]
    if (!uid || !nick) return

    const rawTotalKills = Number(row["total_kills"])
    const totalKills = Number.isFinite(rawTotalKills) ? rawTotalKills : undefined
    const winsByMode: Record<string, number> = {}

    for (const [column, rawWins] of Object.entries(row)) {
        const mode = winsColumnPattern.exec(column)?.[1]
        if (mode === undefined) continue

        const wins = Number(rawWins)
        if (!Number.isSafeInteger(wins) || wins < 0) continue

        winsByMode[mode] = wins
    }

    return {
        uid,
        nick,
        squad: row["squad"] || null,
        totalKills,
        winsByMode,
    } satisfies DailyFeedRow
}

export async function parseDailyFeed(response: Response) {
    if (response.body === null) throw new Error("Daily stats response has no body")

    const source = Readable.fromWeb(
        // Node and fetch expose equivalent streams with incompatible library types.
        // eslint-disable-next-line @typescript-eslint/no-unsafe-type-assertion
        response.body as unknown as NodeReadableStream,
    )
    const parser = source.pipe(
        parse({
            columns: (columns) =>
                columns.map((column) => (isDailyFeedColumn(column) ? column : undefined)),
            skip_empty_lines: true,
        }),
    )
    source.on("error", (error) => parser.destroy(error))

    const rowSchema = z.record(z.string())
    const rows: DailyFeedRow[] = []
    let rowCount = 0

    for await (const parsed of parser) {
        rowCount += 1
        const row = rowSchema.parse(parsed)
        const normalized = normalizeDailyFeedRow(row)
        if (normalized !== undefined) rows.push(normalized)

        if (rowCount % 100 === 0) {
            await new Promise<void>((resolve) => setImmediate(resolve))
        }
    }

    return rows
}
