import { createTRPCRouter } from "@/trpc"

import pingRouter from "./pingRouter"
import playerRouter from "./playersRouter"

export const appRouter = createTRPCRouter({
    ping: pingRouter,
    players: playerRouter,
})

export type AppRouter = typeof appRouter
