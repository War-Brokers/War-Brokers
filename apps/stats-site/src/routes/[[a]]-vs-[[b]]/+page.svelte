<script lang="ts">
    import { Button } from "flowbite-svelte"
    import { EditSolid } from "flowbite-svelte-icons"

    import { goto } from "$app/navigation"
    import A from "$lib/components/A.svelte"
    import PlayerSearch from "$lib/components/PlayerSearch.svelte"
    import Stat from "$lib/components/stat.svelte"
    import Title from "$lib/components/title.svelte"
    import { cn } from "$lib/utils"

    import type { PageData } from "./$types"
    import type { PlayerSlot } from "./playerSlot"

    export let data: PageData

    type Side = "a" | "b"
    const sides = ["a", "b"] as const satisfies Side[]
    type Leader = Side | "tie"
    type ComparisonPlayer = Extract<PlayerSlot, { status: "found" }>["player"]

    type ComparisonStat = {
        label: string
        rank?: "xp" | "kills-elo" | "games-elo"
        format: "as-is" | "integer" | "decimal"
        a: number
        b: number
        aWinChance?: number
        bWinChance?: number
    }

    function getLeader(a: number, b: number): Leader {
        if (a === b) return "tie"
        return a > b ? "a" : "b"
    }

    function formatValue(stat: ComparisonStat, value: number | null) {
        if (value === null) return "Not available"

        switch (stat.format) {
            case "as-is":
                return value.toString()
            case "integer":
                return value.toLocaleString("en-US")
            case "decimal":
                return value.toFixed(2)
        }
    }

    function formatPlayerName(player: ComparisonPlayer | undefined) {
        if (player) {
            if (player.squad) return `[${player.squad}] ${player.nick}`
            return player.nick
        }
        return "?"
    }

    function formatPageTitle(a?: ComparisonPlayer, b?: ComparisonPlayer) {
        return `${formatPlayerName(a)} vs ${formatPlayerName(b)}`
    }

    function playerFromSlot(slot: PlayerSlot): ComparisonPlayer | undefined {
        return slot.status === "found" ? slot.player : undefined
    }

    function playerSlotError(slot: PlayerSlot): string | undefined {
        switch (slot.status) {
            case "invalid":
                return `Player UID "${slot.uid}" is invalid.`
            case "not-found":
                return `No player was found with UID "${slot.uid}".`
            case "unavailable":
                return "Failed to load stats for this player."
            case "found":
            case "empty":
                return undefined
        }
    }

    function routeUid(value: unknown): string {
        return typeof value === "string" ? value : ""
    }

    function clearPlayer(side: Side, aUid?: string, bUid?: string) {
        void goto(side === "a" ? `/-vs-${bUid ?? ""}` : `/${aUid ?? ""}-vs-`)
    }

    function percentile(player: "a" | "b", rank: ComparisonStat["rank"]) {
        if (rank === "xp") {
            return player === "a" ? data.aXpPercentile : data.bXpPercentile
        }

        if (rank === "kills-elo") {
            return player === "a" ? data.aKillsEloPercentile : data.bKillsEloPercentile
        }

        if (rank === "games-elo") {
            return player === "a" ? data.aGamesEloPercentile : data.bGamesEloPercentile
        }

        return undefined
    }

    /**
     * The probability of A winning against B.
     */
    function winChance(eloA: number, eloB: number) {
        const probability = 1 / (1 + 10 ** ((eloB - eloA) / 400)) // 0~1
        return 100 * probability
    }

    function comparisonStats(a: ComparisonPlayer, b: ComparisonPlayer): ComparisonStat[] {
        return [
            { label: "Level", format: "integer", a: a.level, b: b.level },
            { label: "XP", rank: "xp", format: "integer", a: a.xp, b: b.xp },
            {
                label: "Kills Elo",
                rank: "kills-elo",
                format: "decimal",
                a: a.killsELO,
                b: b.killsELO,
                aWinChance: winChance(a.killsELO, b.killsELO),
                bWinChance: winChance(b.killsELO, a.killsELO),
            },
            {
                label: "Games Elo",
                rank: "games-elo",
                format: "decimal",
                a: a.gamesELO,
                b: b.gamesELO,
                aWinChance: winChance(a.gamesELO, b.gamesELO),
                bWinChance: winChance(b.gamesELO, a.gamesELO),
            },
        ]
    }
</script>

