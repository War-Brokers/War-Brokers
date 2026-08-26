import type { Player } from "@warbrokers/types/src/player"

import { db } from "@/db/client"
import { fetchUpstream } from "@/fetch"
import { fetchPlayer } from "@/fetchPlayer"

import { fetchDailyStats } from "./index"

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
        getKnownPlayerUIDs: jest.fn().mockResolvedValue(["known"]),
        setPlayer: jest.fn(),
    },
}))

jest.mock("@/fetchPlayer", () => ({ fetchPlayer: jest.fn() }))

const mockedDB = jest.mocked(db)
const mockedFetchPlayer = jest.mocked(fetchPlayer)
const mockedFetchUpstream = jest.mocked(fetchUpstream)

const makePlayer = (uid: string) =>
    ({
        uid,
        nick: uid,
        nicklower: uid,
        level: 1,
        xp: 100,
        coins: null,
        squad: null,
        killsELO: 1000,
        gamesELO: 1000,
        wins: null,
        losses: null,
        number_of_jumps: null,
        scuds_launched: null,
        zombie_kills: 0,
        zombie_deaths: 0,
        zombie_wins: 0,
        self_destructs: null,
        distance_driven: null,
        distance_driven_count: null,
        kills_per_vehicle: null,
        shots_fired_unzoomed: null,
        shots_fired_zoomed: null,
        shots_hit_unzoomed: null,
        shots_hit_zoomed: null,
        damage_dealt: null,
        damage_received: null,
        kills_per_weapon: null,
        deaths: null,
        headshots: null,
        banned: false,
        time: 0,
        joinTime: 0,
    }) satisfies Player

async function waitFor(condition: () => boolean) {
    for (let attempt = 0; attempt < 100; attempt += 1) {
        if (condition()) return
        await new Promise<void>((resolve) => setTimeout(resolve, 0))
    }

    throw new Error("Timed out waiting for background player caching")
}

it("caches daily-feed players that are missing from the database sequentially", async () => {
    const dailyFeed = [
        "uid,nick,squad,total_kills",
        "known,Known,,10",
        "missing-one,Missing one,,9",
        "missing-two,Missing two,,8",
        "missing-one,Missing one,,7",
        "",
    ].join("\n")
    const fetchOrder: string[] = []
    let activeFetches = 0
    let maximumActiveFetches = 0

    mockedFetchPlayer.mockImplementation(async (uid) => {
        fetchOrder.push(uid)
        activeFetches += 1
        maximumActiveFetches = Math.max(maximumActiveFetches, activeFetches)
        await new Promise<void>((resolve) => setTimeout(resolve, 5))
        activeFetches -= 1

        return { success: true, data: makePlayer(uid) }
    })
    mockedFetchUpstream
        .mockResolvedValueOnce(new Response("1787551934"))
        .mockResolvedValueOnce(new Response(dailyFeed))

    const response = await fetchDailyStats()
    await expect(response.text()).resolves.toBe(dailyFeed)
    await waitFor(() => mockedDB.setPlayer.mock.calls.length === 2)

    expect(mockedDB.getKnownPlayerUIDs).toHaveBeenCalledWith([
        "known",
        "missing-one",
        "missing-two",
    ])
    expect(fetchOrder).toEqual(["missing-one", "missing-two"])
    expect(maximumActiveFetches).toBe(1)
    expect(mockedDB.setPlayer.mock.calls.map(([player]) => player.uid)).toEqual([
        "missing-one",
        "missing-two",
    ])
})
