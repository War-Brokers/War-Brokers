import { z } from "zod"

import type { Digit } from "./digit"

export const gameModeIDSchema = z.custom<`m${Digit}${Digit}`>((val) =>
    /^m\d\d$/g.test(val as string),
)

export type GameModeID = z.infer<typeof gameModeIDSchema>

export enum GameMode {
    DeathMatch = "m00",
    DemolitionDerby = "m01",
    ProtectLeader = "m02",
    ResourceCapture = "m03",
    Race = "m04",
    TankBattle = "m05",
    TankKing = "m06",
    CapturePoint = "m07",
    VehicleEscort = "m08",
    PackageDrop = "m09",
    ScudLaunch = "m10",
    BattleRoyale = "m11",
    Competitive = "m12",
    LobbyCompetitive = "m13",
    LobbyBR = "m14",
    Count = "m15",
}
