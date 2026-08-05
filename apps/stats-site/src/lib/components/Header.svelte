<script lang="ts">
    import { Hamburger } from "svelte-hamburgers"

    import { cn } from "$lib/utils"

    let open = false
    const links = [
        { name: "Home", path: "/" },
        { name: "Ranks", path: "/ranks" },
        { name: "Leaderboard", path: "/leaderboard" },
        { name: "Squads", path: "/squads" },
    ]
</script>

<header class="flex flex-col pl-4 dark:bg-gray-700 md:px-4">
    <div class="mx-auto flex h-16 w-full max-w-5xl items-center justify-between">
        <a href="/" class="flex items-center">
            <img width="64" height="64" src="/WBP.avif" alt="War Brokers logo" />
            <h2
                class="invisible whitespace-nowrap text-xl font-black tracking-wide min-[330px]:visible"
            >
                War Brokers Stats
            </h2>
        </a>

        <div class="hidden gap-7 dark:bg-gray-700 md:flex">
            {#each links as { name, path } (path)}
                <a href={path} class="hover:text-orange-500">{name}</a>
            {/each}
        </div>

        <div class="md:hidden">
            <Hamburger --color="#eee" bind:open />
        </div>
    </div>

    <div
        class={cn(
            "flex flex-col overflow-hidden transition-[height] ease-linear dark:bg-gray-700 md:hidden",
            open ? "h-[192px]" : "h-0",
        )}
    >
        {#each links as { name, path } (path)}
            <a href={path} class="min-h-[48px] hover:text-orange-500">{name}</a>
        {/each}
    </div>
</header>
