<script lang="ts">
    import type { TRPCClientError } from "@trpc/client"
    import type { AppRouter } from "@warbrokers/wbapi/build/router"
    import debounce from "lodash/debounce"
    import { Pulse } from "svelte-loading-spinners"
    import type { ZodIssue } from "zod"

    import trpc from "$lib/trpc"

    let opened = false
    let searching = false
    let searchResult: Awaited<
        ReturnType<typeof trpc.players.searchByName.query>
    > = []
    let searchError = ""

    export let handleSearchInput = debounce(async (e: Event) => {
        searching = true
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        const text: string = e.target?.value

        if (!text) {
            searchResult = []
            searching = false
            searchError = ""
            return
        }

        try {
            searchResult = await trpc.players.searchByName.query({
                query: text,
            })
        } catch (_e) {
            let e = (
                JSON.parse(
                    (_e as TRPCClientError<AppRouter>).message,
                )[0] as ZodIssue
            ).code

            switch (e) {
                case "too_small":
                    searchError = "nickname must be at least 2 letters long"
                    break
            }

            searching = false
            return
        }

        searching = false
        searchError = ""
    }, 300)
</script>

<div class="flex w-full flex-col items-center">
    <form
        on:submit|preventDefault={() => {}}
        novalidate={true}
        class="flex h-12 w-full min-w-0 max-w-[36rem] items-center justify-center rounded-full pr-7 dark:bg-gray-600"
    >
        <div
            class={`${!searching && "opacity-0"} ml-3 flex h-7 w-7 items-center justify-center`}
        >
            <Pulse size="28" color="#d1d5db" unit="px" duration="1s" />
        </div>
        <div class="relative flex w-full flex-col">
            <input
                required
                type="search"
                id="player-search"
                autocomplete="off"
                maxlength="20"
                aria-required="false"
                class="my-auto h-full border-none bg-transparent text-lg leading-7 focus:ring-0 dark:text-gray-200"
                placeholder="Player Search"
                on:input={handleSearchInput}
                on:focus={/**/ async () =>
                    setTimeout(() => (opened = true), 200)}
                on:blur={/* */ async () =>
                    setTimeout(() => (opened = false), 200)}
            />

            <div
                id="search-results"
                class={`${
                    !(opened && searchResult.length > 0) && "hidden"
                } absolute top-20 h-96 max-h-96 w-full overflow-auto rounded-lg py-4 dark:bg-gray-600`}
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
        </div>
    </form>
    <p
        class={`${searchError === "" ? "invisible" : "visible"} max-w-[36rem] text-red-500`}
    >
        {searchError || "invisible string to prevent layout shift"}
    </p>
</div>

<style lang="postcss">
    /* https://stackoverflow.com/a/9422689 */
    input[type="search"]::-webkit-search-decoration,
    input[type="search"]::-webkit-search-cancel-button,
    input[type="search"]::-webkit-search-results-button,
    input[type="search"]::-webkit-search-results-decoration {
        -webkit-appearance: none;
    }

    ::-webkit-scrollbar-track {
        @apply rounded-full bg-gray-700;
    }

    ::-webkit-scrollbar-thumb {
        @apply bg-gray-800;
    }
</style>
