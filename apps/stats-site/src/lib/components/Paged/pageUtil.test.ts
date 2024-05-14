import { expect, test } from "vitest"

import { defaultValue, parsePage } from "./pageUtil"

// prettier-ignore
test("parsePage", () => {
    const LIMIT = 30

    // invalid
    expect(parsePage(null, LIMIT)).toStrictEqual(defaultValue)
    expect(parsePage("0", LIMIT)).toStrictEqual(defaultValue)
    expect(parsePage("-9", LIMIT)).toStrictEqual(defaultValue)
    expect(parsePage("+9", LIMIT)).toStrictEqual(defaultValue)
    expect(parsePage("NaN", LIMIT)).toStrictEqual(defaultValue)
    expect(parsePage("asdf", LIMIT)).toStrictEqual(defaultValue)
    expect(parsePage("12345678901", LIMIT)).toStrictEqual(defaultValue)

    // valid
    expect(parsePage("1", LIMIT)).toStrictEqual({ page: 1,         offset: 0,               invalidated: false })
    expect(parsePage("2", LIMIT)).toStrictEqual({ page: 2,         offset: LIMIT*(2-1),     invalidated: false })
    expect(parsePage("03", LIMIT)).toStrictEqual({ page: 3,        offset: LIMIT*(3-1),     invalidated: false })
    expect(parsePage("12345", LIMIT)).toStrictEqual({ page: 12345, offset: LIMIT*(12345-1), invalidated: false })
    expect(parsePage("1234567890", LIMIT)).toStrictEqual({ page: 1234567890, offset: LIMIT*(1234567890-1), invalidated: false })
})
