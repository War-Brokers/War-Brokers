<script lang="ts">
    import debounce from "lodash/debounce"
    import { onDestroy, onMount, tick } from "svelte"

    import { goto } from "$app/navigation"
    import trpc from "$lib/trpc"
    import { cn } from "$lib/utils"

    type SearchResult = Awaited<ReturnType<typeof trpc.players.searchByName.query>>[number]
    type SearchState = "idle" | "short" | "loading" | "results" | "empty" | "error"

    let rootElement: HTMLElement
    let focused = false
    let open = false
    let dismissed = false
    let composing = false
    let query = ""
    let announcement = ""
    let state: SearchState = "idle"
    let searchResults: SearchResult[] = []
    let highlightedIndex = -1
    let latestRequest = 0
    let message: string | undefined
    let messageIsError = false

    export let resultHref = (uid: string) => `/players/${uid}`
    export let inputId = "player-search"
    export let label = "Player search"
    export let placeholder = "Player Search"
    export let error: string | undefined = undefined

    $: highlightedResult = highlightedIndex >= 0 ? searchResults[highlightedIndex] : undefined
    $: activeOptionId = highlightedResult ? optionId(highlightedResult.uid) : undefined
    $: if (state === "error") {
        message = "Unable to search players. Try again."
    } else if (state === "empty") {
        message = `No players found for "${query}".`
    } else if (state === "short") {
        message = "Enter at least 2 characters."
    } else if (state === "idle") {
        message = error
    } else {
        message = undefined
    }
    $: messageIsError = state === "error" || (state === "idle" && Boolean(error))

    const runSearch = debounce(async (text: string, requestId: number) => {
        if (requestId !== latestRequest) return

        state = "loading"
        announcement = "Searching players..."
        open = focused && !dismissed

        try {
            const results = await trpc.players.searchByName.query({ query: text })
            if (requestId !== latestRequest) return

            searchResults = results
            state = results.length > 0 ? "results" : "empty"
            announcement =
                results.length > 0
                    ? `${results.length} ${results.length === 1 ? "player" : "players"} found.`
                    : `No players found for "${text}".`
        } catch {
            if (requestId !== latestRequest) return

            searchResults = []
            state = "error"
            announcement = "Unable to search players. Try again."
        }

        highlightedIndex = -1
        open = state === "results" && focused && !dismissed
    }, 300)

    function optionId(uid: string) {
        return `${inputId}-option-${uid}`
    }

    function updateQuery(text: string) {
        query = text
        latestRequest += 1
        const requestId = latestRequest

        runSearch.cancel()
        searchResults = []
        highlightedIndex = -1
        announcement = ""
        dismissed = false
        open = false

        if (text.length === 0) {
            state = "idle"
            return
        }

        if (text.length < 2) {
            state = "short"
            return
        }

        state = "idle"
        void runSearch(text, requestId)
    }

    function handleInput(event: Event & { currentTarget: EventTarget & HTMLInputElement }) {
        if (!(event.currentTarget instanceof HTMLInputElement)) return

        query = event.currentTarget.value
        if (composing || (event instanceof InputEvent && event.isComposing)) return

        updateQuery(query)
    }

    function handleCompositionStart() {
        composing = true
        latestRequest += 1
        runSearch.cancel()
        searchResults = []
        highlightedIndex = -1
        announcement = ""
        state = "idle"
        dismissed = false
        open = false
    }

    function handleCompositionEnd(event: CompositionEvent) {
        composing = false
        if (!(event.currentTarget instanceof HTMLInputElement)) return

        updateQuery(event.currentTarget.value)
    }

    function setHighlightedIndex(index: number) {
        highlightedIndex = index
        const result = searchResults[index]
        if (!result) return

        void tick().then(() => {
            document.getElementById(optionId(result.uid))?.scrollIntoView({ block: "nearest" })
        })
    }

    function handleKeydown(event: KeyboardEvent) {
        if (state !== "results" || searchResults.length === 0) {
            if (event.key === "Escape" && open) {
                event.preventDefault()
                dismissed = true
                open = false
            }
            return
        }

        switch (event.key) {
            case "ArrowDown":
                event.preventDefault()
                open = true
                setHighlightedIndex(
                    highlightedIndex < 0
                        ? 0
                        : Math.min(highlightedIndex + 1, searchResults.length - 1),
                )
                break
            case "ArrowUp":
                event.preventDefault()
                open = true
                setHighlightedIndex(
                    highlightedIndex < 0
                        ? searchResults.length - 1
                        : Math.max(highlightedIndex - 1, 0),
                )
                break
            case "Enter":
                if (!open || !highlightedResult) return

                event.preventDefault()
                latestRequest += 1
                runSearch.cancel()
                open = false
                void goto(resultHref(highlightedResult.uid))
                break
            case "Escape":
                if (!open) return

                event.preventDefault()
                highlightedIndex = -1
                dismissed = true
                open = false
                break
            case "Tab":
                highlightedIndex = -1
                open = false
                break
        }
    }

    function reopenCompletedSearch() {
        focused = true
        dismissed = false
        open = state === "results"
    }

    onMount(() => {
        function handlePointerDown(event: PointerEvent) {
            if (event.target instanceof Node && !rootElement.contains(event.target)) {
                highlightedIndex = -1
                open = false
            }
        }

        document.addEventListener("pointerdown", handlePointerDown)
        return () => {
            document.removeEventListener("pointerdown", handlePointerDown)
        }
    })

    onDestroy(() => {
        latestRequest += 1
        runSearch.cancel()
    })
