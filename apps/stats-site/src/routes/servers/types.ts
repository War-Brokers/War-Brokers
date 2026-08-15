import type trpc from "$lib/trpc"

export type Servers = Awaited<ReturnType<typeof trpc.status.serverList.query>>
export type Server = Servers[number]
