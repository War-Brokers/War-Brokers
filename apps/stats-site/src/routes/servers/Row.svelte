<script lang="ts">
    import { type GameMode, gameModeFandom, gameModeName } from "@warbrokers/types/src/gameMode"
    import { mapFandom, MapName, type WBMap } from "@warbrokers/types/src/map"
    import { ImagePlaceholder, Popover, TableBodyCell, TableBodyRow } from "flowbite-svelte"
    import { CheckOutline, CloseOutline } from "flowbite-svelte-icons"

    import A from "$lib/components/A.svelte"

    export let serverName: string
    export let gameMode: GameMode
    export let isTeams: boolean
    export let map: WBMap
    export let playerCount: number
    export let maxPlayers: number

    let loadedMapImageUrl: string | null = null

    $: gameModeWiki = gameModeFandom[gameMode]
    $: mapWiki = mapFandom[map]

    function finishMapImageLoad(event: Event) {
        if (!(event.currentTarget instanceof HTMLImageElement)) return
        loadedMapImageUrl = event.currentTarget.getAttribute("src")
    }
</script>

<TableBodyRow class="dark:bg-gray-900">
    <TableBodyCell>
        <div class="font-bold">{serverName}</div>
    </TableBodyCell>
    <TableBodyCell>
        {#if isTeams}
            <CheckOutline class="text-green-500" ariaLabel="Yes" />
        {:else}
            <CloseOutline class="text-red-500" ariaLabel="No" />
        {/if}
    </TableBodyCell>
    <TableBodyCell>
        {#if gameModeWiki.articleUrl}
            <A href={gameModeWiki.articleUrl} external class="font-medium underline">
                {gameModeName[gameMode]}
            </A>
        {:else}
            {gameModeName[gameMode]}
        {/if}
    </TableBodyCell>
    <TableBodyCell>
        {#if mapWiki.articleUrl}
            <A href={mapWiki.articleUrl} external class="font-medium underline">
                {MapName[map]}
            </A>
            {#if mapWiki.imageUrl}
                <Popover
                    placement="top"
                    strategy="fixed"
                    defaultClass="p-2"
                    class="box-content w-64 p-0"
                >
                    <div
                        class="relative aspect-video w-full overflow-hidden rounded-lg bg-gray-100 dark:bg-gray-800"
                    >
                        {#if loadedMapImageUrl !== mapWiki.imageUrl}
                            <ImagePlaceholder
                                imgOnly
                                divClass="absolute inset-0 h-full w-full !max-w-none animate-pulse [&>div]:!h-full [&>div]:!w-full [&>div]:!max-w-none"
                            />
                        {/if}
                        <img
                            src={mapWiki.imageUrl}
                            alt={`${MapName[map]} preview`}
                            width="256"
                            height="144"
                            loading="lazy"
                            class="h-full w-full object-contain"
                            class:invisible={loadedMapImageUrl !== mapWiki.imageUrl}
                            on:load={finishMapImageLoad}
                            on:error={finishMapImageLoad}
                        />
                    </div>
                </Popover>
            {/if}
        {:else}
            {MapName[map]}
        {/if}
    </TableBodyCell>
    <TableBodyCell>
        {#if playerCount === maxPlayers}
            <div class="dark:text-red-500">
                {playerCount} / {maxPlayers}
            </div>
        {:else if playerCount === 0}
            <div class="dark:text-gray-400">
                {playerCount} / {maxPlayers}
            </div>
        {:else}
            <div class="font-bold">
                {playerCount} / {maxPlayers}
            </div>
        {/if}
    </TableBodyCell>
</TableBodyRow>
