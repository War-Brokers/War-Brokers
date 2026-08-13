import assert from "node:assert/strict"

import { faker } from "@faker-js/faker"
import { gameModes } from "@warbrokers/types/src/gameMode"
import { xp2lvl } from "@warbrokers/types/src/level"
import type { Player } from "@warbrokers/types/src/player"
import { vehicles } from "@warbrokers/types/src/vehicle"
import { weapons } from "@warbrokers/types/src/weapon"

const NUM_STATS = 50_000 // production has around 43k as of writing

/**
 * Generates option for faker.js with laplace distribution.
 */
function LaplaceOptions({
    min,
    max,
    mode,
    leftScale,
    rightScale,
    spikeProbability,
}: {
    min: number
    max: number
    mode: number
    leftScale: number
    rightScale: number
    spikeProbability: number
}) {
    return {
        min,
        max,
        distributor: (randomizer) => {
            if (randomizer.next() < spikeProbability) return (mode - min) / (max - min)

            let value: number

            do {
                const isLeft = randomizer.next() < leftScale / (leftScale + rightScale)
                const scale = isLeft ? leftScale : rightScale
                const distance = -scale * Math.log(1 - randomizer.next())
                value = mode + (isLeft ? -distance : distance)
            } while (value < min || value > max)

            return (value - min) / (max - min)
        },
    } as const satisfies Parameters<typeof faker.number.float>["0"]
}

/**
 * Generates option for faker.js with exponential distribution.
 */
function ExponentialOptions({
    min,
    max,
    scale,
    shape,
}: {
    min: number
    max: number
    scale: number
    shape: number
}) {
    // cumulative distribution function
    const cdf = (value: number) => 1 - Math.exp(-Math.pow(value / scale, shape))
    const minimumCdf = cdf(min)
    const maximumCdf = cdf(max)

    return {
        min,
        max,
        distributor: (randomizer) => {
            const probability = minimumCdf + randomizer.next() * (maximumCdf - minimumCdf)
            const value = scale * Math.pow(-Math.log(1 - probability), 1 / shape)

            return (value - min) / (max - min)
        },
    } as const satisfies Parameters<typeof faker.number.float>["0"]
}

type FakeRecordOptions<Key extends string, Value> = {
    keys: readonly Key[]
    fakeValue: (key: Key) => Value
}

/**
 * Generates a value for every supplied key. Random omission can apply to each
 * key independently or to the entire record. Empty results are `undefined`.
 */
function fakeRecord<const Key extends string, Value>(
    options: FakeRecordOptions<Key, Value> & { randomOmission: "subset" },
): Partial<Record<Key, Value>> | undefined
function fakeRecord<const Key extends string, Value>(
    options: FakeRecordOptions<Key, Value> & { randomOmission: "all-or-nothing" },
): Record<Key, Value> | undefined
function fakeRecord<const Key extends string, Value>(
    options: FakeRecordOptions<Key, Value> & { randomOmission?: never },
): Record<Key, Value>
function fakeRecord({
    keys,
    fakeValue,
    randomOmission,
}: {
    keys: readonly string[]
    fakeValue: (...args: never[]) => unknown
    randomOmission?: "subset" | "all-or-nothing"
}) {
    const generate = ({ randomSubset }: { randomSubset: boolean } = { randomSubset: false }) => {
        const record: Record<string, unknown> = {}

        for (const key of keys) {
            if (!randomSubset || faker.datatype.boolean({ probability: 0.9 })) {
                record[key] = Reflect.apply(fakeValue, undefined, [key])
            }
        }

        return record
    }

    if (randomOmission === "subset") {
        const record = generate({ randomSubset: true })
        return Object.keys(record).length === 0 ? undefined : record
    }

    if (randomOmission === "all-or-nothing") {
        const record = faker.helpers.maybe(() => generate(), { probability: 0.9 })
        return record === undefined || Object.keys(record).length === 0 ? undefined : record
    }

    return generate()
}

