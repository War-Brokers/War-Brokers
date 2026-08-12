<script lang="ts">
    export let rows: number
    export let secondaryStat = false
</script>

{#each { length: rows } as _, index (index)}
    <tr class="skeleton-reveal h-10" aria-hidden="true">
        <td class="pr-4">
            <div class="ms-auto h-4 w-6 rounded bg-slate-500"></div>
        </td>
        <td class="pr-4">
            <div class="h-4 w-32 max-w-full rounded bg-slate-500"></div>
        </td>
        <td>
            <div class="h-4 w-20 rounded bg-slate-500"></div>
        </td>
        {#if secondaryStat}
            <td>
                <div class="h-4 w-12 rounded bg-slate-500"></div>
            </td>
        {/if}
    </tr>
{/each}
