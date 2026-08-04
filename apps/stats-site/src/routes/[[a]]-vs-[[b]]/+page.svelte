<script lang="ts">
    import { Button } from "flowbite-svelte"
    import { EditSolid } from "flowbite-svelte-icons"

    import { goto } from "$app/navigation"
    import A from "$lib/components/A.svelte"
    import PlayerSearch from "$lib/components/PlayerSearch.svelte"
    import Stat from "$lib/components/stat.svelte"
    import Title from "$lib/components/title.svelte"

    import type { PageData } from "./$types"

    export let data: PageData

    type Side = "a" | "b"
    const sides = ["a", "b"] as const satisfies Side[]
    type Leader = Side | "tie" | undefined

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

    function formatPlayerName(player: Awaited<PageData["a"]>) {
        if (player) {
            if (player.squad) return `[${player.squad}] ${player.nick}`
            return player.nick
        }
        return "?"
    }

    function formatPageTitle(
        a: Awaited<PageData["a"]> = undefined,
        b: Awaited<PageData["b"]> = undefined,
    ) {
        return `${formatPlayerName(a)} vs ${formatPlayerName(b)}`
    }

    /**
     * Prevent an invalid UID from making the page empty.
     */
    function playerOrUndefined(player: PageData["a"]) {
        return player?.catch(() => undefined)
    }

    function clearPlayer(side: Side, aUid?: string, bUid?: string) {
        void goto(side === "a" ? `/-vs-${bUid ?? ""}` : `/${aUid ?? ""}-vs-`)
    }

    function percentile(player: "a" | "b", rank: ComparisonStat["rank"]) {
        if (rank === "xp") {
            return player === "a" ? data.aXpPercentile : data.bXpPercentile
        }

        if (rank === "kills-elo") {
            return player === "a"
                ? data.aKillsEloPercentile
                : data.bKillsEloPercentile
        }

        if (rank === "games-elo") {
            return player === "a"
                ? data.aGamesEloPercentile
                : data.bGamesEloPercentile
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

    function comparisonStats(
        a: Awaited<NonNullable<PageData["a"]>>,
        b: Awaited<NonNullable<PageData["b"]>>,
    ): ComparisonStat[] {
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

{#await Promise.all([playerOrUndefined(data.a), playerOrUndefined(data.b)])}
    <Title title={formatPageTitle()} />
    <p class="w-full text-center text-gray-500 dark:text-gray-400">
        Loading...
    </p>
{:then [a, b]}
    <Title title={formatPageTitle(a, b)} />

    <section class="mx-auto w-full max-w-4xl" aria-label="Players to compare">
        <div
            class="relative mt-3 grid grid-cols-2 items-start gap-12 text-2xl font-black"
        >
            {#each sides as side (side)}
                {@const player = side === "a" ? a : b}
                <div
                    class="flex min-h-12 min-w-0 items-center gap-2 {side ===
                    'a'
                        ? 'justify-end text-end'
                        : 'justify-start text-start'}"
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
                            class="shrink-0 rounded-none p-2.5 text-gray-400 transition-[color,transform] duration-150 focus-within:ring-0 hover:text-orange-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-500 active:scale-[0.96] dark:hover:text-orange-400 {side ===
                            'a'
                                ? 'order-first'
                                : ''}"
                            aria-label={`Edit player ${side.toUpperCase()}`}
                            on:click={() => clearPlayer(side, a?.uid, b?.uid)}
                        >
                            <EditSolid size="md" aria-hidden="true" />
                        </Button>
                    {:else}
                        <PlayerSearch
                            inputId="player-{side}-search"
                            label="Search Player {side.toUpperCase()}"
                            placeholder="Search Player {side.toUpperCase()}"
                            resultHref={(uid) =>
                                side === "a"
                                    ? `/${uid}-vs-${data.bUid ?? ""}`
                                    : `/${data.aUid ?? ""}-vs-${uid}`}
                        />
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
        <section
            class="mx-auto mt-10 w-full max-w-4xl"
            aria-labelledby="stats-title"
        >
            <ul class="flex flex-col gap-3" role="list">
                {#each stats as stat (stat.label)}
                    {@const leader = getLeader(stat.a, stat.b)}
                    <li
                        class="grid grid-cols-2 items-stretch gap-1 rounded-2xl bg-gray-50 p-2 sm:min-h-24 sm:grid-cols-[minmax(0,1fr)_minmax(4rem,7rem)_minmax(0,1fr)] sm:gap-4 sm:p-3 dark:bg-gray-900"
                    >
                        <h3
                            class="col-span-2 col-start-1 row-start-1 flex items-center justify-start px-2 py-2 text-start text-xs font-bold text-gray-500 sm:col-span-1 sm:col-start-2 sm:justify-center sm:px-0 sm:py-0 sm:text-center sm:text-sm dark:text-gray-400"
                        >
                            {stat.label}
                        </h3>

                        {#each sides as side (side)}
                            {@const winChance =
                                side === "a"
                                    ? stat.aWinChance
                                    : stat.bWinChance}
                            <div
                                class="{side === 'a'
                                    ? 'col-start-1 sm:row-start-1'
                                    : 'col-start-2 sm:col-start-3 sm:row-start-1'} row-start-2 flex min-w-0 flex-col items-center justify-center rounded-xl px-1 py-3 text-center sm:px-2 {leader ===
                                side
                                    ? 'bg-orange-50 text-orange-800 ring-1 ring-inset ring-orange-200 dark:bg-orange-950/30 dark:text-orange-200 dark:ring-orange-800'
                                    : 'text-gray-900 dark:text-gray-100'}"
                            >
                                <Stat
                                    compact
                                    title=""
                                    data={formatValue(
                                        stat,
                                        side === "a" ? stat.a : stat.b,
                                    )}
                                    _id={stat.rank
                                        ? `${side}-${stat.rank}-percentile`
                                        : undefined}
                                    percentile={percentile(side, stat.rank)}
                                />
                                {#if winChance !== undefined}
                                    <span
                                        class="mt-0.5 text-xs font-bold text-gray-500 dark:text-gray-400"
                                    >
                                        {winChance.toFixed(2)}% chance of
                                        winning
                                    </span>
                                {/if}
                            </div>
                        {/each}
                    </li>
                {/each}
            </ul>
        </section>
    {/if}
{/await}
