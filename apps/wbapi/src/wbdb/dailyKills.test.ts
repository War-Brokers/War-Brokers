import { fetchDailyStats } from "."
import { getDailyKillsPlayerCount, getDailyKillsRange, getDailyKillsRanking } from "./dailyKills"

jest.mock(".", () => ({ fetchDailyStats: jest.fn() }))

const DAILY_KILLS_CACHE_TIME_MS = 24 * 60 * 60 * 1000
const mockedFetchDailyStats = jest.mocked(fetchDailyStats)

afterEach(() => jest.useRealTimers())

it("reuses the ranking range until the daily kills cache refreshes", async () => {
    jest.useFakeTimers()
    jest.setSystemTime(new Date("2026-01-01T00:00:00Z"))

    mockedFetchDailyStats
        .mockResolvedValueOnce(
            new Response(
                [
                    "uid,nick,squad,total_kills",
                    "low,Low,,3",
                    "high,High,TOP,20",
                    "invalid,Invalid,,0",
                    "middle,Middle,,10",
                ].join("\n"),
            ),
        )
        .mockResolvedValueOnce(
            new Response(
                ["uid,nick,squad,total_kills", "new-low,New Low,,4", "new-high,New High,,12"].join(
                    "\n",
                ),
            ),
        )
        .mockResolvedValueOnce(
            new Response(["uid,nick,squad,total_kills", "invalid,Invalid,,0"].join("\n")),
        )

    const [firstRanking, firstCount, firstRange] = await Promise.all([
        getDailyKillsRanking(10),
        getDailyKillsPlayerCount(),
        getDailyKillsRange(),
    ])

    expect(mockedFetchDailyStats).toHaveBeenCalledTimes(1)
    expect(firstRanking.map(({ uid }) => uid)).toEqual(["high", "middle", "low"])
    expect(firstCount).toBe(3)
    expect(firstRange).toEqual({ min: 3, max: 20 })
    await expect(getDailyKillsRange()).resolves.toBe(firstRange)

    jest.advanceTimersByTime(DAILY_KILLS_CACHE_TIME_MS)

    const [secondRanking, secondCount, secondRange] = await Promise.all([
        getDailyKillsRanking(10),
        getDailyKillsPlayerCount(),
        getDailyKillsRange(),
    ])

    expect(mockedFetchDailyStats).toHaveBeenCalledTimes(2)
    expect(secondRanking.map(({ uid }) => uid)).toEqual(["new-high", "new-low"])
    expect(secondCount).toBe(2)
    expect(secondRange).toEqual({ min: 4, max: 12 })

    jest.advanceTimersByTime(DAILY_KILLS_CACHE_TIME_MS)

    await expect(getDailyKillsPlayerCount()).resolves.toBe(0)
    await expect(getDailyKillsRange()).resolves.toEqual({ min: 0, max: 0 })
    expect(mockedFetchDailyStats).toHaveBeenCalledTimes(3)
})
