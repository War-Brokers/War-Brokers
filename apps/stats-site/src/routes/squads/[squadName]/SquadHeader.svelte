<script lang="ts">
    import SiDiscord from "@icons-pack/svelte-simple-icons/icons/SiDiscord"
    import type { Snippet } from "svelte"

    import { resolve } from "$app/paths"
    import A from "$lib/components/A.svelte"

    import type { PageData } from "./$types"

    const {
        children,
        squadConfig,
        serverMembersCount,
        squadName,
        leaders,
    }: PageData & { children?: Snippet } = $props()
</script>

<header class="mb-4 flex flex-col items-center text-center">
    {#if squadConfig?.emblem}
        <img
            src={squadConfig.emblem}
            width="112"
            height="112"
            class="mx-auto mb-4 w-28"
            alt={`${squadConfig.fullName} squad emblem`}
        />
    {/if}

    <h1 class="mb-6 w-full text-center text-3xl font-black">
        Squad [{squadName}] {#if squadConfig?.fullName}- {squadConfig.fullName}{/if}
    </h1>

    {#await leaders then leaders}
        {#if leaders && leaders.length > 0}
            <h2 class="w-full text-center text-xl font-black">Squad Leaders</h2>
            <span
                class="mx-auto mb-10 inline-flex flex-wrap justify-center gap-1 text-sm font-bold"
            >
                {#each leaders as leader, i (leader.uid)}
                    <A href={resolve("/players/[uid]", { uid: leader.uid })}>{leader.nick}</A>
                    {#if i < leaders.length - 1}
                        <span aria-hidden="true">/</span>
                    {/if}
                {/each}
            </span>
        {/if}
    {:catch}
        <h2 class="w-full text-center text-xl font-black">Squad Leaders</h2>
        <span class="mb-10 font-bold text-red-400" role="status">Failed to load</span>
    {/await}

    {@render children?.()}

    {#if squadConfig?.discordInvite}
        <A
            class="flex items-center justify-center text-gray-100 hover:text-gray-100"
            href={`https://discord.gg/${squadConfig.discordInvite}`}
            external
        >
            <SiDiscord class="size-9 shrink-0 p-2" aria-hidden="true" />
            Discord (
            {#if serverMembersCount}
                {#await serverMembersCount}
                    <span class="skeleton-reveal inline-flex items-baseline gap-1" aria-busy="true">
                        <span
                            class="inline-block h-5 w-12 animate-pulse rounded bg-gray-600 motion-reduce:animate-none"
                            aria-hidden="true"
                        ></span>
                        members
                    </span>
                {:then count}
                    <span><b>{count}</b> members</span>
                {:catch _}
                    <span class="font-bold text-red-400" role="status">Failed to load</span>
                {/await}
            {:else}
                <span>members</span>
            {/if})
        </A>
    {/if}
</header>
