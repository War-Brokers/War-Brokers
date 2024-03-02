import { TRPCError } from "@trpc/server"

import { FailReason } from "@/util/types"

function tellDev(msg: string) {
    return `${msg}. Please tell the developers about it.`
}

export const SchemaTRPCError = new TRPCError({
    code: "INTERNAL_SERVER_ERROR",
    message: tellDev("Failed to validate data schema"),
})

export const APIConnectionTRPCError = new TRPCError({
    code: "INTERNAL_SERVER_ERROR",
    message: tellDev("Failed to connect to DB"),
})

export const DBConnectionTRPCError = new TRPCError({
    code: "INTERNAL_SERVER_ERROR",
    message: tellDev("Failed to connect to DB"),
})

export const StatsSiteConnectionTRPCError = new TRPCError({
    code: "INTERNAL_SERVER_ERROR",
    message: tellDev("Failed to connect to https://stats.warbrokers.io"),
})

export const UnknownTRPCError = new TRPCError({
    code: "INTERNAL_SERVER_ERROR",
    message: tellDev("An unknown error occurred"),
})

export function reason2TRPCError(reason: FailReason) {
    switch (reason) {
        case FailReason.APIConnectionFail:
            return UnknownTRPCError
        default:
            return UnknownTRPCError
    }
}
