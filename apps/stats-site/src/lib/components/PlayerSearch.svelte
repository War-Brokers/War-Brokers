<script lang="ts">
    import debounce from "lodash/debounce"

    let inputError = ""

    const handleSearchInput = debounce(async (e: Event) => {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        const text: string = e.target?.value

        if (!text || text.length < 3) return

        // todo: perform search
    }, 300)
</script>

<form
    on:submit|preventDefault={() => {}}
    class="mb-16 mt-6 flex h-14 w-full rounded-full pl-7 dark:bg-gray-600"
>
    <div class="flex w-full flex-col">
        <label for="player-search" class="mt-1 text-sm font-black">
            Search
        </label>

        <input
            required
            type="search"
            name="player-search"
            autocomplete="off"
            maxlength="20"
            class="h-full bg-transparent pb-2 text-lg outline-none dark:text-gray-200"
            placeholder="Player Name"
            aria-invalid={inputError ? "true" : undefined}
            on:input={handleSearchInput}
        />
        <span class="mt-1 dark:text-red-500">{inputError}</span>
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