/**
 * Splits `total` randomly across all supplied `keys` while preserving the exact total.
 *
 * ```javascript
 * distribute({ keys: ["p61", "p62", "p67"], total: 100 })
 * ```
 *
 * Might return:
 *
 * ```javascript
 * {
 *     p61: 52,
 *     p62: 31,
 *     p67: 17,
 * }
 * ```
 *
 * and
 *
 * ```javascript
 * sumStats(distribute({ keys, total })) === total // is true
 * ```
 *
 * If keys is empty, it returns `{}`.
 */
function distribute({ keys, total }: { keys: readonly string[]; total: number }) {
    if (keys.length === 0) return {}

    const weights = keys.map(() => faker.number.float({ min: 0.01, max: 1 }))
    const totalWeight = weights.reduce((sum, weight) => sum + weight, 0)
    const distributed = fakeRecord({
        keys,
        fakeValue: (key) => {
            const weight = weights[keys.indexOf(key)] ?? 0
            return Math.floor((total * weight) / totalWeight)
        },
    })
    const remainder = total - Object.values(distributed).reduce((total, value) => total + value, 0)
    const firstKey = keys[0]

    if (firstKey !== undefined) distributed[firstKey] = (distributed[firstKey] ?? 0) + remainder

    assert.equal(
        Object.values(distributed).reduce((sum, value) => sum + value, 0),
        total,
        "Distributed values must sum to the requested total",
    )

    return distributed
}

