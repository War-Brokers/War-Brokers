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
    export let stats: readonly [LeaderboardValue, ...LeaderboardValue[]]
</script>

<tr class="p-9 whitespace-nowrap hover:bg-gray-700">
    <td class="pr-4 text-right">{rank}</td>
    <td class="pr-4 text-left">
        <div class="flex items-center gap-1">
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
        <td class="text-left">{stat}</td>
    {/each}
</tr>
