import { expect, test } from "vitest"

import { string2number } from "./convert"

test("string2number", () => {
    expect(string2number("0")).toStrictEqual(0)
    expect(string2number("1000")).toStrictEqual(1000)
    expect(string2number("1,000")).toStrictEqual(1000)
    expect(string2number("69,420")).toStrictEqual(69420)
})
