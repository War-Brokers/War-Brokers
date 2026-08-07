import { GameMode } from "@warbrokers/types/src/gameMode"
import { WBMap } from "@warbrokers/types/src/map"

import { parseData } from "./serverList"

test.each([
    {
        region: "ASIA",
        data: "9,198.13.39.1:48002,ASIA,281,128,0,5,45.32.18.182:48000,ASIA,281,128,0,18,207.148.98.252:48000,ASIA,281,128,0,4,45.32.18.182:48002,ASIA,281,128,0,51,45.32.18.182:48001,ASIA,281,128,0,3,198.13.39.1:48001,ASIA,281,128,6,49,207.148.98.252:48001,ASIA,281,128,0,20,207.148.98.252:48002,ASIA,281,128,0,24,198.13.39.1:48000,ASIA,281,128,13,3",
        expected: [
            {
                name: "ASIA_01",
                address: "198.13.39.1:48000",
                region: "ASIA",
                version: 281,
                isTeams: true,
                isServerOpen: true,
                gameMode: GameMode.DeathMatch,
                playerCount: 13,
                map: WBMap.Office,
                maxPlayers: 16,
            },
            {
                name: "ASIA_02",
                address: "198.13.39.1:48001",
                region: "ASIA",
                version: 281,
                isTeams: true,
                isServerOpen: true,
                gameMode: GameMode.DeathMatch,
                playerCount: 6,
                map: WBMap.GoldMineV2,
                maxPlayers: 16,
            },
        ],
    },
    {
        region: "USA",
        data: "12,66.42.115.45:48002,USA,281,128,0,4,66.42.115.45:48000,USA,281,128,0,8,66.42.115.45:48001,USA,281,128,0,4,137.220.58.215:48001,USA,281,128,0,5,45.76.19.100:48002,USA,281,128,0,8,45.76.28.6:48001,USA,281,128,0,2,137.220.58.215:48003,USA,281,128,0,4,45.76.19.100:48000,USA,281,128,6,49,137.220.58.215:48005,USA,281,128,0,4,45.76.19.100:48003,USA,281,128,0,1,45.76.28.6:48000,USA,281,128,0,1,45.76.28.6:48002,USA,281,128,0,32",
        expected: [
            {
                name: "USA_04",
                address: "45.76.19.100:48000",
                region: "USA",
                version: 281,
                isTeams: true,
                isServerOpen: true,
                gameMode: GameMode.DeathMatch,
                playerCount: 6,
                map: WBMap.GoldMineV2,
                maxPlayers: 16,
            },
        ],
    },
    {
        region: "USA_4V4",
        data: "8,144.202.52.161:48001,USA_4V4,281,128,0,28,144.202.52.161:48004,USA_4V4,281,128,0,28,144.202.52.161:48000,USA_4V4,281,128,1,41,144.202.52.161:48007,USA_4V4,281,128,0,28,144.202.52.161:48005,USA_4V4,281,128,0,28,144.202.52.161:48002,USA_4V4,281,128,0,28,144.202.52.161:48003,USA_4V4,281,128,0,28,144.202.52.161:48006,USA_4V4,281,128,0,28",
        expected: [
            {
                name: "USA_4V4_01",
                address: "144.202.52.161:48000",
                region: "USA_4V4",
                version: 281,
                isTeams: true,
                isServerOpen: true,
                gameMode: GameMode.DeathMatch,
                playerCount: 1,
                map: WBMap.SnipersOnly,
                maxPlayers: 8,
            },
        ],
    },
    {
        region: "AUSTRALIA",
        data: "3,172.105.182.46:48002,AUSTRALIA,281,128,0,3,172.105.182.46:48003,AUSTRALIA,281,128,0,8,172.105.182.46:48001,AUSTRALIA,281,128,8,44",
        expected: [
            {
                name: "AUSTRALIA_01",
                address: "172.105.182.46:48001",
                region: "AUSTRALIA",
                version: 281,
                isTeams: true,
                isServerOpen: true,
                gameMode: GameMode.DeathMatch,
                playerCount: 8,
                map: WBMap.Cologne,
                maxPlayers: 16,
            },
        ],
    },
])("decodes and names active $region servers", ({ data, expected }) => {
    expect(parseData(data).filter((server) => server.playerCount > 0)).toStrictEqual(expected)
})

test("decodes spectate-only battle royale servers", () => {
    expect(parseData("1,203.0.113.1:48000,AS_BATTLE_ROYALE,281,75,11,9")).toStrictEqual([
        {
            name: "AS_BATTLE_ROYALE_01",
            address: "203.0.113.1:48000",
            region: "AS_BATTLE_ROYALE",
            version: 281,
            isTeams: false,
            isServerOpen: false,
            gameMode: GameMode.BattleRoyale,
            playerCount: 11,
            map: WBMap.BattleRoyale,
            maxPlayers: 60,
        },
    ])
})