</script>

<div bind:this={rootElement} class="flex w-full flex-col items-center text-start font-normal">
    <search aria-label={label} class="flex w-full flex-col items-center">
        <div
            class="flex h-12 w-full min-w-0 max-w-[36rem] items-center justify-center rounded-full pr-3 dark:bg-gray-600 sm:pr-7"
        >
            <div aria-hidden="true" class="ml-2 h-5 w-5 shrink-0 sm:ml-3 sm:h-7 sm:w-7"></div>
            <div class="relative flex w-full min-w-0 flex-col">
                <input
                    bind:value={query}
                    type="search"
                    id={inputId}
                    autocomplete="off"
                    maxlength="20"
                    role="combobox"
                    aria-autocomplete="list"
                    aria-haspopup="listbox"
                    aria-expanded={open && state === "results"}
                    aria-controls={state === "results" ? `${inputId}-results` : undefined}
                    aria-activedescendant={open && state === "results" ? activeOptionId : undefined}
                    aria-describedby={message ? `${inputId}-message` : undefined}
                    aria-invalid={messageIsError ? "true" : undefined}
                    aria-label={label}
                    class="my-auto h-full w-full min-w-0 border-none bg-transparent text-lg leading-7 focus:ring-0 dark:text-gray-200"
                    {placeholder}
                    on:input={handleInput}
                    on:keydown={handleKeydown}
                    on:compositionstart={handleCompositionStart}
                    on:compositionend={handleCompositionEnd}
                    on:focus={reopenCompletedSearch}
                    on:click={reopenCompletedSearch}
                    on:blur={() => {
                        focused = false
                        highlightedIndex = -1
                        open = false
                    }}
                />

                <div
                    aria-busy={state === "loading"}
                    class={cn(
                        "absolute top-20 h-96 max-h-96 w-full overflow-auto rounded-lg py-4 dark:bg-gray-600",
                        state === "loading" && "animate-pulse motion-reduce:animate-none",
                        !open && "hidden",
                    )}
                >
                    {#if state === "loading"}
                        <div class="skeleton-reveal space-y-4 px-2" aria-hidden="true">
                            {#each { length: 4 } as _}
                                <div class="space-y-2 p-2">
                                    <div class="h-5 w-32 rounded bg-gray-500"></div>
                                    <div class="h-4 w-48 max-w-full rounded bg-gray-500"></div>
                                </div>
                            {/each}
                        </div>
                    {:else if state === "results"}
                        <div
                            id={`${inputId}-results`}
                            role="listbox"
                            aria-label={`${label} results`}
                            class="relative h-full overflow-y-scroll"
                        >
                            {#each searchResults as { nick, squad, uid }, index (uid)}
                                <a
                                    id={optionId(uid)}
                                    href={resultHref(uid)}
                                    role="option"
                                    tabindex="-1"
                                    aria-selected={highlightedIndex === index}
                                    class={cn(
                                        "flex w-full flex-col p-2 hover:dark:bg-gray-700",
                                        highlightedIndex === index && "dark:bg-gray-700",
                                    )}
                                    on:pointerdown|preventDefault
                                    on:mouseenter={() => {
                                        setHighlightedIndex(index)
                                    }}
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
                    {/if}
                </div>
            </div>
        </div>

        <span
            id={`${inputId}-message`}
            class={cn(
                "min-h-6 max-w-[36rem] text-base",
                messageIsError ? "text-red-400" : "text-gray-400",
            )}
        >
            {message}
        </span>

        <p role="status" aria-live="polite" aria-atomic="true" class="sr-only">
            {announcement}
        </p>
    </search>
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
