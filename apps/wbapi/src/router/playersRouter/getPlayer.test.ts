import { fetchUpstream } from "@/fetch"

import { getPlayer } from "./getPlayer"

jest.mock("@/fetch", () => ({
    fetchUpstream: jest.fn(),
}))

jest.mock("@/index", () => ({
    db: { setPlayer: jest.fn() },
    env: {
        WB_DB_BASE: "https://domain.example",
        WB_DB_ID: "id",
        WB_DB_PW: "password",
    },
}))

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

const mockedFetchUpstream = jest.mocked(fetchUpstream)

function mockPlayerResponse(overrides: Partial<typeof playerData> = {}) {
    mockedFetchUpstream.mockResolvedValue(
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

    const result = await getPlayer(playerData.uid)

    expect(result).toMatchObject({
        success: true,
        data: { squad: null },
    })
})

test("preserves a non-empty squad", async () => {
    mockPlayerResponse()

    const result = await getPlayer(playerData.uid)

    expect(result).toMatchObject({
        success: true,
        data: { squad: playerData.squad },
    })
})
