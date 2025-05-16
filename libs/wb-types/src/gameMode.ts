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
    [GameMode.DeathMatch]: "Team Death Match",
    [GameMode.DemolitionDerby]: "Demolition Derby",
    [GameMode.ProtectLeader]: "Protect Leader",
    [GameMode.ResourceCapture]: "Resource Capture",
    [GameMode.Race]: "Race",
    [GameMode.TankBattle]: "Tank Battle",
    [GameMode.TankKing]: "Tank King",
    [GameMode.CapturePoint]: "Capture Point",
    [GameMode.VehicleEscort]: "Vehicle Escort",
    [GameMode.PackageDrop]: "Package Drop",
    [GameMode.ScudLaunch]: "Missile Launch/Bomb Disposal",
    [GameMode.BattleRoyale]: "Battle Royale",
    [GameMode.Competitive]: "Competitive",
    [GameMode.LobbyCompetitive]: "Competitive (Lobby)",
    [GameMode.LobbyBR]: "Battle Royale (Lobby)",
    [GameMode.Count]: "Gun Game",
}
