<script lang="ts">
    import Check from "@lucide/svelte/icons/check"
    import X from "@lucide/svelte/icons/x"
    import { gameModeFandom, gameModeName } from "@warbrokers/types/src/gameMode"
    import { mapFandom, MapName } from "@warbrokers/types/src/map"

    import A from "$lib/components/A.svelte"
    import * as Popover from "$lib/components/ui/popover"
    import { Skeleton } from "$lib/components/ui/skeleton"
    import * as Table from "$lib/components/ui/table"

    import type { Server } from "./types"

    const { server }: { server: Server } = $props()

    let loadedMapImageUrl = $state<string | null>(null)

    const gameModeWiki = $derived(gameModeFandom[server.gameMode])
    const mapWiki = $derived(mapFandom[server.map])
    const mapArticleUrl = $derived(mapWiki.articleUrl)
    const mapImageUrl = $derived(mapWiki.imageUrl)

    function finishMapImageLoad(event: Event) {
        if (!(event.currentTarget instanceof HTMLImageElement)) return
        loadedMapImageUrl = event.currentTarget.getAttribute("src")
    }
</script>

<Table.Row class="even:bg-gray-900">
    <Table.Cell><div class="font-bold">{server.name}</div></Table.Cell>
    <Table.Cell>
        {#if server.isTeams}
            <Check class="text-green-500" aria-label="Yes" />
        {:else}
            <X class="text-red-500" aria-label="No" />
        {/if}
    </Table.Cell>
    <Table.Cell>
        {#if gameModeWiki.articleUrl}
            <A href={gameModeWiki.articleUrl} external class="font-medium underline">
                {gameModeName[server.gameMode]}
            </A>
        {:else}
            {gameModeName[server.gameMode]}
        {/if}
    </Table.Cell>
    <Table.Cell>
        {#if mapArticleUrl}
            {#if mapImageUrl}
                <Popover.Root>
                    <Popover.Trigger openOnHover openDelay={150} closeDelay={100}>
                        {#snippet child({ props })}
                            <A
                                {...props}
                                href={mapArticleUrl}
                                external
                                class="font-medium underline"
                            >
                                {MapName[server.map]}
                            </A>
                        {/snippet}
                    </Popover.Trigger>
                    <Popover.Content
                        side="top"
                        trapFocus={false}
                        class="box-content w-64 gap-0 p-2"
                        onOpenAutoFocus={(event: Event) => {
                            event.preventDefault()
                        }}
                    >
                        <div
                            class="relative aspect-video w-full overflow-hidden rounded-lg bg-gray-100 dark:bg-gray-800"
                            aria-busy={loadedMapImageUrl !== mapImageUrl}
                        >
                            {#if loadedMapImageUrl !== mapImageUrl}
                                <Skeleton
                                    class="skeleton-reveal absolute inset-0 h-full w-full rounded-lg"
                                    aria-hidden="true"
                                />
                            {/if}
                            <img
                                src={mapImageUrl}
                                alt={`${MapName[server.map]} preview`}
                                width="256"
                                height="144"
                                loading="lazy"
                                class="h-full w-full object-contain"
                                class:invisible={loadedMapImageUrl !== mapImageUrl}
                                onload={finishMapImageLoad}
                                onerror={finishMapImageLoad}
                            />
                        </div>
                    </Popover.Content>
                </Popover.Root>
            {:else}
                <A href={mapArticleUrl} external class="font-medium underline">
                    {MapName[server.map]}
                </A>
            {/if}
        {:else}
            {MapName[server.map]}
        {/if}
    </Table.Cell>
    <Table.Cell>
        {#if server.playerCount === server.maxPlayers}
            <div class="inline-block rounded-sm bg-gray-900 px-1 text-red-500">
                {server.playerCount} / {server.maxPlayers}
            </div>
        {:else if server.playerCount === 0}
            <div class="text-gray-400">{server.playerCount} / {server.maxPlayers}</div>
        {:else}
            <div class="font-bold">{server.playerCount} / {server.maxPlayers}</div>
        {/if}
    </Table.Cell>
</Table.Row>
