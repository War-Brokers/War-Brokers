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

export const gameModeName = {
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
    [GameMode.ScudLaunch]: "Missile Launch / Bomb Disposal",
    [GameMode.BattleRoyale]: "Battle Royale",
    [GameMode.Competitive]: "Competitive",
    [GameMode.LobbyCompetitive]: "Competitive (Lobby)",
    [GameMode.LobbyBR]: "Battle Royale (Lobby)",
    [GameMode.Count]: "Gun Game",
} as const satisfies { [key in GameMode]: string }

export const gameModeFandom = {
    [GameMode.DeathMatch]: {
        articleUrl: "https://war-brokers.fandom.com/wiki/Classic_Mode#Team_Death_Match_(TDM)",
        imageUrl: "https://war-brokers.fandom.com/wiki/Special:Redirect/file/Mode_TDM.png",
    },
    [GameMode.DemolitionDerby]: { articleUrl: null, imageUrl: null },
    [GameMode.ProtectLeader]: { articleUrl: null, imageUrl: null },
    [GameMode.ResourceCapture]: { articleUrl: null, imageUrl: null },
    [GameMode.Race]: { articleUrl: null, imageUrl: null },
    [GameMode.TankBattle]: { articleUrl: null, imageUrl: null },
    [GameMode.TankKing]: { articleUrl: null, imageUrl: null },
    [GameMode.CapturePoint]: {
        articleUrl: "https://war-brokers.fandom.com/wiki/Capture_Point",
        imageUrl: "https://war-brokers.fandom.com/wiki/Special:Redirect/file/Mode_CapturePoint.png",
    },
    [GameMode.VehicleEscort]: {
        articleUrl: "https://war-brokers.fandom.com/wiki/Vehicle_Escort",
        imageUrl:
            "https://war-brokers.fandom.com/wiki/Special:Redirect/file/Vehicle_Escort_Distance.png",
    },
    [GameMode.PackageDrop]: {
        articleUrl: "https://war-brokers.fandom.com/wiki/Package_Drop",
        imageUrl: "https://war-brokers.fandom.com/wiki/Special:Redirect/file/CaseHeld.png",
    },
    [GameMode.ScudLaunch]: {
        articleUrl: "https://war-brokers.fandom.com/wiki/Missile_Launch_/_Bomb_Disposal",
        imageUrl:
            "https://war-brokers.fandom.com/wiki/Special:Redirect/file/Mode_MissileLaunch%2BBomb.png",
    },
    [GameMode.BattleRoyale]: {
        articleUrl: "https://war-brokers.fandom.com/wiki/Battle_Royale_Gamemode",
        imageUrl:
            "https://war-brokers.fandom.com/wiki/Special:Redirect/file/Wb_battle_royale_button.png",
    },
    [GameMode.Competitive]: {
        articleUrl: "https://war-brokers.fandom.com/wiki/Competitive_Mode",
        imageUrl: "https://war-brokers.fandom.com/wiki/Special:Redirect/file/Compmode.png",
    },
    [GameMode.LobbyCompetitive]: {
        articleUrl: "https://war-brokers.fandom.com/wiki/Competitive_Mode",
        imageUrl: "https://war-brokers.fandom.com/wiki/Special:Redirect/file/Compmode.png",
    },
    [GameMode.LobbyBR]: {
        articleUrl: "https://war-brokers.fandom.com/wiki/Battle_Royale_Gamemode",
        imageUrl:
            "https://war-brokers.fandom.com/wiki/Special:Redirect/file/Wb_battle_royale_button.png",
    },
    [GameMode.Count]: {
        articleUrl: "https://war-brokers.fandom.com/wiki/Gun_Game",
        imageUrl: "https://war-brokers.fandom.com/wiki/Special:Redirect/file/Ggminimap.png",
    },
} as const satisfies Record<
    GameMode,
    {
        articleUrl: string | null
        imageUrl: string | null
    }
>
