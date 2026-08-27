import { createDailyLeaderboards } from "./dailyLeaderboard"

const DAILY_STATS_CACHE_TIME_MS = 24 * 60 * 60 * 1000

afterEach(() => jest.useRealTimers())

it("reuses daily ranking ranges until the daily stats cache refreshes", async () => {
    jest.useFakeTimers()
    jest.setSystemTime(new Date("2026-01-01T00:00:00Z"))

    const fetchFeed = jest.fn<Promise<Response>, []>()
    fetchFeed
        .mockResolvedValueOnce(
            new Response(
                [
                    "uid,nick,squad,total_kills,wins.m00,wins.m07,wins.m11,wins.m12,wins.m99",
                    "low,Low,,3,1,2,4,0,0",
                    "high,High,TOP,20,5,1,1,3,4",
                    "invalid,Invalid,,0,100,0,2,0,0",
                    "middle,Middle,,10,2,0,3,0,0",
                ].join("\n"),
            ),
        )
        .mockResolvedValueOnce(
            new Response(
                [
                    "uid,nick,squad,total_kills,wins.m00,wins.m11,wins.m12",
                    "new-low,New Low,,4,1,10,0",
                    "new-high,New High,,12,8,2,1",
                ].join("\n"),
            ),
        )
        .mockResolvedValueOnce(
            new Response(["uid,nick,squad,total_kills", "invalid,Invalid,,0"].join("\n")),
        )

    const dailyLeaderboards = createDailyLeaderboards(fetchFeed)
    const [
        firstRanking,
        firstCount,
        firstRange,
        firstClassicModeWinsRanking,
        firstClassicModeWinsPlayerCount,
        firstClassicModeWinsRange,
        firstBattleRoyaleWinsRanking,
        firstBattleRoyaleWinsPlayerCount,
        firstBattleRoyaleWinsRange,
    ] = await Promise.all([
        dailyLeaderboards.dailyKills.ranking(10),
        dailyLeaderboards.dailyKills.count(),
        dailyLeaderboards.dailyKills.range(),
        dailyLeaderboards.dailyClassicModeWins.ranking(10),
        dailyLeaderboards.dailyClassicModeWins.count(),
        dailyLeaderboards.dailyClassicModeWins.range(),
        dailyLeaderboards.dailyBattleRoyaleWins.ranking(10),
        dailyLeaderboards.dailyBattleRoyaleWins.count(),
        dailyLeaderboards.dailyBattleRoyaleWins.range(),
    ])

    expect(fetchFeed).toHaveBeenCalledTimes(1)
    expect(firstRanking.map(({ uid }) => uid)).toEqual(["high", "middle", "low"])
    expect(firstCount).toBe(3)
    expect(firstRange).toEqual({ min: 3, max: 20 })
    await expect(dailyLeaderboards.dailyKills.range()).resolves.toBe(firstRange)
    expect(
        firstClassicModeWinsRanking.map(({ uid, dailyClassicModeWins }) => ({
            uid,
            dailyClassicModeWins,
        })),
    ).toEqual([
        { uid: "invalid", dailyClassicModeWins: 100 },
        { uid: "high", dailyClassicModeWins: 13 },
        { uid: "low", dailyClassicModeWins: 3 },
        { uid: "middle", dailyClassicModeWins: 2 },
    ])
    expect(firstClassicModeWinsPlayerCount).toBe(4)
    expect(firstClassicModeWinsRange).toEqual({ min: 2, max: 100 })
    expect(
        firstBattleRoyaleWinsRanking.map(({ uid, dailyBattleRoyaleWins }) => ({
            uid,
            dailyBattleRoyaleWins,
        })),
    ).toEqual([
        { uid: "low", dailyBattleRoyaleWins: 4 },
        { uid: "middle", dailyBattleRoyaleWins: 3 },
        { uid: "invalid", dailyBattleRoyaleWins: 2 },
        { uid: "high", dailyBattleRoyaleWins: 1 },
    ])
    expect(firstBattleRoyaleWinsPlayerCount).toBe(4)
    expect(firstBattleRoyaleWinsRange).toEqual({ min: 1, max: 4 })

    jest.advanceTimersByTime(DAILY_STATS_CACHE_TIME_MS)

    const [
        secondRanking,
        secondCount,
        secondRange,
        secondClassicModeWinsRanking,
        secondBattleRoyaleWinsRanking,
    ] = await Promise.all([
        dailyLeaderboards.dailyKills.ranking(10),
        dailyLeaderboards.dailyKills.count(),
        dailyLeaderboards.dailyKills.range(),
        dailyLeaderboards.dailyClassicModeWins.ranking(10),
        dailyLeaderboards.dailyBattleRoyaleWins.ranking(10),
    ])

    expect(fetchFeed).toHaveBeenCalledTimes(2)
    expect(secondRanking.map(({ uid }) => uid)).toEqual(["new-high", "new-low"])
    expect(secondCount).toBe(2)
    expect(secondRange).toEqual({ min: 4, max: 12 })
    expect(secondClassicModeWinsRanking.map(({ uid }) => uid)).toEqual(["new-high", "new-low"])
    expect(secondBattleRoyaleWinsRanking.map(({ uid }) => uid)).toEqual(["new-low", "new-high"])

    jest.advanceTimersByTime(DAILY_STATS_CACHE_TIME_MS)

    await expect(dailyLeaderboards.dailyKills.count()).resolves.toBe(0)
    await expect(dailyLeaderboards.dailyClassicModeWins.count()).resolves.toBe(0)
    await expect(dailyLeaderboards.dailyKills.range()).resolves.toEqual({ min: 0, max: 0 })
    expect(fetchFeed).toHaveBeenCalledTimes(3)
})
