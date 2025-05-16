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
    // 45
    // 46
    GoldMine = 47,
    Resort = 48,
    GoldMineV2 = 49,
    // 50
}

export const mapIDSchema = z.nativeEnum(WBMap)

export const MapName: { [key in WBMap]: string } = {
    [WBMap.Desert]: "Desert",
    [WBMap.NorthWest]: "NorthWest",
    [WBMap.Pacific]: "Pacific",
    [WBMap.Office]: "Office",
    [WBMap.Flooded]: "Flooded",
    [WBMap.Temple]: "Temple",
    [WBMap.Escape]: "Escape",
    [WBMap.SouthWest]: "SouthWest",
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
    [WBMap.DwarfDungeon]: "Dwarf Dungeon",
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
    [WBMap.SnipersOnly]: "Snipers Only",
    // 42
    [WBMap.ZenGarden]: "Zen Garden",
    [WBMap.Cologne]: "Cologne",
    // 45
    // 46
    [WBMap.GoldMine]: "Gold Mine",
    [WBMap.Resort]: "Resort",
    [WBMap.GoldMineV2]: "Gold Mine V2",
    // 50
}
