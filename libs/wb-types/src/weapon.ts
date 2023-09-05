import { z } from "zod"

import type { Digit } from "./digit"

export const WeaponIDSchema = z.custom<
    `p${Digit}${Digit}` | `p${Digit}${Digit}${Digit}`
>((val) => /^p\d\d\d?$/g.test(val as string))

export type WeaponID = z.infer<typeof WeaponIDSchema>

export enum Weapon {
    AirStrike = "p09",
    BGM = "p11",
    // TODO p52
    // TODO p53
    // TODO p54
    // TODO p55
    // TODO p56
    // TODO p57
    // TODO p58
    // TODO p59
    // TODO p60
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
    // TODO p82
    // TODO p83
    // TODO p84
    // TODO p85
    // TODO p86
    // TODO p87
    Fists = "p88",
    VSS = "p89",
    FiftyCalSniper = "p90",
    MGTurret = "p91",
    Crossbow = "p92",
    SCAR = "p93",
    TacticalShotgun = "p94",
    VEK = "p95",
    // TODO p96
    // TODO p97
    LMG = "p98",
    // TODO p105
    // TODO p101
    // TODO p110
    LaserTripMine = "p111",
    // TODO p112
}

export const WeaponName: { [key in Weapon]: string } = {
    [Weapon.AirStrike]: "Air Strike",
    [Weapon.BGM]: "BGM",
    [Weapon.ARRifle]: "AR Rifle",
    [Weapon.AKRifle]: "AK Rifle",
    [Weapon.Pistol]: "Pistol",
    [Weapon.HuntingRifle]: "Hunting",
    [Weapon.RPG]: "RPG",
    [Weapon.Shotgun]: "Shotgun",
    [Weapon.SniperRifle]: "Sniper",
    [Weapon.SMG]: "SMG",
    [Weapon.Homing]: "Homing",
    [Weapon.Grenade]: "Grenade",
    [Weapon.HeliMinigun]: "Heli Minigun",
    [Weapon.TankMinigun]: "Tank Minigun",
    [Weapon.Knife]: "Knife",
    [Weapon.Revolver]: "Revolver",
    [Weapon.Minigun]: "Minigun",
    [Weapon.GrenadeLauncher]: "G. Launcher",
    [Weapon.Fists]: "Fists",
    [Weapon.VSS]: "VSS",
    [Weapon.FiftyCalSniper]: ".50 Cal Sniper",
    [Weapon.MGTurret]: "MG Turret",
    [Weapon.Crossbow]: "Crossbow",
    [Weapon.SCAR]: "SCAR",
    [Weapon.TacticalShotgun]: "Tactical Shotgun",
    [Weapon.VEK]: "VEK",
    [Weapon.LMG]: "LMG",
    [Weapon.LaserTripMine]: "Laser Trip Mine",
}
