<script lang="ts">
    import type { LeaderboardColumnHeader } from "./types"

    export let rows: number
    export let headers: readonly [LeaderboardColumnHeader, ...LeaderboardColumnHeader[]]
</script>

{#each { length: rows } as _, index (index)}
    <tr class="skeleton-reveal h-10" aria-hidden="true">
        <td class="pr-4">
            <div class="ms-auto h-4 w-6 rounded bg-gray-500"></div>
        </td>
        <td class="pr-4">
            <div class="h-4 w-32 max-w-full rounded bg-gray-500"></div>
        </td>
        {#each headers as header, index (index)}
            <td>
                <div class={`h-4 rounded bg-gray-500 ${header.skeletonClass ?? "w-20"}`}></div>
            </td>
        {/each}
    </tr>
{/each}
