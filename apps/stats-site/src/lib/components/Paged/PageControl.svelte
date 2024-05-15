<script lang="ts">
    import { writable } from "svelte/store"
    import Icon from "svelte-awesome"
    import arrowLeft from "svelte-awesome/icons/arrowLeft"
    import arrowRight from "svelte-awesome/icons/arrowRight"

    import { page } from "$app/stores"

    export let currentPage: number
    export let total: Promise<number>
    export let visible: number

    let maxPage = writable(-1)

    function gotoPage(x: number) {
        $page.url.searchParams.set("page", String(x))
        window.location.search = $page.url.searchParams.toString()
    }

    function setMaxPage(playerCount: number): number {
        maxPage.set(Math.floor(playerCount / visible) + 1)

        if ($maxPage !== -1 && currentPage > $maxPage) gotoPage($maxPage)

        return $maxPage
    }
</script>

<div class="mb-2 flex flex-col">
    {#await total then playerCount}
        <span class="w-full text-center">
            page <b>{currentPage}</b> of <b>{setMaxPage(playerCount)}</b>
        </span>
    {/await}

    <div class="buttons flex w-full justify-between">
        <button
            class="place-self-start"
            disabled={$maxPage === -1 || currentPage <= 1}
            on:click={() => gotoPage(currentPage - 1)}
        >
            <Icon data={arrowLeft} /> &nbsp; Previous
        </button>
        <button
            class="place-self-end"
            disabled={$maxPage === -1 || currentPage >= $maxPage}
            on:click={() => gotoPage(currentPage + 1)}
        >
            Next &nbsp; <Icon data={arrowRight} />
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
        @apply flex w-32 items-center justify-center rounded-md bg-slate-500 px-4 py-2 hover:bg-slate-600 active:bg-slate-700 disabled:invisible;
    }

    b {
        @apply text-lg font-black;
    }
</style>