export const stats: Player[] = [
    {
        nick: "POMP",
        nicklower: "pomp",
        level: 379,
        xp: 9127240,
        coins: 20,
        steam: true,
        time: 1742434763,
        squad: "LP",
        joinTime: 1564650224,
        banned: false,
        uid: "5d2ead35d142affb05757778",
        damage_received: {
            p62: 1043607.76026,
            p68: 330159.5837,
            p61: 1143703.22863,
            p66: 101474.21321,
            p64: 115171.5746,
            p93: 760895.05747,
            p71: 228692.6798805,
            p67: 789578.95,
            p94: 71185.5957,
            p11: 219721.12599,
            p09: 92244.28062,
            p80: 92047.0114,
            p92: 118125,
            p78: 63542.97128,
            p56: 9150.61151,
            p82: 4530.0864,
            p63: 51440.7215,
            p55: 15156.0874,
            p79: 117582.08117,
            p65: 45693.53299,
            p91: 8232.8331,
            p90: 73920,
            p69: 31015.8386,
            p89: 101869.1761,
            p53: 32835.38593,
            p52: 20657.8244,
            p76: 30500,
            p60: 8996.4356,
            p54: 13143.2088,
            p57: 29134.72374,
            p58: 21968.5166,
            p75: 13554.4141,
            p83: 9485.9548,
            p88: 17416.25,
            p86: 12543.0967,
            p87: 2608.7561,
            p59: 4599.5483,
            p85: 4238.6512,
            p84: 915.4906,
            p74: 4625.786,
            p95: 109756.09607,
            p111: 12650.65549,
            p112: 4208.03516,
            p98: 5999.553,
            p97: 1678.6415,
            p105: 5837.5,
            p101: 375,
            p96: 360,
            p110: 89.75207,
            p104: 1103.964,
        },
        deaths: {
            p68: 657,
            p66: 203,
            p64: 153,
            p67: 1579,
            p93: 1311,
            p94: 156,
            p11: 326,
            p61: 1824,
            p92: 314,
            p09: 149,
            p62: 1841,
            p56: 12,
            p55: 13,
            p79: 204,
            p78: 89,
            p90: 95,
            p89: 183,
            p63: 79,
            p69: 3,
            p71: 317,
            p53: 45,
            p65: 32,
            p58: 13,
            p82: 2,
            p57: 35,
            p76: 52,
            p52: 10,
            p75: 19,
            p80: 103,
            p86: 4,
            p87: 3,
            p83: 4,
            p60: 10,
            p54: 9,
            p88: 30,
            p91: 4,
            p59: 8,
            p74: 9,
            p85: 5,
            p95: 181,
            p111: 21,
            p98: 8,
            p97: 2,
            p105: 8,
            p96: 1,
            p112: 1,
            p104: 3,
        },
        number_of_jumps: 281446,
        shots_fired_unzoomed: {
            p62: 72191,
            p11: 635,
            p61: 64829,
            p09: 559,
            p71: 4405,
            p64: 3047,
            p68: 64297,
            p88: 2005,
            p67: 1590,
            p86: 310,
            p83: 287,
            p81: 1053,
            p53: 1547,
            p92: 458,
            p63: 2360,
            p54: 395,
            p91: 85,
            p76: 892,
            p55: 57,
            p59: 384,
            p57: 9437,
            p56: 446,
            p75: 73,
            p52: 105,
            p94: 9234,
            p85: 48,
            p58: 40,
            p89: 14500,
            p90: 1143,
            p82: 146,
            p93: 12526,
            p80: 1432,
            p84: 1440,
            p60: 48,
            p79: 23186,
            p69: 650,
            p87: 1452,
            p66: 9891,
            p65: 547,
            p78: 910,
            p95: 19368,
            p111: 46,
            p101: 3,
            p112: 12,
            p97: 163,
            p105: 42,
            p98: 12,
            p104: 15,
        },
        time_alive: 922282.5463884,
        time_alive_count: 10188,
        time_alive_longest: 980.244,
        damage_dealt: {
            p62: 314732.506515,
            p09: 50486.53449,
            p61: 358339.861653,
            p67: 1691467.221,
            p11: 214246.51038,
            p71: 262793.257609,
            p63: 12993.047,
            p64: 67189.30658,
            p93: 45413.4386,
            p94: 9347.95289,
            p60: 1688.4629,
            p90: 175230,
            p56: 3109.16207,
            p55: 7840.854,
            p82: 1229.9206,
            p86: 10250,
            p84: 1226.6394,
            p68: 131190.6764,
            p92: 166875,
            p53: 11139.7814,
            p54: 3565.7091,
            p57: 967.99254,
            p74: 879.0889,
            p83: 9301.1823,
            p91: 940.844,
            p59: 2553.15684,
            p52: 6588.9454,
            p75: 873.7018,
            p58: 4228.539,
            p88: 8700,
            p76: 70250,
            p65: 323864.31743,
            p89: 37164.3307,
            p66: 15213.9668,
            p78: 67224.92145,
            p85: 2418.1963,
            p80: 18948.0397,
            p87: 728.9554,
            p69: 44648.4528,
            p79: 21768.59016,
            p95: 37653.88996,
            p111: 1911.87585,
            p98: 2006.4731,
            p112: 135.3061,
            p97: 330.7828,
            p105: 1787.5,
            p104: 59,
            p126: 252,
        },
        kills_per_vehicle: {
            v30: 59369,
            v01: 40,
            v10: 209,
            v21: 190,
            v20: 35,
            v50: 25,
            v11: 51,
            v00: 63,
            v02: 13,
            v41: 47,
            v12: 39,
            v40: 37,
            v13: 25,
            v22: 12,
        },
        kills_per_weapon: {
            p62: 11194,
            p67: 14949,
            p61: 12838,
            p09: 349,
            p11: 393,
            p64: 1747,
            p94: 516,
            p93: 2127,
            p55: 35,
            p92: 1381,
            p53: 190,
            p57: 189,
            p74: 7,
            p91: 25,
            p90: 950,
            p71: 761,
            p54: 29,
            p56: 49,
            p52: 59,
            p58: 9,
            p68: 5295,
            p86: 29,
            p63: 140,
            p76: 246,
            p89: 1142,
            p59: 38,
            p75: 7,
            p78: 641,
            p83: 19,
            p82: 4,
            p85: 6,
            p69: 56,
            p87: 13,
            p65: 516,
            p66: 654,
            p60: 12,
            p79: 831,
            p80: 332,
            p88: 206,
            p84: 14,
            p95: 2028,
            p98: 24,
            p111: 8,
            p97: 18,
            p105: 19,
            p104: 7,
            p126: 2,
        },
        longest_kill: {
            p62: 1346.67,
            p09: 3866.68,
            p67: 3113.79,
            p61: 1755.36,
            p11: 3713.79,
            p64: 2365.6,
            p94: 255.065,
            p93: 1164.89,
            p55: 1952.84,
            p92: 2118.82,
            p53: 1707.38,
            p57: 2013.09,
            p74: 962.077,
            p90: 2598.35,
            p91: 553.67,
            p71: 386.4,
            p54: 1289.05,
            p56: 1155.36,
            p52: 1381.72,
            p58: 959.728,
            p68: 566.825,
            p86: 1727.97,
            p63: 668.506,
            p76: 26.3995,
            p89: 338.379,
            p59: 1796.88,
            p75: 649.356,
            p78: 1783.81,
            p83: 1867.89,
            p82: 801.946,
            p85: 1894.55,
            p69: 3347.91,
            p87: 804.76,
            p65: 2614.72,
            p66: 308.992,
            p60: 856.09,
            p79: 2582.23,
            p80: 593.039,
            p88: 22.8378,
            p84: 1078.88,
            p95: 527.065,
            p98: 582.013,
            p111: 323.09,
            p97: 339.488,
            p105: 1857.68,
            p104: 82.1983,
            p126: 176.259,
        },
        most_kills_between_deaths: {
            p62: 36,
            p09: 4,
            p61: 57,
            p67: 35,
            p11: 3,
            p64: 46,
            p93: 33,
            p94: 20,
            p55: 6,
            p92: 23,
            p53: 11,
            p57: 12,
            p74: 3,
            p90: 20,
            p91: 5,
            p71: 9,
            p54: 5,
            p56: 6,
            p52: 14,
            p58: 2,
            p68: 51,
            p86: 4,
            p63: 14,
            p76: 4,
            p89: 27,
            p59: 10,
            p75: 3,
            p78: 15,
            p83: 5,
            p82: 1,
            p85: 2,
            p69: 4,
            p87: 2,
            p65: 7,
            p66: 28,
            p60: 10,
            p79: 26,
            p80: 14,
            p88: 8,
            p84: 2,
            p95: 26,
            p98: 4,
            p111: 5,
            p97: 8,
            p105: 8,
            p104: 7,
            p126: 1,
        },
        shots_hit_unzoomed: {
            p09: 1571,
            p61: 14982,
            p71: 2544,
            p11: 594,
            p67: 746,
            p53: 289,
            p92: 251,
            p63: 617,
            p54: 228,
            p83: 194,
            p91: 8,
            p59: 152,
            p56: 94,
            p57: 3739,
            p75: 24,
            p52: 65,
            p94: 3229,
            p55: 23,
            p58: 13,
            p68: 16979,
            p90: 490,
            p82: 45,
            p86: 194,
            p93: 3342,
            p88: 1066,
            p62: 17684,
            p76: 450,
            p64: 846,
            p89: 3384,
            p60: 34,
            p80: 1088,
            p69: 339,
            p85: 17,
            p84: 93,
            p79: 8165,
            p78: 426,
            p66: 2920,
            p65: 534,
            p87: 113,
            p95: 4817,
            p111: 17,
            p112: 6,
            p97: 49,
            p105: 22,
            p98: 4,
            p104: 4,
        },
        headshots: {
            p62: 24683,
            p61: 32744,
            p67: 13720,
            p64: 3176,
            p94: 3261,
            p93: 6679,
            p55: 18,
            p68: 15020,
            p63: 551,
            p57: 6692,
            p74: 5,
            p91: 105,
            p56: 40,
            p52: 32,
            p53: 162,
            p58: 2,
            p89: 2901,
            p66: 3165,
            p59: 32,
            p75: 9,
            p78: 1095,
            p87: 14,
            p90: 758,
            p79: 2074,
            p84: 26,
            p95: 5535,
            p98: 70,
            p97: 96,
            p105: 19,
            p104: 22,
            p126: 7,
        },
        distance_driven: {
            v30: 1178026.766998,
            v40: 92827.4421,
            v41: 94602.733534,
            v13: 22267.385834,
            v22: 4745.73127,
            v01: 5679.571554,
            v23: 3697.86209,
            v21: 77401.50805,
            v20: 18144.502678,
            v00: 6107.319386,
            v12: 7146.956084,
            v10: 24416.772744,
            v02: 3610.975506,
            v11: 9674.69426,
        },
        distance_driven_count: {
            v30: 5586,
            v40: 90,
            v41: 71,
            v13: 64,
            v22: 13,
            v01: 38,
            v23: 16,
            v21: 106,
            v20: 45,
            v00: 37,
            v12: 19,
            v10: 79,
            v02: 30,
            v11: 33,
        },
        losses: {
            m10: 68,
            m00: 607,
            m09: 9,
            m08: 13,
            m07: 2,
        },
        most_kills_in_round: {
            p09: 4,
            p11: 3,
            p61: 57,
            p67: 43,
            p93: 50,
            p94: 24,
            p55: 6,
            p92: 32,
            p57: 12,
            p74: 3,
            p71: 9,
            p53: 14,
            p54: 5,
            p52: 14,
            p58: 2,
            p68: 51,
            p56: 9,
            p91: 4,
            p62: 71,
            p63: 16,
            p76: 5,
            p64: 49,
            p89: 41,
            p59: 16,
            p82: 1,
            p83: 3,
            p86: 4,
            p85: 2,
            p69: 4,
            p65: 10,
            p66: 29,
            p60: 10,
            p87: 2,
            p78: 25,
            p90: 26,
            p79: 31,
            p80: 14,
            p75: 3,
            p88: 8,
            p84: 2,
            p95: 34,
            p98: 4,
            p111: 6,
            p97: 8,
            p105: 8,
            p126: 1,
        },
        shots_fired_zoomed: {
            p62: 136740,
            p67: 41646,
            p61: 229552,
            p90: 2350,
            p64: 16011,
            p63: 1301,
            p93: 41362,
            p94: 6237,
            p60: 24,
            p56: 1588,
            p55: 203,
            p82: 325,
            p86: 38,
            p84: 900,
            p68: 41239,
            p92: 2208,
            p53: 4822,
            p52: 217,
            p54: 260,
            p57: 17594,
            p74: 440,
            p65: 1079,
            p91: 2307,
            p59: 1091,
            p75: 180,
            p89: 9606,
            p58: 111,
            p85: 117,
            p66: 7308,
            p80: 777,
            p78: 2558,
            p09: 1,
            p87: 921,
            p83: 10,
            p79: 25853,
            p95: 21530,
            p98: 365,
            p97: 283,
            p105: 128,
            p104: 95,
            p126: 45,
        },
        shots_hit_zoomed: {
            p62: 35849,
            p67: 19387,
            p61: 59855,
            p63: 464,
            p64: 5309,
            p93: 11644,
            p94: 1966,
            p60: 20,
            p90: 1017,
            p56: 289,
            p55: 76,
            p82: 143,
            p86: 23,
            p84: 82,
            p68: 12354,
            p92: 1134,
            p53: 1010,
            p54: 115,
            p57: 8030,
            p74: 64,
            p91: 297,
            p59: 217,
            p52: 95,
            p58: 44,
            p65: 913,
            p66: 2228,
            p75: 60,
            p89: 2398,
            p78: 1340,
            p09: 3,
            p85: 73,
            p87: 99,
            p83: 4,
            p79: 8651,
            p80: 431,
            p95: 6434,
            p98: 122,
            p97: 93,
            p105: 35,
            p104: 27,
            p126: 8,
        },
        wins: {
            m00: 1830,
            m11: 199,
            m10: 135,
            m09: 25,
            m08: 23,
            m07: 11,
        },
        frame_rate: 1227145.1394,
        frame_rate_count: 15652,
        ping_time: 2779028,
        ping_time_count: 16250,
        self_destructs: {
            v40: 5,
            v30: 46,
            v41: 7,
        },
        scuds_launched: 139,
        gamesELO: 2030.64,
        killsELO: 1889,
        zombie_kills: 1280,
        zombie_deaths: 57,
        zombie_time_alive: 32964.659,
        zombie_time_alive_count: 57,
        zombie_wins: 0,
    },
    ...faker.helpers.multiple(
        () => {
            // See libs/wb-types/src/player.ts for more info about nick length
            const nick = faker.string.fromCharacters(
                "0123456789" + // numbers
                    "ABCDEFGHIJKLMNOPQRSTUVWXYZ" + // upper case
                    "abcdefghijklmnopqrstuvwxyz" + // lower case
                    "!\"#$%&'()*+,-./:;<=>?@[\\]^_`{|}~" + // ASCII special characters
                    // cspell:disable
                    "ÀÁÂÃÄÅÆÇÈÉÊËÌÍÎÏÐÑÒÓÔÕÖØÙÚÛÜÝÞß" +
                    "àáâãäåæçèéêëìíîïðñòóôõöøùúûüýþÿŒœŠšŽž" +
                    "ΑΒΓΔΕΖΗΘΙΚΛΜΝΞΟΠΡΣΤΥΦΧΨΩαβγδεζηθικλμνξοπρστυφχψω" +
                    "АБВГДЕЁЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯ" +
                    "абвгдеёжзийклмнопрстуфхцчшщъыьэюя" +
                    "אבגדהוזחטיךכלםמןנסעףפץצקרשת" +
                    "ابتثجحخدذرزسشصضطظعغفقكلمنهوي" +
                    "あいうえおかきくけこさしすせそたちつてとなにぬねの" +
                    "アイウエオカキクケコサシスセソタチツテトナニヌネノ" +
                    "中文日本語漢字한국어" +
                    "¡¿§¶©®™°±×÷†‡•…‰′″№" +
                    "¢£¤¥€₩₹₽₿" +
                    "←↑→↓↔↕↖↗↘↙⇐⇑⇒⇓⇔" +
                    "∀∂∃∅∆∇∈∉∋∏∑−√∞∧∨∩∪≈≠≤≥" +
                    "⌘⌥⌫⏎⏏⌛⏰" +
                    "─━│┃┌┐└┘├┤┬┴┼═║╔╗╚╝╬" +
                    "■□▪▫▲△▶▷▼▽◀◁◆◇○●◉◎" +
                    "★☆☀☁☂☃☎☕☘☠☢☣☮☯☸♀♂♠♡♢♣♤♥♦♧♪♫⚑⚡⚔⚙⚠" +
                    "✓✔✕✖✚✦✧❄❖❗❓❤➕➖➗" +
                    "😀😁😂😎🤖👻💀👽🔥💧🎃🎮🎯🏆🚀🛡🗡💣💥",
                // cspell:enable
                { min: 2, max: 20 },
            )

            // roughly matches actual production distribution
            const xp = faker.number.int(
                ExponentialOptions({
                    min: 100, // minimum allowed xp
                    max: 100_000_000,
                    scale: 65_000,
                    shape: 0.32,
                }),
            )

            // todo: match distribution with production
            const weaponStats =
                faker.helpers.maybe(
                    () => {
                        const totalKills = Math.floor(
                            xp * faker.number.float({ min: 0.002, max: 0.01 }),
                        )
                        const totalDeaths =
                            totalKills === 0
                                ? faker.number.int({
                                      min: 0,
                                      max: Math.max(1, Math.floor(xp * 0.005)),
                                  })
                                : Math.max(
                                      1,
                                      Math.round(
                                          totalKills / faker.number.float({ min: 0.2, max: 5 }),
                                      ),
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
                            fakeValue: (weapon) =>
                                (killsPerWeapon[weapon] ?? 0) - killsUnzoomed[weapon],
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
                                Math.floor(
                                    fired * faker.number.float({ min: minimumAccuracy, max: 0.75 }),
                                ),
                            )

                            return { fired, hit }
                        }
                        const unzoomed = Object.fromEntries(
                            activeWeapons.map((weapon) => [
                                weapon,
                                fakeShots(killsUnzoomed[weapon]),
                            ]),
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
                            fakeValue: (weapon) =>
                                shotsHitUnzoomed[weapon] + shotsHitZoomed[weapon],
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
            const totalKills = weaponStats?.totalKills ?? 0
            const totalDeaths = weaponStats?.totalDeaths ?? 0
            const vehicleStats =
                faker.helpers.maybe(() => {
                    const activeVehicles = faker.helpers.arrayElements(vehicles, {
                        min: totalKills > 0 ? 1 : 0,
                        max: vehicles.length,
                    })
                    const distanceDrivenCount = fakeRecord({
                        keys: activeVehicles,
                        fakeValue: () => faker.number.int(100),
                    })

                    return {
                        selfDestructs: fakeRecord({
                            keys: activeVehicles,
                            fakeValue: () => faker.number.int(20),
                        }),
                        distanceDriven: fakeRecord({
                            keys: activeVehicles,
                            fakeValue: (vehicle) =>
                                distanceDrivenCount[vehicle] *
                                faker.number.float({
                                    min: 0,
                                    max: 10_000,
                                    fractionDigits: 5,
                                }),
                        }),
                        distanceDrivenCount,
                        killsPerVehicle: distribute({
                            keys: activeVehicles,
                            total: totalKills,
                        }),
                    }
                }) ?? null
            const zombieDeaths = faker.number.int(100)
            const zombieTimeAliveCount = faker.number.int({ min: zombieDeaths, max: 1000 })
            const zombieTimeAlive =
                zombieTimeAliveCount === 0
                    ? 0
                    : faker.number.float({
                          min: 0,
                          max: zombieTimeAliveCount * 1000,
                          fractionDigits: 5,
                      })
            const timeAlive =
                totalKills === 0 ? 0 : (totalKills / faker.number.float({ min: 0.05, max: 5 })) * 60
            const timeAliveCount = timeAlive === 0 ? 0 : totalDeaths + 1
            const averageTimeAlive = timeAliveCount === 0 ? 0 : timeAlive / timeAliveCount
            const timeAliveLongest =
                timeAliveCount === 0
                    ? 0
                    : timeAliveCount === 1
                      ? timeAlive
                      : faker.number.float({
                            min: averageTimeAlive,
                            max: Math.min(timeAlive, Math.max(averageTimeAlive * 5, 2000)),
                            fractionDigits: 5,
                        })
            const pingTimeCount = faker.number.int(20_000)
            const frameRateCount = faker.number.int(20_000)
            const lastSession = faker.date.past({ years: 1 })
            const joinedAt = faker.date.past({ years: 5, refDate: lastSession })
            const timeAliveFields = fakeRecord({
                keys: ["time_alive_count", "time_alive_longest", "time_alive"] as const,
                fakeValue: (key) => {
                    switch (key) {
                        case "time_alive_count":
                            return timeAliveCount
                        case "time_alive_longest":
                            return timeAliveLongest
                        case "time_alive":
                            return timeAlive
                    }
                },
                randomOmission: "all-or-nothing",
            })

            return {
                uid: faker.database.mongodbObjectId(),
                nick,
                nicklower: nick.toLocaleLowerCase(),
                level: xp2lvl(xp),
                xp,
                coins:
                    faker.helpers.maybe(
                        () =>
                            faker.number.int({
                                min: 0,
                                max: 1_000_000, // roughly matching production max
                                // todo: use exponential distributor
                            }),
                        { probability: 0.5 }, // Default is 0.5 but we're making it explicit here.
                    ) ?? null,
                squad:
                    faker.helpers.maybe(
                        () => faker.helpers.arrayElement(["SQUAD1", "SQUAD2", "SQUAD3", "SQUAD4"]),
                        { probability: 0.8 },
                    ) ?? "",
                killsELO: faker.number.float(
                    // roughly matches production distribution
                    LaplaceOptions({
                        min: 1150,
                        max: 2250,
                        mode: 1500,
                        leftScale: 56,
                        rightScale: 82,
                        spikeProbability: 0.06,
                    }),
                ),
                gamesELO: faker.number.float(
                    // roughly matches production distribution
                    LaplaceOptions({
                        min: 550,
                        max: 3350,
                        mode: 1500,
                        leftScale: 78,
                        rightScale: 136,
                        spikeProbability: 0.21,
                    }),
                ),
                wins:
                    fakeRecord({
                        keys: gameModes,
                        fakeValue: () => faker.number.int(1000),
                        randomOmission: "subset",
                    }) ?? null,
                losses:
                    fakeRecord({
                        keys: gameModes,
                        fakeValue: () => faker.number.int(1000),
                        randomOmission: "subset",
                    }) ?? null,
                number_of_jumps:
                    faker.helpers.maybe(() => faker.number.int({ min: 1, max: 10_000 })) ?? null,
                scuds_launched:
                    faker.helpers.maybe(() => faker.number.int({ min: 1, max: 10_000 })) ?? null,
                zombie_kills: faker.number.int(1000),
                zombie_deaths: zombieDeaths,
                ...fakeRecord({
                    keys: ["zombie_time_alive", "zombie_time_alive_count"] as const,
                    fakeValue: (key) =>
                        key === "zombie_time_alive" ? zombieTimeAlive : zombieTimeAliveCount,
                    randomOmission: "all-or-nothing",
                }),
                zombie_wins: faker.number.int(100),
                self_destructs: vehicleStats?.selfDestructs ?? null,
                distance_driven: vehicleStats?.distanceDriven ?? null,
                distance_driven_count: vehicleStats?.distanceDrivenCount ?? null,
                kills_per_vehicle: vehicleStats?.killsPerVehicle ?? null,
                shots_fired_unzoomed: weaponStats?.shotsFiredUnzoomed ?? null,
                shots_fired_zoomed: weaponStats?.shotsFiredZoomed ?? null,
                shots_hit_unzoomed: weaponStats?.shotsHitUnzoomed ?? null,
                shots_hit_zoomed: weaponStats?.shotsHitZoomed ?? null,
                damage_dealt: weaponStats?.damageDealt ?? null,
                damage_received: weaponStats?.damageReceived ?? null,
                ...fakeRecord({
                    keys: ["most_kills_between_deaths"] as const,
                    fakeValue: () => weaponStats?.mostKillsBetweenDeaths ?? null,
                    randomOmission: "all-or-nothing",
                }),
                ...fakeRecord({
                    keys: ["most_kills_in_round"] as const,
                    fakeValue: () => weaponStats?.mostKillsInRound ?? null,
                    randomOmission: "all-or-nothing",
                }),
                kills_per_weapon: weaponStats?.killsPerWeapon ?? null,
                deaths: weaponStats?.deaths ?? null,
                headshots: weaponStats?.headshots ?? null,
                ...fakeRecord({
                    keys: ["longest_kill"] as const,
                    fakeValue: () => weaponStats?.longestKill ?? null,
                    randomOmission: "all-or-nothing",
                }),
                banned: false,
                ...fakeRecord({
                    keys: ["steam"] as const,
                    fakeValue: () => faker.helpers.arrayElement([true, false, null]),
                    randomOmission: "all-or-nothing",
                }),
                time: Math.floor(lastSession.getTime() / 1000),
                joinTime: Math.floor(joinedAt.getTime() / 1000),
                ...fakeRecord({
                    keys: ["ping_time", "ping_time_count"] as const,
                    fakeValue: (key) =>
                        key === "ping_time_count"
                            ? pingTimeCount
                            : faker.number.int({
                                  min: pingTimeCount * 5,
                                  max: pingTimeCount * 300,
                              }),
                    randomOmission: "all-or-nothing",
                }),
                ...fakeRecord({
                    keys: ["frame_rate", "frame_rate_count"] as const,
                    fakeValue: (key) =>
                        key === "frame_rate_count"
                            ? frameRateCount
                            : frameRateCount === 0
                              ? 0
                              : faker.number.float({
                                    min: frameRateCount * 15,
                                    max: frameRateCount * 240,
                                    fractionDigits: 5,
                                }),
                    randomOmission: "all-or-nothing",
                }),
                ...timeAliveFields,
            } satisfies Player
        },
        { count: NUM_STATS - 1 }, // minus one for pomp
    ),
]

// todo: incomplete
export const dailyStats: (Pick<Player, "uid" | "nick" | "nicklower"> & Partial<Player>)[] = []
