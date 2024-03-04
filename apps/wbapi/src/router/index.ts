import { createTRPCRouter } from "@/trpc"

import ping from "./pingProcedure"
import playerRouter from "./playersRouter"
import squadRouter from "./squadRouter"
import statusRouter from "./statusRouter"

export const appRouter = createTRPCRouter({
    ping,
    players: playerRouter,
    squad: squadRouter,
    status: statusRouter,
})

export type AppRouter = typeof appRouter
