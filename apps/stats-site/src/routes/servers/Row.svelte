<script lang="ts">
    import { TableBodyCell, TableBodyRow } from "flowbite-svelte"

    export let name: string
    export let playerCount: number
    export let maxPlayers: number
</script>

<TableBodyRow>
    <TableBodyCell>
        <div class="font-bold">{name}</div>
    </TableBodyCell>
    <TableBodyCell tdClass="text-center">WIP</TableBodyCell>
    <TableBodyCell tdClass="text-center">WIP</TableBodyCell>
    <TableBodyCell tdClass="text-center">WIP</TableBodyCell>
    <TableBodyCell tdClass="text-center">
        {#if playerCount === maxPlayers}
            <div class="dark:text-red-500">
                {playerCount} / {maxPlayers}
            </div>
        {:else if playerCount === 0}
            <div class="dark:text-gray-400">
                {playerCount} / {maxPlayers}
            </div>
        {:else}
            <div class="font-bold">
                {playerCount} / {maxPlayers}
            </div>
        {/if}
    </TableBodyCell>
</TableBodyRow>
