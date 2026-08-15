<script lang="ts">
    import { resolve } from "$app/paths"
    import Title from "$lib/components/title.svelte"

    import type { PageData } from "./$types"

    export let data: PageData
    const { squads } = data

    let searchTerm = ""
</script>

<Title title="Squads" />

<h2 class="mb-10 w-full text-center text-3xl font-black">Squads</h2>

<form on:submit|preventDefault={() => {}} novalidate={true} class="mb-5 flex h-12 w-full gap-4">
    <input
        id="squad-search"
        type="search"
        maxlength="20"
        autocomplete="off"
        aria-required="false"
        bind:value={searchTerm}
        class="min-w-0 rounded-full border-none bg-gray-600 px-6 text-lg leading-7 text-gray-200 placeholder:text-gray-300 focus:ring-0"
        placeholder="Squad Name"
    />
</form>

<div class="flex min-h-96 flex-col items-center gap-5">
    {#await squads}
        <div class="skeleton-reveal w-full" aria-busy="true">
            <div class="flex w-full animate-pulse flex-col gap-5 motion-reduce:animate-none">
                {#each { length: 5 } as _, index (index)}
                    <div class="h-14 w-full rounded-lg bg-gray-700" aria-hidden="true"></div>
                {/each}
            </div>
        </div>
    {:then squads}
        {@const filteredSquads = squads.filter((squadName) =>
            squadName.toLocaleLowerCase().includes(searchTerm.toLocaleLowerCase()),
        )}
        {#if squads.length === 0}
            <p class="flex min-h-48 items-center text-gray-400" role="status">
                No squads are available.
            </p>
        {:else if filteredSquads.length === 0}
            <div
                class="flex min-h-48 flex-col items-center justify-center gap-4 text-center"
                role="status"
            >
                <p class="text-gray-400">No squads match “{searchTerm}”.</p>
                <button
                    type="button"
                    class="rounded-md bg-gray-600 px-4 py-2 font-medium hover:bg-gray-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-400 active:bg-gray-800"
                    on:click={() => {
                        searchTerm = ""
                    }}>Clear search</button
                >
            </div>
        {:else}
            {#each filteredSquads as squadName (squadName)}
                <a
                    href={resolve("/squads/[squadName]", { squadName })}
                    class="w-full rounded-lg p-4 font-bold dark:bg-gray-900"
                >
                    <div>
                        {squadName}
                    </div>
                </a>
            {/each}
        {/if}
    {:catch _}
        <p class="flex min-h-48 items-center font-bold text-red-400" role="status">
            Failed to load
        </p>
    {/await}
</div>

<style lang="postcss">
    /* https://stackoverflow.com/a/9422689 */
    input[type="search"]::-webkit-search-decoration,
    input[type="search"]::-webkit-search-cancel-button,
    input[type="search"]::-webkit-search-results-button,
    input[type="search"]::-webkit-search-results-decoration {
        -webkit-appearance: none;
    }
</style>
