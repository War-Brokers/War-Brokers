import { expect, test } from "vitest"

import { xp2lv } from "./level"

test("xp2lv", () => {
    expect(() => xp2lv(0)).toThrow("XP can not be lower than 100 but got 0")

    expect(() => xp2lv(99)).toThrow("XP can not be lower than 100 but got 99")
    expect(xp2lv(100)).toEqual(1)

    expect(xp2lv(499)).toEqual(1)
    expect(xp2lv(500)).toEqual(2)

    expect(xp2lv(1499)).toEqual(2)
    expect(xp2lv(1500)).toEqual(3)

    expect(xp2lv(2999)).toEqual(3)
    expect(xp2lv(3000)).toEqual(4)

    expect(xp2lv(4999)).toEqual(4)
    expect(xp2lv(5000)).toEqual(5)

    expect(xp2lv(10_999)).toEqual(5)
    expect(xp2lv(11_000)).toEqual(6)

    expect(xp2lv(17_999)).toEqual(6)
    expect(xp2lv(18_000)).toEqual(7)

    expect(xp2lv(26_999)).toEqual(7)
    expect(xp2lv(27_000)).toEqual(8)

    expect(xp2lv(36_999)).toEqual(8)
    expect(xp2lv(37_000)).toEqual(9)

    expect(xp2lv(47_999)).toEqual(9)
    expect(xp2lv(48_000)).toEqual(10)

    expect(xp2lv(59_999)).toEqual(10)
    expect(xp2lv(60_000)).toEqual(11)

    expect(xp2lv(72_999)).toEqual(11)
    expect(xp2lv(73_000)).toEqual(12)

    expect(xp2lv(86_999)).toEqual(12)
    expect(xp2lv(87_000)).toEqual(13)

    expect(xp2lv(101_999)).toEqual(13)
    expect(xp2lv(102_000)).toEqual(14)

    expect(xp2lv(116_999)).toEqual(14)
    expect(xp2lv(117_000)).toEqual(15)

    expect(xp2lv(131_999)).toEqual(15)
    expect(xp2lv(132_000)).toEqual(16)

    expect(xp2lv(146_999)).toEqual(16)
    expect(xp2lv(147_000)).toEqual(17)

    expect(xp2lv(161_999)).toEqual(17)
    expect(xp2lv(162_000)).toEqual(18)

    expect(xp2lv(176_999)).toEqual(18)
    expect(xp2lv(177_000)).toEqual(19)

    expect(xp2lv(191_999)).toEqual(19)
    expect(xp2lv(192_000)).toEqual(20)

    expect(xp2lv(206_999)).toEqual(20)
    expect(xp2lv(207_000)).toEqual(21)

    expect(xp2lv(221_999)).toEqual(21)
    expect(xp2lv(222_000)).toEqual(22)

    expect(xp2lv(236_999)).toEqual(22)
    expect(xp2lv(237_000)).toEqual(23)

    expect(xp2lv(249_999)).toEqual(23)
    expect(xp2lv(250_000)).toEqual(24)

    expect(xp2lv(274_999)).toEqual(24)
    expect(xp2lv(275_000)).toEqual(25)

    expect(xp2lv(2_174_999)).toEqual(100)
    expect(xp2lv(2_175_000)).toEqual(101)
})
