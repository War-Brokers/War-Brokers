import { fetchUpstream } from "@/fetch"

import { fetchDailyStats, getDailyStatsUpdatedAt } from "./index"

const DAILY_CACHE_TIME = 10 * 60 * 1000

async function flushMicrotasks() {
    for (let index = 0; index < 10; index += 1) await Promise.resolve()
}

afterEach(() => jest.useRealTimers())

const mockedFetchUpstream = jest.mocked(fetchUpstream)

jest.mock("@/env", () => ({
    env: {
        WB_DB_BASE: "https://domain.example",
        WB_DB_ID: "id",
        WB_DB_PW: "password",
    },
}))

jest.mock("@/fetch", () => ({ fetchUpstream: jest.fn() }))

jest.mock("@/db/client", () => ({
    db: {
        getKnownPlayerUIDs: jest.fn().mockResolvedValue(["uid"]),
        setPlayer: jest.fn(),
    },
}))

it("returns stale daily data while checking for a newer source update", async () => {
    jest.useFakeTimers()
    jest.setSystemTime(new Date("2026-01-01T00:00:00Z"))

    const dailyFeed = "uid,nick,squad,total_kills\nuid,nick,,10\n"

    const updatedDailyFeed = "uid,nick,squad,total_kills\nuid,nick,,20\n"

    mockedFetchUpstream
        .mockResolvedValueOnce(new Response("1787551934"))
        .mockResolvedValueOnce(new Response(dailyFeed))
        .mockResolvedValueOnce(new Response("1787551934"))
        .mockResolvedValueOnce(new Response("1787551935"))
        .mockResolvedValueOnce(new Response(updatedDailyFeed))

    const firstResponse = await fetchDailyStats()
    await expect(firstResponse.text()).resolves.toBe(dailyFeed)
    await expect(getDailyStatsUpdatedAt()).resolves.toBe(1787551934)
    expect(mockedFetchUpstream).toHaveBeenCalledTimes(2)

    jest.advanceTimersByTime(DAILY_CACHE_TIME)
    const cachedResponse = await fetchDailyStats()
    await expect(cachedResponse.text()).resolves.toBe(dailyFeed)
    await flushMicrotasks()
    expect(mockedFetchUpstream).toHaveBeenCalledTimes(3)

    jest.advanceTimersByTime(DAILY_CACHE_TIME)
    const staleResponse = await fetchDailyStats()
    await expect(staleResponse.text()).resolves.toBe(dailyFeed)
    await flushMicrotasks()
    expect(mockedFetchUpstream).toHaveBeenCalledTimes(5)

    const refreshedResponse = await fetchDailyStats()
    await expect(refreshedResponse.text()).resolves.toBe(updatedDailyFeed)
    expect(mockedFetchUpstream).toHaveBeenCalledTimes(5)
})
