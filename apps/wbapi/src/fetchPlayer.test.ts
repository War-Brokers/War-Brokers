import { FailReason } from "@/types"
import { fetchPlayerStats } from "@/wbdb"

import { fetchPlayer } from "./fetchPlayer"

jest.mock("@/wbdb", () => ({ fetchPlayerStats: jest.fn() }))

const playerData = {
    uid: "player-uid",
    nick: "Player",
    nicklower: "player",
    level: 1,
    xp: 100,
    coins: null,
    squad: "SQUAD",
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
}

const mockedFetchPlayerStats = jest.mocked(fetchPlayerStats)

function mockPlayerResponse(overrides: Partial<typeof playerData> | Record<string, unknown> = {}) {
    mockedFetchPlayerStats.mockResolvedValue(
        new Response(
            JSON.stringify({
                ...playerData,
                ...overrides,
            }),
        ),
    )
}

test("replaces an empty squad with null", async () => {
    mockPlayerResponse({ squad: "" })

    const result = await fetchPlayer(playerData.uid)

    expect(result).toMatchObject({
        success: true,
        data: { squad: null },
    })
})

test("preserves a non-empty squad", async () => {
    mockPlayerResponse()

    const result = await fetchPlayer(playerData.uid)

    expect(result).toMatchObject({
        success: true,
        data: { squad: playerData.squad },
    })
})

test("converts string weapon-stat values to numbers", async () => {
    mockPlayerResponse({
        most_kills_in_round: { p01: "12" },
        most_kills_between_deaths: { p02: "8" },
        longest_kill: { p03: "321.5" },
    })

    const result = await fetchPlayer(playerData.uid)

    expect(result).toMatchObject({
        success: true,
        data: {
            most_kills_in_round: { p01: 12 },
            most_kills_between_deaths: { p02: 8 },
            longest_kill: { p03: 321.5 },
        },
    })
})

test("treats an HTTP 404 as unavailable", async () => {
    mockedFetchPlayerStats.mockResolvedValue(new Response("Not found", { status: 404 }))

    await expect(fetchPlayer(playerData.uid)).resolves.toEqual({
        success: false,
        reason: FailReason.WBDBConnectionFail,
    })
})

test("identifies the upstream missing-player response", async () => {
    mockedFetchPlayerStats.mockResolvedValue(new Response(`No data for player: ${playerData.uid}`))

    await expect(fetchPlayer(playerData.uid)).resolves.toEqual({
        success: false,
        reason: FailReason.PlayerNotFound,
    })
})

test("identifies the upstream missing-record response", async () => {
    mockedFetchPlayerStats.mockResolvedValue(new Response("Error! Cannot find record"))

    await expect(fetchPlayer(playerData.uid)).resolves.toEqual({
        success: false,
        reason: FailReason.PlayerNotFound,
    })
})

test("requires an exact HTTP 200 missing-player response", async () => {
    mockedFetchPlayerStats.mockResolvedValue(
        new Response(`No data for player: ${playerData.uid}`, { status: 201 }),
    )

    await expect(fetchPlayer(playerData.uid)).resolves.toEqual({
        success: false,
        reason: FailReason.SchemaValidationFail,
    })
})

test("treats an unsuccessful upstream response as unavailable", async () => {
    mockedFetchPlayerStats.mockResolvedValue(new Response("Unavailable", { status: 503 }))

    await expect(fetchPlayer(playerData.uid)).resolves.toEqual({
        success: false,
        reason: FailReason.WBDBConnectionFail,
    })
})

test("treats an upstream network rejection as unavailable", async () => {
    mockedFetchPlayerStats.mockRejectedValue(new TypeError("fetch failed"))

    await expect(fetchPlayer(playerData.uid)).resolves.toEqual({
        success: false,
        reason: FailReason.WBDBConnectionFail,
    })
})
