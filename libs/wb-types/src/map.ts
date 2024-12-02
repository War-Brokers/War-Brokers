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
    // 9
    // 10
    // 11
    // 12
    CityPoint = 13,
    Tomb = 14,
    TheSomme = 15,
    // 16
    // 17
    Tribute = 18,
    CyberTribute = 19,
    Moonbase = 20,
    Area15Base = 21,
    Area15Bunker = 22,
    // 23
    SkullIsland = 24,
    Hangar = 25,
    // 26
    // 27
    DwarfsDungeon = 28,
    Kitchen = 29,
    Test = 30,
    Frontier = 31,
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
    // 9
    // 10
    // 11
    // 12
    [WBMap.CityPoint]: "City Point",
    [WBMap.Tomb]: "Tomb",
    [WBMap.TheSomme]: "The Somme",
    // 16
    // 17
    [WBMap.Tribute]: "Tribute",
    [WBMap.CyberTribute]: "Cyber Tribute",
    [WBMap.Moonbase]: "Moonbase",
    [WBMap.Area15Base]: "Area 15 Base",
    [WBMap.Area15Bunker]: "Area 15 Bunker",
    // 23
    [WBMap.SkullIsland]: "Skull Island",
    [WBMap.Hangar]: "Hangar",
    // 26
    // 27
    [WBMap.DwarfsDungeon]: "Dwarf's Dungeon",
    [WBMap.Kitchen]: "Kitchen",
    [WBMap.Test]: "Test",
    [WBMap.Frontier]: "Frontier",
}
