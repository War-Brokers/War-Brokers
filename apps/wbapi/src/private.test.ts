import { isPrivate } from "./private"

it("classifies private and public IP addresses", () => {
    expect(isPrivate("192.168.1.1")).toStrictEqual(true)
    expect(isPrivate("255.255.255.255")).toStrictEqual(false)
    expect(isPrivate("::ffff:10.0.1.22")).toStrictEqual(true)
})
