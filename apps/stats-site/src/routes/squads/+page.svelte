<script lang="ts">
    import DataTable from "$lib/components/data-table/data-table.svelte"
    import Title from "$lib/components/title.svelte"

    import type { PageData } from "./$types"
    import { squadColumns } from "./columns"

    type Squad = PageData["squads"][number]
    export let data: PageData
    const { squads } = data

    let searchTerm = ""

    function filterSquads(squads: Squad[], query: string) {
        return squads.filter((squad) =>
            squad.squad.toLocaleLowerCase().includes(query.toLocaleLowerCase()),
        )
    }

    const tableProps = {
        ariaLabel: "squads",
        caption: "Squad list",
        columns: squadColumns,
        getRowId: (squad: Squad) => squad.squad,
        initialSorting: [{ id: "squad", desc: false }],
    }
</script>

<Title title="Squads" />

<h2 class="mb-10 w-full text-center text-3xl font-black">Squads</h2>

<form
    class="mb-4 flex flex-wrap items-end gap-3"
    onsubmit={(event) => {
        event.preventDefault()
    }}
>
    <div class="flex min-w-0 flex-1 flex-col gap-1 sm:max-w-sm">
        <label for="squad-search" class="text-sm font-bold text-gray-300">Filter squads</label>
        <input
            id="squad-search"
            name="search"
            type="search"
            maxlength="20"
            autocomplete="off"
            spellcheck="false"
            bind:value={searchTerm}
            class="h-10 min-w-0 rounded-lg border border-gray-600 bg-gray-600 px-3 text-base leading-6 text-gray-100 placeholder:text-gray-300 focus-visible:border-orange-400 focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-orange-400"
            placeholder="Squad Name"
        />
    </div>
</form>

<DataTable
    {...tableProps}
    data={filterSquads(squads, searchTerm)}
    emptyMessage={squads.length === 0
        ? "No squads are available."
        : `No squads match “${searchTerm}”.`}
/>

<style lang="postcss">
    /* https://stackoverflow.com/a/9422689 */
    input[type="search"]::-webkit-search-decoration,
    input[type="search"]::-webkit-search-cancel-button,
    input[type="search"]::-webkit-search-results-button,
    input[type="search"]::-webkit-search-results-decoration {
        -webkit-appearance: none;
    }
</style>
