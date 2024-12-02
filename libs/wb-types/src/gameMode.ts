import { z } from "zod"

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

export const gameModeIDSchema = z.nativeEnum(GameMode)

export const gameModeName: { [key in GameMode]: string } = {
    [GameMode.DeathMatch]: "Death Match",
    [GameMode.DemolitionDerby]: "Demolition Derby",
    [GameMode.ProtectLeader]: "Protect Leader",
    [GameMode.ResourceCapture]: "Resource Capture",
    [GameMode.Race]: "Race",
    [GameMode.TankBattle]: "Tank Battle",
    [GameMode.TankKing]: "Tank King",
    [GameMode.CapturePoint]: "Capture Point",
    [GameMode.VehicleEscort]: "Vehicle Escort",
    [GameMode.PackageDrop]: "Package Drop",
    [GameMode.ScudLaunch]: "Scud Launch",
    [GameMode.BattleRoyale]: "BattleRoyale",
    [GameMode.Competitive]: "Competitive",
    [GameMode.LobbyCompetitive]: "Lobby Competitive",
    [GameMode.LobbyBR]: "Lobby Battle Royale",
    [GameMode.Count]: "Count",
}
