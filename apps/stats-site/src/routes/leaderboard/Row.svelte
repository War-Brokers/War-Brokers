<script lang="ts">
    import { resolve } from "$app/paths"
    import A from "$lib/components/A.svelte"
    import Stat from "$lib/components/stat.svelte"

    import type { LeaderboardValue } from "./types"

    export let rank: number
    export let nick: string
    export let squad: string | null
    export let uid: string
    export let percentile: Promise<number | undefined>
    export let barWidth: Promise<number>
    export let stats: readonly [LeaderboardValue, ...LeaderboardValue[]]
</script>

<tr class="relative isolate p-9 whitespace-nowrap hover:bg-gray-700">
    <td class="relative z-10 pr-4 text-right">{rank}</td>
    <td class="relative z-10 pr-4 text-left">
        <div class="relative flex items-center gap-1">
            <Stat iconOnly {percentile} />
            <A href={resolve("/players/[uid]", { uid })}>
                {#if squad}
                    <span class="text-gray-300">[{squad}]</span>
                {/if}
                {nick}
            </A>
        </div>
    </td>
    {#each stats as stat, index (index)}
        <td class="relative z-10 text-left">{stat}</td>
    {/each}
    {#await barWidth then width}
        <td
            colspan={stats.length + 2}
            class="pointer-events-none absolute inset-0 z-0 p-0"
            aria-hidden="true"
        >
            <span class="absolute bottom-0 left-0 h-1 bg-orange-500/80" style:width={`${width}%`}
            ></span>
        </td>
    {/await}
</tr>
