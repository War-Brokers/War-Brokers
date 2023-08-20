import { initTRPC } from "@trpc/server"
import type { CreateExpressContextOptions } from "@trpc/server/adapters/express"
import type { OpenApiMeta } from "trpc-openapi"
import { ZodError } from "zod"

export function createContext(opts: CreateExpressContextOptions) {
    return opts
}

const t = initTRPC
    .meta<OpenApiMeta>()
    .context<typeof createContext>()
    .create({
        errorFormatter({ shape, error }) {
            return {
                ...shape,
                data: {
                    ...shape.data,
                    zodError:
                        error.cause instanceof ZodError
                            ? error.cause.flatten()
                            : null,
                },
            }
        },
    })

export const createTRPCRouter = t.router
export const publicProcedure = t.procedure
