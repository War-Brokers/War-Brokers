import { describe, expect, it, vi } from "vitest"

import { loadPlayerSlot } from "./playerSlot"

const uid = "5d2ead35d142affb05757778"
const player = { uid, nick: "POMP" }

function trpcError(code?: string) {
    return Object.assign(new Error(code), {
        name: "TRPCClientError",
        data: code ? { code } : undefined,
    })
}

describe("loadPlayerSlot", () => {
    it("distinguishes an intentionally empty slot", async () => {
        const getPlayer = vi.fn()

        await expect(loadPlayerSlot(undefined, getPlayer)).resolves.toEqual({ status: "empty" })
        expect(getPlayer).not.toHaveBeenCalled()
    })

    it("distinguishes an invalid UID", async () => {
        const getPlayer = vi.fn()

        await expect(loadPlayerSlot("invalid", getPlayer)).resolves.toEqual({
            status: "invalid",
            uid: "invalid",
        })
        expect(getPlayer).not.toHaveBeenCalled()
    })

    it("returns a found player", async () => {
        await expect(loadPlayerSlot(uid, vi.fn().mockResolvedValue(player))).resolves.toEqual({
            status: "found",
            player,
        })
    })

    it("distinguishes a missing player", async () => {
        await expect(
            loadPlayerSlot(uid, vi.fn().mockRejectedValue(trpcError("NOT_FOUND"))),
        ).resolves.toEqual({ status: "not-found", uid })
    })

    it("distinguishes API and network failures", async () => {
        await expect(
            loadPlayerSlot(uid, vi.fn().mockRejectedValue(trpcError("INTERNAL_SERVER_ERROR"))),
        ).resolves.toEqual({ status: "unavailable", uid })
        await expect(
            loadPlayerSlot(uid, vi.fn().mockRejectedValue(new Error("offline"))),
        ).resolves.toEqual({ status: "unavailable", uid })
    })
})
