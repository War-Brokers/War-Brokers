import { z } from "zod"

import type { Digit } from "./digit"

export const WeaponIDSchema = z.custom<
    `p${Digit}${Digit}` | `p${Digit}${Digit}${Digit}`
>((val) => /^p\d\d\d?$/g.test(val as string))

export type WeaponID = z.infer<typeof WeaponIDSchema>

export enum Weapon {
    AirStrike = "p09",
    BGM = "p11",
    UNKNOWN_52 = "p52", // TODO
    UNKNOWN_53 = "p53", // TODO
    UNKNOWN_54 = "p54", // TODO
    UNKNOWN_55 = "p55", // TODO
    UNKNOWN_56 = "p56", // TODO
    UNKNOWN_57 = "p57", // TODO
    UNKNOWN_58 = "p58", // TODO
    UNKNOWN_59 = "p59", // TODO
    UNKNOWN_60 = "p60", // TODO
    ARRifle = "p61",
    AKRifle = "p62",
    Pistol = "p63",
    HuntingRifle = "p64",
    RPG = "p65",
    Shotgun = "p66",
    SniperRifle = "p67",
    SMG = "p68",
    Homing = "p69",
    Grenade = "p71",
    HeliMinigun = "p74",
    TankMinigun = "p75",
    Knife = "p76",
    Revolver = "p78",
    Minigun = "p79",
    GrenadeLauncher = "p80",
    UNKNOWN_82 = "p82", // TODO
    UNKNOWN_83 = "p83", // TODO
    UNKNOWN_84 = "p84", // TODO
    UNKNOWN_85 = "p85", // TODO
    UNKNOWN_86 = "p86", // TODO
    UNKNOWN_87 = "p87", // TODO
    Fists = "p88",
    VSS = "p89",
    FiftyCalSniper = "p90",
    MGTurret = "p91",
    Crossbow = "p92",
    SCAR = "p93",
    TacticalShotgun = "p94",
    VEK = "p95",
    UNKNOWN_96 = "p96", // TODO
    UNKNOWN_97 = "p97", // TODO
    LMG = "p98",
    UNKNOWN_105 = "p105", // TODO
    UNKNOWN_101 = "p101", // TODO
    UNKNOWN_110 = "p110", // TODO
    LaserTripMine = "p111",
    UNKNOWN_112 = "p112", // TODO
}
