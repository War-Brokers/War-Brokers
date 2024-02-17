import { parseData } from "./serverList"

test("serverList", () => {
    expect(
        parseData(
            "9,0.0.0.0:0000,ASIA,272,128,10,44,0.0.0.0:0000,ASIA,272,128,14,2,0.0.0.0:0000,ASIA,272,128,0,3,0.0.0.0:0000,ASIA,272,128,0,44,0.0.0.0:0000,ASIA,272,128,12,39,0.0.0.0:0000,ASIA,272,128,0,7,0.0.0.0:0000,ASIA,272,138,5,44,0.0.0.0:0000,ASIA,272,128,11,21,0.0.0.0:0000,ASIA,272,128,0,13",
        ),
    ).toStrictEqual([
        {
            maxPlayers: 16,
            playerCount: 14,
        },
        {
            maxPlayers: 16,
            playerCount: 12,
        },
        {
            maxPlayers: 16,
            playerCount: 11,
        },
        {
            maxPlayers: 16,
            playerCount: 10,
        },
        {
            maxPlayers: 16,
            playerCount: 5,
        },
    ])
})
