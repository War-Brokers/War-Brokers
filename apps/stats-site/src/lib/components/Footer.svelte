<script>
    import Icon from "svelte-awesome"
    import github from "svelte-awesome/icons/github"

    import { resolve } from "$app/paths"
    import A from "$lib/components/A.svelte"
</script>

<footer data-sveltekit-preload-data="hover" class="w-full dark:bg-gray-950 dark:text-gray-400">
    <div class="mx-auto flex h-28 w-full max-w-5xl items-center justify-between px-4">
        <div>
            made by <A
                href={resolve("/players/[uid]", { uid: "5d2ead35d142affb05757778" })}
                class="font-semibold">POMP</A
            >
        </div>
        <div class="flex items-center gap-6">
            <A href="https://uptime.pompy.dev/status/wbp" external>Status</A>
            <a
                href="https://github.com/War-Brokers/War-Brokers/tree/master/apps/stats-site"
                aria-label="War Brokers Stats source code on GitHub"
            >
                <Icon data={github} scale={3} class="hover:text-gray-100" aria-hidden="true" />
            </a>
        </div>
    </div>
</footer>
