import { TRPCError } from "@trpc/server"
import type { Player } from "@warbrokers/types/src/player"

import { FailReason } from "@/types"

function tellDev(msg: string) {
    return `${msg}. Please tell the developers about it.`
}

export const SchemaTRPCError = new TRPCError({
    code: "INTERNAL_SERVER_ERROR",
    message: tellDev("Failed to validate data schema"),
})

export const PlayerNotFoundTRPCError = (uid: Player["uid"]) =>
    new TRPCError({
        code: "NOT_FOUND",
        message: `Player with UID "${uid}" was not found. Is the UID valid?`,
    })

export const APIConnectionTRPCError = new TRPCError({
    code: "INTERNAL_SERVER_ERROR",
    message: tellDev("Failed to connect to DB"),
})

export const DBConnectionTRPCError = new TRPCError({
    code: "INTERNAL_SERVER_ERROR",
    message: tellDev("Failed to connect to DB"),
})

export const UnknownTRPCError = new TRPCError({
    code: "INTERNAL_SERVER_ERROR",
    message: tellDev("An unknown error occurred"),
})

export function reason2TRPCError(reason: FailReason) {
    switch (reason) {
        case FailReason.WBAPIConnectionFail:
            return UnknownTRPCError
        default:
            return UnknownTRPCError
    }
}
