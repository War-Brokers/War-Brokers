import { createTRPCRouter } from "@/trpc"

import ping from "./pingProcedure"
import playerRouter from "./playersRouter"
import statusRouter from "./statusRouter"

export const appRouter = createTRPCRouter({
    ping,
    players: playerRouter,
    status: statusRouter,
})

export type AppRouter = typeof appRouter
