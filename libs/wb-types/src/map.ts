import { z } from "zod"

export enum WBMap {
    Desert = 0,
    NorthWest = 1,
    Pacific = 2,
    Office = 3,
    Flooded = 4,
    Temple = 5,
    Escape = 6,
    SouthWest = 7,
    Remagen = 8,
    BattleRoyale = 9,
    // 10
    // 11
    // 12
    CityPoint = 13,
    Tomb = 14,
    TheSomme = 15,
    // 16
    DeadEndCity = 17,
    Tribute = 18,
    CyberTribute = 19,
    Moonbase = 20,
    Area15Base = 21,
    Area15Bunker = 22,
    // 23
    SkullIsland = 24,
    Hangar = 25,
    // 26
    Quarry = 27,
    DwarfDungeon = 28,
    Kitchen = 29,
    Test = 30,
    Frontier = 31,
    Heist = 32,
    TowerOfPower = 33,
    ThreeLane = 34,
    SniperAlley = 35,
    Pyramid = 36,
    Containers = 37,
    SpaceStation = 38,
    Siege = 39,
    CrissCross = 40,
    SnipersOnly = 41,
    // 42
    ZenGarden = 43,
    Cologne = 44,
    Area15BaseAlt = 45,
    // 46
    GoldMine = 47,
    Resort = 48,
    GoldMineV2 = 49,
    Area15V2 = 50,
    DesertRedux = 51,
}

export const mapIDSchema = z.nativeEnum(WBMap)

export const MapName = {
    [WBMap.Desert]: "Desert",
    [WBMap.NorthWest]: "Northwest",
    [WBMap.Pacific]: "Pacific",
    [WBMap.Office]: "Office",
    [WBMap.Flooded]: "Flooded",
    [WBMap.Temple]: "Temple",
    [WBMap.Escape]: "Escape",
    [WBMap.SouthWest]: "Southwest",
    [WBMap.Remagen]: "Remagen",
    [WBMap.BattleRoyale]: "Battle Royale Map",
    // 10
    // 11
    // 12
    [WBMap.CityPoint]: "City Point",
    [WBMap.Tomb]: "Tomb",
    [WBMap.TheSomme]: "The Somme",
    // 16
    [WBMap.DeadEndCity]: "Dead End City",
    [WBMap.Tribute]: "Tribute",
    [WBMap.CyberTribute]: "Cyber Tribute",
    [WBMap.Moonbase]: "Moonbase",
    [WBMap.Area15Base]: "Area 15 Base",
    [WBMap.Area15Bunker]: "Area 15 Bunker",
    // 23
    [WBMap.SkullIsland]: "Skull Island",
    [WBMap.Hangar]: "Hangar",
    // 26
    [WBMap.Quarry]: "Quarry",
    [WBMap.DwarfDungeon]: "Dwarf's Dungeon",
    [WBMap.Kitchen]: "Kitchen",
    [WBMap.Test]: "Test",
    [WBMap.Frontier]: "Frontier",
    [WBMap.Heist]: "Heist",
    [WBMap.TowerOfPower]: "Tower of Power",
    [WBMap.ThreeLane]: "Three Lane",
    [WBMap.SniperAlley]: "Sniper Alley",
    [WBMap.Pyramid]: "Pyramid",
    [WBMap.Containers]: "Containers",
    [WBMap.SpaceStation]: "Space Station",
    [WBMap.Siege]: "Siege",
    [WBMap.CrissCross]: "Criss Cross",
    [WBMap.SnipersOnly]: "Only Snipers",
    // 42
    [WBMap.ZenGarden]: "Zen Garden",
    [WBMap.Cologne]: "Cologne",
    [WBMap.Area15BaseAlt]: "Area 15 Base", // Client uses the same name as map 21.
    // 46
    [WBMap.GoldMine]: "Gold Mine",
    [WBMap.Resort]: "Resort",
    [WBMap.GoldMineV2]: "Gold Mine V2",
    [WBMap.Area15V2]: "Area 15 V2",
    [WBMap.DesertRedux]: "Desert Redux",
} as const satisfies { [key in WBMap]: string }

