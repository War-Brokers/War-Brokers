import { createTRPCRouter } from "@/trpc"

import pingRouter from "./pingRouter"
import playerRouter from "./playersRouter"
import statusRouter from "./statusRouter"

export const appRouter = createTRPCRouter({
    ping: pingRouter,
    players: playerRouter,
    status: statusRouter,
})

export type AppRouter = typeof appRouter
