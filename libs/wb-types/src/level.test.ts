import { expect, test } from "vitest"

import { xp2lvl } from "./level"

test("xp2lvl", () => {
    expect(() => xp2lvl(0)).toThrow("XP can not be lower than 100 but got 0")

    expect(() => xp2lvl(99)).toThrow("XP can not be lower than 100 but got 99")
    expect(xp2lvl(100)).toEqual(1)

    expect(xp2lvl(499)).toEqual(1)
    expect(xp2lvl(500)).toEqual(2)

    expect(xp2lvl(1499)).toEqual(2)
    expect(xp2lvl(1500)).toEqual(3)

    expect(xp2lvl(2999)).toEqual(3)
    expect(xp2lvl(3000)).toEqual(4)

    expect(xp2lvl(4999)).toEqual(4)
    expect(xp2lvl(5000)).toEqual(5)

    expect(xp2lvl(10_999)).toEqual(5)
    expect(xp2lvl(11_000)).toEqual(6)

    expect(xp2lvl(17_999)).toEqual(6)
    expect(xp2lvl(18_000)).toEqual(7)

    expect(xp2lvl(26_999)).toEqual(7)
    expect(xp2lvl(27_000)).toEqual(8)

    expect(xp2lvl(36_999)).toEqual(8)
    expect(xp2lvl(37_000)).toEqual(9)

    expect(xp2lvl(47_999)).toEqual(9)
    expect(xp2lvl(48_000)).toEqual(10)

    expect(xp2lvl(59_999)).toEqual(10)
    expect(xp2lvl(60_000)).toEqual(11)

    expect(xp2lvl(72_999)).toEqual(11)
    expect(xp2lvl(73_000)).toEqual(12)

    expect(xp2lvl(86_999)).toEqual(12)
    expect(xp2lvl(87_000)).toEqual(13)

    expect(xp2lvl(101_999)).toEqual(13)
    expect(xp2lvl(102_000)).toEqual(14)

    expect(xp2lvl(116_999)).toEqual(14)
    expect(xp2lvl(117_000)).toEqual(15)

    expect(xp2lvl(131_999)).toEqual(15)
    expect(xp2lvl(132_000)).toEqual(16)

    expect(xp2lvl(146_999)).toEqual(16)
    expect(xp2lvl(147_000)).toEqual(17)

    expect(xp2lvl(161_999)).toEqual(17)
    expect(xp2lvl(162_000)).toEqual(18)

    expect(xp2lvl(176_999)).toEqual(18)
    expect(xp2lvl(177_000)).toEqual(19)

    expect(xp2lvl(191_999)).toEqual(19)
    expect(xp2lvl(192_000)).toEqual(20)

    expect(xp2lvl(206_999)).toEqual(20)
    expect(xp2lvl(207_000)).toEqual(21)

    expect(xp2lvl(221_999)).toEqual(21)
    expect(xp2lvl(222_000)).toEqual(22)

    expect(xp2lvl(236_999)).toEqual(22)
    expect(xp2lvl(237_000)).toEqual(23)

    expect(xp2lvl(249_999)).toEqual(23)
    expect(xp2lvl(250_000)).toEqual(24)

    expect(xp2lvl(274_999)).toEqual(24)
    expect(xp2lvl(275_000)).toEqual(25)

    expect(xp2lvl(2_174_999)).toEqual(100)
    expect(xp2lvl(2_175_000)).toEqual(101)
})
