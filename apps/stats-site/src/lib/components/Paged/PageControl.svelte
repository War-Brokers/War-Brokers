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

<div class="mb-2 grid grid-cols-3 items-center justify-center">
    <button
        class="flex items-center justify-center place-self-start"
        disabled={$maxPage === -1 || currentPage <= 1}
        on:click={() => gotoPage(currentPage - 1)}
    >
        <Icon data={arrowLeft} /> &nbsp; Previous
    </button>

    {#await total then playerCount}
        <span class="text-center">
            page <b>{currentPage}</b> of <b>{setMaxPage(playerCount)}</b>
        </span>
    {/await}

    <button
        class="flex items-center justify-center place-self-end text-center"
        disabled={$maxPage === -1 || currentPage >= $maxPage}
        on:click={() => gotoPage(currentPage + 1)}
    >
        Next &nbsp; <Icon data={arrowRight} />
    </button>
</div>

<style lang="postcss">
    button {
        @apply w-32 rounded-md bg-slate-500 px-4 py-2 hover:bg-slate-600 active:bg-slate-700 disabled:invisible;
    }

    b {
        @apply text-lg font-black;
    }
</style>