export const mapFandom = {
    [WBMap.Desert]: {
        articleUrl: "https://war-brokers.fandom.com/wiki/Desert_(map)",
        imageUrl: "https://war-brokers.fandom.com/wiki/Special:Redirect/file/Desert_vote.png",
    },
    [WBMap.NorthWest]: {
        articleUrl: "https://war-brokers.fandom.com/wiki/Northwest",
        imageUrl: "https://war-brokers.fandom.com/wiki/Special:Redirect/file/Northwest_vote.png",
    },
    [WBMap.Pacific]: {
        articleUrl: "https://war-brokers.fandom.com/wiki/Pacific",
        imageUrl: "https://war-brokers.fandom.com/wiki/Special:Redirect/file/Pacific_vote.png",
    },
    [WBMap.Office]: {
        articleUrl: "https://war-brokers.fandom.com/wiki/Office",
        imageUrl: "https://war-brokers.fandom.com/wiki/Special:Redirect/file/Office_vote.png",
    },
    [WBMap.Flooded]: {
        articleUrl: "https://war-brokers.fandom.com/wiki/Flooded",
        imageUrl: "https://war-brokers.fandom.com/wiki/Special:Redirect/file/Flooded_vote.png",
    },
    [WBMap.Temple]: {
        articleUrl: "https://war-brokers.fandom.com/wiki/Temple",
        imageUrl: "https://war-brokers.fandom.com/wiki/Special:Redirect/file/Temple_vote.png",
    },
    [WBMap.Escape]: {
        articleUrl: "https://war-brokers.fandom.com/wiki/Escape",
        imageUrl: "https://war-brokers.fandom.com/wiki/Special:Redirect/file/Escape_vote.png",
    },
    [WBMap.SouthWest]: {
        articleUrl: "https://war-brokers.fandom.com/wiki/Southwest",
        imageUrl: "https://war-brokers.fandom.com/wiki/Special:Redirect/file/Southwest_vote.png",
    },
    [WBMap.Remagen]: {
        articleUrl: "https://war-brokers.fandom.com/wiki/Remagen",
        imageUrl: "https://war-brokers.fandom.com/wiki/Special:Redirect/file/Remagen_vote.png",
    },
    [WBMap.BattleRoyale]: {
        articleUrl: "https://war-brokers.fandom.com/wiki/Battle_Royale_Map",
        imageUrl: "https://war-brokers.fandom.com/wiki/Special:Redirect/file/BattleRoyale_vote.png",
    },
    [WBMap.CityPoint]: {
        articleUrl: "https://war-brokers.fandom.com/wiki/City_Point",
        imageUrl: "https://war-brokers.fandom.com/wiki/Special:Redirect/file/CityPoint_vote.png",
    },
    [WBMap.Tomb]: {
        articleUrl: "https://war-brokers.fandom.com/wiki/Tomb",
        imageUrl: "https://war-brokers.fandom.com/wiki/Special:Redirect/file/Tomb_vote.png",
    },
    [WBMap.TheSomme]: {
        articleUrl: "https://war-brokers.fandom.com/wiki/The_Somme",
        imageUrl: "https://war-brokers.fandom.com/wiki/Special:Redirect/file/Somme_vote.png",
    },
    [WBMap.DeadEndCity]: {
        articleUrl: "https://war-brokers.fandom.com/wiki/Dead_End_City",
        imageUrl: "https://war-brokers.fandom.com/wiki/Special:Redirect/file/DeadEndCity_vote.png",
    },
    [WBMap.Tribute]: {
        articleUrl: "https://war-brokers.fandom.com/wiki/Tribute",
        imageUrl: "https://war-brokers.fandom.com/wiki/Special:Redirect/file/Tribute_vote.png",
    },
    [WBMap.CyberTribute]: {
        articleUrl: "https://war-brokers.fandom.com/wiki/Cyber_Tribute",
        imageUrl: "https://war-brokers.fandom.com/wiki/Special:Redirect/file/TributeSilk_vote.png",
    },
    [WBMap.Moonbase]: {
        articleUrl: "https://war-brokers.fandom.com/wiki/Moonbase",
        imageUrl: "https://war-brokers.fandom.com/wiki/Special:Redirect/file/Moonbase_vote.png",
    },
    [WBMap.Area15Base]: {
        articleUrl: "https://war-brokers.fandom.com/wiki/Area_15_Base",
        imageUrl: "https://war-brokers.fandom.com/wiki/Special:Redirect/file/Area15Base_vote.png",
    },
    [WBMap.Area15Bunker]: {
        articleUrl: "https://war-brokers.fandom.com/wiki/Area_15_Bunker",
        imageUrl: "https://war-brokers.fandom.com/wiki/Special:Redirect/file/Area15Bunker_vote.png",
    },
    [WBMap.SkullIsland]: {
        articleUrl: "https://war-brokers.fandom.com/wiki/Skull_Island",
        imageUrl: "https://war-brokers.fandom.com/wiki/Special:Redirect/file/SkullIsland_vote.png",
    },
    [WBMap.Hangar]: {
        articleUrl: "https://war-brokers.fandom.com/wiki/Hangar",
        imageUrl: "https://war-brokers.fandom.com/wiki/Special:Redirect/file/Hangar_vote.png",
    },
    [WBMap.Quarry]: {
        articleUrl: "https://war-brokers.fandom.com/wiki/Quarry",
        imageUrl: "https://war-brokers.fandom.com/wiki/Special:Redirect/file/Quarry_vote.png",
    },
    [WBMap.DwarfDungeon]: {
        articleUrl: "https://war-brokers.fandom.com/wiki/Dwarf_Dungeon",
        imageUrl: "https://war-brokers.fandom.com/wiki/Special:Redirect/file/DwarfDungeon_vote.png",
    },
    [WBMap.Kitchen]: {
        articleUrl: "https://war-brokers.fandom.com/wiki/Kitchen",
        imageUrl: "https://war-brokers.fandom.com/wiki/Special:Redirect/file/Kitchen_vote.png",
    },
    [WBMap.Test]: {
        articleUrl: "https://war-brokers.fandom.com/wiki/Test",
        imageUrl: "https://war-brokers.fandom.com/wiki/Special:Redirect/file/Test_map.png",
    },
    [WBMap.Frontier]: {
        articleUrl: "https://war-brokers.fandom.com/wiki/Frontier",
        imageUrl: "https://war-brokers.fandom.com/wiki/Special:Redirect/file/Frontier_vote.png",
    },
    [WBMap.Heist]: {
        articleUrl: "https://war-brokers.fandom.com/wiki/Heist",
        imageUrl: "https://war-brokers.fandom.com/wiki/Special:Redirect/file/Heist_vote.png",
    },
    [WBMap.TowerOfPower]: {
        articleUrl: "https://war-brokers.fandom.com/wiki/Tower_of_Power",
        imageUrl: "https://war-brokers.fandom.com/wiki/Special:Redirect/file/TowerOfPower_vote.png",
    },
    [WBMap.ThreeLane]: {
        articleUrl: "https://war-brokers.fandom.com/wiki/Three_Lane",
        imageUrl: "https://war-brokers.fandom.com/wiki/Special:Redirect/file/ThreeLanes_vote.png",
    },
    [WBMap.SniperAlley]: {
        articleUrl: "https://war-brokers.fandom.com/wiki/Sniper_Alley",
        imageUrl: "https://war-brokers.fandom.com/wiki/Special:Redirect/file/SniperAlley_vote.png",
    },
    [WBMap.Pyramid]: {
        articleUrl: "https://war-brokers.fandom.com/wiki/Pyramid",
        imageUrl: "https://war-brokers.fandom.com/wiki/Special:Redirect/file/Pyramid_vote.png",
    },
    [WBMap.Containers]: {
        articleUrl: "https://war-brokers.fandom.com/wiki/Containers",
        imageUrl: "https://war-brokers.fandom.com/wiki/Special:Redirect/file/Containers_vote.png",
    },
    [WBMap.SpaceStation]: {
        articleUrl: "https://war-brokers.fandom.com/wiki/Space_Station",
        imageUrl: "https://war-brokers.fandom.com/wiki/Special:Redirect/file/SpaceStation_vote.png",
    },
    [WBMap.Siege]: {
        articleUrl: "https://war-brokers.fandom.com/wiki/Siege",
        imageUrl: "https://war-brokers.fandom.com/wiki/Special:Redirect/file/Siege_vote.png",
    },
    [WBMap.CrissCross]: {
        articleUrl: "https://war-brokers.fandom.com/wiki/Criss_Cross",
        imageUrl: "https://war-brokers.fandom.com/wiki/Special:Redirect/file/CrissCross_vote.png",
    },
    [WBMap.SnipersOnly]: {
        articleUrl: "https://war-brokers.fandom.com/wiki/Snipers_Only",
        imageUrl: "https://war-brokers.fandom.com/wiki/Special:Redirect/file/SnipersOnly_vote.png",
    },
    [WBMap.ZenGarden]: {
        articleUrl: "https://war-brokers.fandom.com/wiki/Zen_Garden",
        imageUrl: "https://war-brokers.fandom.com/wiki/Special:Redirect/file/Zen_vote.png",
    },
    [WBMap.Cologne]: {
        articleUrl: "https://war-brokers.fandom.com/wiki/Cologne",
        imageUrl: "https://war-brokers.fandom.com/wiki/Special:Redirect/file/Cologne_vote.png",
    },
    [WBMap.Area15BaseAlt]: { articleUrl: null, imageUrl: null },
    [WBMap.GoldMine]: {
        articleUrl: "https://war-brokers.fandom.com/wiki/Gold_Mine",
        imageUrl: "https://war-brokers.fandom.com/wiki/Special:Redirect/file/GoldMine_vote.png",
    },
    [WBMap.Resort]: {
        articleUrl: "https://war-brokers.fandom.com/wiki/Resort",
        imageUrl: "https://war-brokers.fandom.com/wiki/Special:Redirect/file/Resort_vote.png",
    },
    [WBMap.GoldMineV2]: {
        articleUrl: "https://war-brokers.fandom.com/wiki/Gold_Mine_V2",
        imageUrl: "https://war-brokers.fandom.com/wiki/Special:Redirect/file/GoldMineV2_map.png",
    },
    [WBMap.Area15V2]: {
        articleUrl: "https://war-brokers.fandom.com/wiki/Area_15_V2",
        imageUrl: "https://war-brokers.fandom.com/wiki/Special:Redirect/file/Area15V2_map.png",
    },
    [WBMap.DesertRedux]: {
        articleUrl: "https://war-brokers.fandom.com/wiki/Desert_Redux",
        imageUrl: "https://war-brokers.fandom.com/wiki/Special:Redirect/file/DesertRedux_vote.png",
    },
} as const satisfies Record<
    WBMap,
    {
        articleUrl: string | null
        imageUrl: string | null
    }
>
