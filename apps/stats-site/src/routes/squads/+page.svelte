<script lang="ts">
    import Title from "$lib/components/title.svelte"

    import type { PageData } from "./$types"

    export let data: PageData
    const { squads } = data
</script>

<Title title="Squads" />

<h2 class="mb-10 w-full text-center text-3xl font-black">Squads</h2>
<div class="flex flex-col items-center gap-5">
    {#await squads}
        Loading...
    {:then squads}
        {#each squads as squad}
            <div class="w-full rounded-lg p-4 dark:bg-gray-900">
                <a href={`/squads/${squad}`} class="font-bold">{squad}</a>
            </div>
        {/each}
    {/await}
</div>
