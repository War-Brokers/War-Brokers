<script lang="ts">
    import debounce from "lodash/debounce"
    import { writable } from "svelte/store"

    import Title from "$lib/components/title.svelte"

    import type { PageData } from "./$types"

    export let data: PageData
    const { squads } = data

    let searchTerm = writable("")
</script>

<Title title="Squads" />

<h2 class="mb-10 w-full text-center text-3xl font-black">Squads</h2>

<form
    on:submit|preventDefault={() => {}}
    novalidate={true}
    class="mb-5 flex h-12 w-full gap-4"
>
    <input
        id="squad-search"
        type="search"
        maxlength="20"
        autocomplete="off"
        aria-required="false"
        class="rounded-full border-none bg-gray-600 px-6 text-lg leading-7 text-gray-200 placeholder:text-gray-400 focus:ring-0"
        placeholder="Squad Name"
        on:input={debounce((e) => searchTerm.set(e.target.value || ""), 100)}
    />
</form>

<div class="flex flex-col items-center gap-5">
    {#await squads}
        Loading...
    {:then squads}
        {#each squads as squadName}
            {#if squadName
                .toLocaleLowerCase()
                .includes($searchTerm.toLocaleLowerCase())}
                <a
                    href={`/squads/${squadName}`}
                    class="w-full rounded-lg p-4 font-bold dark:bg-gray-900"
                >
                    <div>
                        {squadName}
                    </div>
                </a>
            {/if}
        {/each}
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
