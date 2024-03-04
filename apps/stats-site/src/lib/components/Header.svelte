<script lang="ts">
    import PlayerSearch from "$lib/components/PlayerSearch.svelte"
</script>

<header class="h-16 px-4 dark:bg-gray-700">
    <div class="mx-auto flex max-w-5xl items-center justify-between">
        <div class="flex items-center">
            <img
                width="64"
                height="64"
                src="/WBP.avif"
                alt="War Brokers logo"
            />
            <a href="/">
                <h2 class="text-xl font-black tracking-wide">
                    War Brokers Stats
                </h2>
            </a>
        </div>
        <PlayerSearch />
    </div>
</header>
