<script lang="ts">
    import debounce from "lodash/debounce"
    import { Pulse } from "svelte-loading-spinners"

    import trpc from "$lib/trpc"
    import { cn } from "$lib/utils"

    let opened = false
    let searching = false
    let searchResult: Awaited<ReturnType<typeof trpc.players.searchByName.query>> = []
    let searchError = ""

    export let resultHref = (uid: string) => `/players/${uid}`
    export let inputId = "player-search"
    export let label = "Player search"
    export let placeholder = "Player Search"

    function getIssueCode(error: unknown): string | undefined {
        if (!(error instanceof Error)) return undefined

        try {
            const issues: unknown = JSON.parse(error.message)
            if (!Array.isArray(issues)) return undefined

            const issue: unknown = issues[0]
            if (
                typeof issue !== "object" ||
                issue === null ||
                !("code" in issue) ||
                typeof issue.code !== "string"
            ) {
                return undefined
            }

            return issue.code
        } catch {
            return undefined
        }
    }

    export let handleSearchInput = debounce(async (e: Event) => {
        searching = true
        const text = e.target instanceof HTMLInputElement ? e.target.value : ""

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
        } catch (error: unknown) {
            if (getIssueCode(error) === "too_small") {
                searchError = "nickname must be at least 2 letters long"
            }

            searching = false
            return
        }

        searching = false
        searchError = ""
    }, 300)
</script>

<div class="flex w-full flex-col items-center text-start font-normal">
    <form
        on:submit|preventDefault={() => {}}
        novalidate={true}
        class="flex h-12 w-full min-w-0 max-w-[36rem] items-center justify-center rounded-full pr-3 dark:bg-gray-600 sm:pr-7"
    >
        <div
            class={cn(
                "ml-2 flex h-5 w-5 shrink-0 items-center justify-center sm:ml-3 sm:h-7 sm:w-7",
                !searching && "opacity-0",
            )}
        >
            <Pulse size="28" color="#d1d5db" unit="px" duration="1s" />
        </div>
        <div class="relative flex w-full min-w-0 flex-col">
            <input
                required
                type="search"
                id={inputId}
                autocomplete="off"
                maxlength="20"
                aria-required="false"
                aria-label={label}
                class="my-auto h-full w-full min-w-0 border-none bg-transparent text-lg leading-7 focus:ring-0 dark:text-gray-200"
                {placeholder}
                on:input={handleSearchInput}
                on:focus={() => {
                    setTimeout(() => {
                        opened = true
                    }, 200)
                }}
                on:blur={() => {
                    setTimeout(() => {
                        opened = false
                    }, 200)
                }}
            />

            <div
                id="{inputId}-results"
                class={cn(
                    "absolute top-20 h-96 max-h-96 w-full overflow-auto rounded-lg py-4 dark:bg-gray-600",
                    (!opened || searchResult.length === 0) && "hidden",
                )}
            >
                <div class="relative h-full overflow-y-scroll">
                    {#each searchResult as { nick, squad, uid } (uid)}
                        <a
                            href={resultHref(uid)}
                            class="flex w-full flex-col p-2 hover:dark:bg-gray-700"
                        >
                            <b class="text-lg">
                                {#if squad}
                                    <span class="text-gray-400">[{squad}]</span>
                                {/if}
                                {nick}
                            </b>
                            <p class="text-base dark:text-gray-400">{uid}</p>
                        </a>
                    {/each}
                </div>
            </div>
        </div>
    </form>
    <p
        class={cn(
            "max-w-[36rem] text-base text-red-500",
            searchError === "" ? "invisible" : "visible",
        )}
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