{#await Promise.all([data.a, data.b])}
    <Title title={formatPageTitle()} />
    <p class="w-full text-center text-gray-500 dark:text-gray-400">Loading...</p>
{:then [aSlot, bSlot]}
    {@const a = playerFromSlot(aSlot)}
    {@const b = playerFromSlot(bSlot)}
    <Title title={formatPageTitle(a, b)} />

    <section class="mx-auto w-full max-w-4xl" aria-label="Players to compare">
        <div class="relative mt-3 grid grid-cols-2 items-start gap-12 text-2xl font-black">
            {#each sides as side (side)}
                {@const slot = side === "a" ? aSlot : bSlot}
                {@const player = side === "a" ? a : b}
                <div
                    class={cn(
                        "flex min-h-12 min-w-0 items-center gap-2",
                        side === "a" ? "justify-end text-end" : "justify-start text-start",
                    )}
                >
                    {#if player}
                        <A href="/players/{player.uid}">
                            {#if player.squad}
                                <span class="text-gray-400">
                                    [{player.squad}]
                                </span>
                            {/if}
                            <span class="text-balance break-all">
                                {player.nick}
                            </span>
                        </A>
                        <Button
                            type="button"
                            size="xs"
                            color="none"
                            class={cn(
                                "shrink-0 rounded-none p-2.5 text-gray-400 transition-[color,transform] duration-150 focus-within:ring-0 hover:text-orange-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-500 active:scale-[0.96] dark:hover:text-orange-400",
                                side === "a" && "order-first",
                            )}
                            aria-label={`Edit player ${side.toUpperCase()}`}
                            on:click={() => {
                                clearPlayer(side, a?.uid, b?.uid)
                            }}
                        >
                            <EditSolid size="md" aria-hidden="true" />
                        </Button>
                    {:else}
                        <div class="flex w-full min-w-0 flex-col gap-2 text-start">
                            <PlayerSearch
                                inputId="player-{side}-search"
                                label="Search Player {side.toUpperCase()}"
                                placeholder="Search Player {side.toUpperCase()}"
                                error={playerSlotError(slot)}
                                resultHref={(uid: string) =>
                                    side === "a"
                                        ? `/${uid}-vs-${routeUid(data.bUid)}`
                                        : `/${routeUid(data.aUid)}-vs-${uid}`}
                            />
                        </div>
                    {/if}
                </div>

                {#if side === "a"}
                    <span
                        class="absolute start-1/2 top-2 -translate-x-1/2 rounded-full px-3 py-2 text-xs uppercase tracking-wider text-gray-400"
                        >vs</span
                    >
                {/if}
            {/each}
        </div>
    </section>

    {#if a && b}
        {@const stats = comparisonStats(a, b)}
        <div class="mx-auto mt-10 w-full max-w-4xl">
            <table class="w-full table-fixed border-separate border-spacing-y-3">
                <caption class="sr-only">Player statistics comparison</caption>
                <colgroup>
                    <col class="w-[43%]" />
                    <col class="w-[14%]" />
                    <col class="w-[43%]" />
                </colgroup>
                <thead>
                    <tr>
                        <th id="player-a-column" scope="col" class="sr-only">
                            {formatPlayerName(a)}
                        </th>
                        <th scope="col" class="sr-only">Statistic</th>
                        <th id="player-b-column" scope="col" class="sr-only">
                            {formatPlayerName(b)}
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {#each stats as stat (stat.label)}
                        {@const leader = getLeader(stat.a, stat.b)}
                        {@const statHeaderId = `stat-${stat.label.toLowerCase().replaceAll(" ", "-")}`}
                        <tr>
                            {#each sides as side (side)}
                                {@const winChance =
                                    side === "a" ? stat.aWinChance : stat.bWinChance}
                                <td
                                    headers={`player-${side}-column ${statHeaderId}`}
                                    class={cn(
                                        "px-1 py-3 text-center align-middle sm:px-2",
                                        side === "a" ? "rounded-s-2xl" : "rounded-e-2xl",
                                        leader === side
                                            ? "bg-orange-50 text-orange-800 ring-1 ring-inset ring-orange-200 dark:bg-orange-950/30 dark:text-orange-200 dark:ring-orange-800"
                                            : "bg-gray-50 text-gray-900 dark:bg-gray-900 dark:text-gray-100",
                                    )}
                                >
                                    <div class="flex min-w-0 flex-col items-center justify-center">
                                        <span
                                            class="mb-1 text-[0.625rem] font-black uppercase tracking-wider"
                                        >
                                            {leader === "tie"
                                                ? "Tied"
                                                : leader === side
                                                  ? "Higher"
                                                  : "Lower"}
                                        </span>
                                        <Stat
                                            compact
                                            title=""
                                            data={formatValue(stat, side === "a" ? stat.a : stat.b)}
                                            _id={stat.rank
                                                ? `${side}-${stat.rank}-percentile`
                                                : undefined}
                                            percentile={percentile(side, stat.rank)}
                                        />
                                        {#if winChance !== undefined}
                                            <span
                                                class="mt-0.5 text-xs font-bold text-gray-500 dark:text-gray-400"
                                            >
                                                {winChance.toFixed(2)}% chance of winning
                                            </span>
                                        {/if}
                                    </div>
                                </td>

                                {#if side === "a"}
                                    <th
                                        id={statHeaderId}
                                        scope="row"
                                        class="bg-gray-50 px-1 py-3 text-center text-xs font-bold text-gray-500 dark:bg-gray-900 dark:text-gray-400 sm:px-2 sm:text-sm"
                                    >
                                        {stat.label}
                                    </th>
                                {/if}
                            {/each}
                        </tr>
                    {/each}
                </tbody>
            </table>
        </div>
    {/if}
{/await}
