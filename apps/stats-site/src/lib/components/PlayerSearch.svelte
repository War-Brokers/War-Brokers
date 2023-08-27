<script lang="ts">
    import debounce from "lodash/debounce"

    import trpc from "$lib/trpc"

    let inputError = ""
    let searchResult: Awaited<
        ReturnType<typeof trpc.players.searchByName.query>
    > = []

    export let handleSearchInput = debounce(async (e: Event) => {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        const text: string = e.target?.value

        if (!text) return

        searchResult = await trpc.players.searchByName.query({ query: text })
    }, 300)
</script>

<form
    on:submit|preventDefault={() => {}}
    class="flex h-14 w-full rounded-full px-7 dark:bg-gray-600"
>
    <div class="relative flex w-full flex-col">
        <label for="player-search" class="mt-1 text-sm font-black">
            Search
        </label>

        <input
            required
            type="search"
            id="player-search"
            autocomplete="off"
            maxlength="20"
            class="h-full bg-transparent pb-2 text-lg outline-none dark:text-gray-200"
            placeholder="Player Name"
            aria-invalid={inputError ? "true" : undefined}
            on:input={handleSearchInput}
        />
        <span class="mt-1 dark:text-red-500">{inputError}</span>

        {#if searchResult.length > 0}
            <div
                id="search-results"
                class="absolute top-20 h-96 max-h-96 w-full overflow-auto rounded-lg py-4 dark:bg-gray-600"
            >
                <div class="relative h-full overflow-y-scroll">
                    {#each searchResult as { nick, uid } (uid)}
                        <a
                            href="/players/{uid}"
                            class="flex w-full flex-col p-2 hover:dark:bg-gray-700"
                        >
                            <b class="text-lg">{nick}</b>
                            <p class="text-md dark:text-gray-400">{uid}</p>
                        </a>
                    {/each}
                </div>
            </div>
        {/if}
    </div>
</form>

<style>
    /* https://stackoverflow.com/a/9422689 */
    input[type="search"]::-webkit-search-decoration,
    input[type="search"]::-webkit-search-cancel-button,
    input[type="search"]::-webkit-search-results-button,
    input[type="search"]::-webkit-search-results-decoration {
        -webkit-appearance: none;
    }
</style>
