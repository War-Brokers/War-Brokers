/**
 * Models one side of a player comparison and classifies route and API outcomes into explicit UI states.
 */
import type { Player } from "@warbrokers/types/src/player"

export type PlayerSlot =
    | { status: "empty" }
    | { status: "invalid"; uid: string }
    | { status: "not-found"; uid: string }
    | { status: "unavailable"; uid: string }
    | { status: "found"; player: Player }

const uidPattern = /^[0-9a-fA-F]{24}$/

export function isValidPlayerUid(uid: string | undefined): uid is string {
    return typeof uid === "string" && uidPattern.test(uid)
}

function getTRPCErrorCode(error: unknown): string | undefined {
    if (!(error instanceof Error) || error.name !== "TRPCClientError" || !("data" in error)) {
        return undefined
    }

    const data = error.data
    if (typeof data !== "object" || data === null || !("code" in data)) return undefined

    return typeof data.code === "string" ? data.code : undefined
}

export async function loadPlayerSlot(
    uid: string | undefined,
    getPlayer: (uid: string) => Promise<Player>,
): Promise<PlayerSlot> {
    if (!uid) return { status: "empty" }
    if (!isValidPlayerUid(uid)) return { status: "invalid", uid }

    try {
        return { status: "found", player: await getPlayer(uid) }
    } catch (error) {
        return getTRPCErrorCode(error) === "NOT_FOUND"
            ? { status: "not-found", uid }
            : { status: "unavailable", uid }
    }
}
