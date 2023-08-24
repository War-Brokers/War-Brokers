import { TRPCError } from "@trpc/server"

export const AbortError = new TRPCError({
    code: "INTERNAL_SERVER_ERROR",
    message: `Sorry, we were not able to fetch your data :(`,
})
