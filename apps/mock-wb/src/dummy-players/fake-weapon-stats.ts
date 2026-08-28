import { faker } from "@faker-js/faker"
import { weapons } from "@warbrokers/types/src/weapon"

import { distribute, fakeRecord } from "./fake-record"

export function fakeWeaponStats(xp: number) {
    // todo: match distribution with production
    return (
        faker.helpers.maybe(
            () => {
                const totalKills = Math.floor(xp * faker.number.float({ min: 0.002, max: 0.01 }))
                const totalDeaths =
                    totalKills === 0
                        ? faker.number.int({
                              min: 0,
                              max: Math.max(1, Math.floor(xp * 0.005)),
                          })
                        : Math.max(
                              1,
                              Math.round(totalKills / faker.number.float({ min: 0.2, max: 5 })),
                          )
                const activeWeapons = faker.helpers.arrayElements(weapons, {
                    min: totalKills > 0 || totalDeaths > 0 ? 1 : 0,
                    max: weapons.length,
                })
                const killsPerWeapon = distribute({
                    keys: activeWeapons,
                    total: totalKills,
                })
                const deaths = distribute({ keys: activeWeapons, total: totalDeaths })
                const killsUnzoomed = fakeRecord({
                    keys: activeWeapons,
                    fakeValue: (weapon) =>
                        faker.number.int({ min: 0, max: killsPerWeapon[weapon] ?? 0 }),
                })
                const killsZoomed = fakeRecord({
                    keys: activeWeapons,
                    fakeValue: (weapon) => (killsPerWeapon[weapon] ?? 0) - killsUnzoomed[weapon],
                })
                const maxZeroKillShots = Math.max(100, Math.floor(Math.sqrt(xp) * 10))
                const fakeShots = (kills: number) => {
                    const fired =
                        kills === 0
                            ? faker.number.int(maxZeroKillShots)
                            : faker.number.int({ min: kills * 2, max: kills * 100 })
                    const minimumAccuracy = fired === 0 ? 0 : Math.max(0.05, kills / fired)
                    const hit = Math.max(
                        kills,
                        Math.floor(fired * faker.number.float({ min: minimumAccuracy, max: 0.75 })),
                    )

                    return { fired, hit }
                }
                const unzoomed = Object.fromEntries(
                    activeWeapons.map((weapon) => [weapon, fakeShots(killsUnzoomed[weapon])]),
                )
                const zoomed = Object.fromEntries(
                    activeWeapons.map((weapon) => [weapon, fakeShots(killsZoomed[weapon])]),
                )
                const shotsFiredUnzoomed = fakeRecord({
                    keys: activeWeapons,
                    fakeValue: (weapon) => unzoomed[weapon]?.fired ?? 0,
                })
                const shotsFiredZoomed = fakeRecord({
                    keys: activeWeapons,
                    fakeValue: (weapon) => zoomed[weapon]?.fired ?? 0,
                })
                const shotsHitUnzoomed = fakeRecord({
                    keys: activeWeapons,
                    fakeValue: (weapon) => unzoomed[weapon]?.hit ?? 0,
                })
                const shotsHitZoomed = fakeRecord({
                    keys: activeWeapons,
                    fakeValue: (weapon) => zoomed[weapon]?.hit ?? 0,
                })
                const totalShotsHit = fakeRecord({
                    keys: activeWeapons,
                    fakeValue: (weapon) => shotsHitUnzoomed[weapon] + shotsHitZoomed[weapon],
                })
                const killingWeapons = activeWeapons.filter(
                    (weapon) => (killsPerWeapon[weapon] ?? 0) > 0,
                )
                const mostKillsInRound = fakeRecord({
                    keys: killingWeapons,
                    fakeValue: (weapon) =>
                        faker.number.int({
                            min: 1,
                            max: Math.min(killsPerWeapon[weapon] ?? 1, 100),
                        }),
                })

                return {
                    shotsFiredUnzoomed,
                    shotsFiredZoomed,
                    shotsHitUnzoomed,
                    shotsHitZoomed,
                    damageDealt: fakeRecord({
                        keys: activeWeapons,
                        fakeValue: (weapon) => {
                            const hits = totalShotsHit[weapon]
                            return hits === 0
                                ? 0
                                : faker.number.float({
                                      min: hits,
                                      max: hits * 100,
                                      fractionDigits: 5,
                                  })
                        },
                    }),
                    damageReceived: fakeRecord({
                        keys: activeWeapons,
                        fakeValue: (weapon) => {
                            const weaponDeaths = deaths[weapon] ?? 0
                            return weaponDeaths === 0
                                ? 0
                                : faker.number.float({
                                      min: weaponDeaths,
                                      max: weaponDeaths * 200,
                                      fractionDigits: 5,
                                  })
                        },
                    }),
                    mostKillsBetweenDeaths: fakeRecord({
                        keys: killingWeapons,
                        fakeValue: (weapon) =>
                            faker.number.int({ min: 1, max: mostKillsInRound[weapon] }),
                    }),
                    mostKillsInRound,
                    killsPerWeapon,
                    deaths,
                    headshots: fakeRecord({
                        keys: activeWeapons,
                        fakeValue: (weapon) =>
                            faker.number.int({ min: 0, max: totalShotsHit[weapon] }),
                    }),
                    longestKill: fakeRecord({
                        keys: killingWeapons,
                        fakeValue: () =>
                            faker.number.float({ min: 0, max: 4000, fractionDigits: 5 }),
                    }),
                    totalKills,
                    totalDeaths,
                }
            },
            { probability: 0.9 },
        ) ?? null
    )
}

type WeaponStats = NonNullable<ReturnType<typeof fakeWeaponStats>>

function weaponStatValue<Key extends keyof WeaponStats>(
    weaponStats: ReturnType<typeof fakeWeaponStats>,
    key: Key,
) {
    return weaponStats?.[key] ?? null
}

export function fakeWeaponPlayerFields(weaponStats: ReturnType<typeof fakeWeaponStats>) {
    return {
        shots_fired_unzoomed: weaponStatValue(weaponStats, "shotsFiredUnzoomed"),
        shots_fired_zoomed: weaponStatValue(weaponStats, "shotsFiredZoomed"),
        shots_hit_unzoomed: weaponStatValue(weaponStats, "shotsHitUnzoomed"),
        shots_hit_zoomed: weaponStatValue(weaponStats, "shotsHitZoomed"),
        damage_dealt: weaponStatValue(weaponStats, "damageDealt"),
        damage_received: weaponStatValue(weaponStats, "damageReceived"),
        ...fakeRecord({
            keys: ["most_kills_between_deaths"] as const,
            fakeValue: () => weaponStatValue(weaponStats, "mostKillsBetweenDeaths"),
            randomOmission: "all-or-nothing",
        }),
        ...fakeRecord({
            keys: ["most_kills_in_round"] as const,
            fakeValue: () => weaponStatValue(weaponStats, "mostKillsInRound"),
            randomOmission: "all-or-nothing",
        }),
        kills_per_weapon: weaponStatValue(weaponStats, "killsPerWeapon"),
        deaths: weaponStatValue(weaponStats, "deaths"),
        headshots: weaponStatValue(weaponStats, "headshots"),
        ...fakeRecord({
            keys: ["longest_kill"] as const,
            fakeValue: () => weaponStatValue(weaponStats, "longestKill"),
            randomOmission: "all-or-nothing",
        }),
    }
}
