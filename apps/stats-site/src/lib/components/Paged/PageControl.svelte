<script lang="ts">
    import { writable } from "svelte/store"
    import Icon from "svelte-awesome"
    import arrowLeft from "svelte-awesome/icons/arrowLeft"
    import arrowRight from "svelte-awesome/icons/arrowRight"

    import { page } from "$app/state"

    export let currentPage: number
    export let total: Promise<number>
    export let visible: number

    const maxPage = writable(-1)

    function gotoPage(x: number) {
        page.url.searchParams.set("page", String(x))
        window.location.search = page.url.searchParams.toString()
    }

    function setMaxPage(playerCount: number): number {
        maxPage.set(Math.floor(playerCount / visible) + 1)

        if ($maxPage !== -1 && currentPage > $maxPage) gotoPage($maxPage)

        return $maxPage
    }
</script>

<div class="mb-2 flex flex-col">
    {#await total}
        <div
            class="skeleton-reveal flex min-h-7 w-full items-center justify-center"
            aria-busy="true"
        >
            <span
                class="h-5 w-32 animate-pulse rounded bg-gray-500 motion-reduce:animate-none"
                aria-hidden="true"
            ></span>
        </div>
    {:then playerCount}
        <span class="w-full text-center">
            page <b>{currentPage}</b> of <b>{setMaxPage(playerCount)}</b>
        </span>
    {:catch _}
        <span
            class="flex min-h-7 w-full items-center justify-center text-sm text-red-400"
            role="status"
        >
            Page count unavailable.
        </span>
    {/await}

    <div class="buttons flex w-full justify-between">
        <button
            class="place-self-start"
            disabled={currentPage <= 1}
            on:click={() => {
                gotoPage(currentPage - 1)
            }}
        >
            <Icon data={arrowLeft} aria-hidden="true" /> &nbsp; Previous
        </button>
        <button
            class="place-self-end"
            disabled={$maxPage === -1 || currentPage >= $maxPage}
            on:click={() => {
                gotoPage(currentPage + 1)
            }}
        >
            Next &nbsp; <Icon data={arrowRight} aria-hidden="true" />
        </button>
    </div>
</div>

<style lang="postcss">
    .buttons {
        @media (max-width: 300px) {
            @apply flex-col gap-2;

            button {
                @apply w-full;
            }
        }
    }

    button {
        @apply flex w-32 items-center justify-center rounded-md bg-gray-600 px-4 py-2 hover:bg-gray-700 active:bg-gray-800;

        &:disabled {
            visibility: hidden;
        }
    }

    b {
        @apply text-lg font-black;
    }
</style>
