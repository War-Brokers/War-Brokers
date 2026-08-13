<script lang="ts">
    import { resolve } from "$app/paths"
    import { page } from "$app/state"
    import A from "$lib/components/A.svelte"
    import Title from "$lib/components/title.svelte"

    const notFound = $derived(page.status === 404)
    const heading = $derived(notFound ? "Page not found" : "Unable to load this page")
    const description = $derived(
        notFound
            ? "The page may have moved or the address may be incorrect."
            : "The requested page is currently unavailable.",
    )
</script>

{#if page.error}
    <Title title={`${page.status} ${heading}`} />

    <section aria-labelledby="error-title">
        <p class="mb-2 text-5xl font-black tabular-nums">{page.status}</p>
        <h1 id="error-title" class="text-2xl font-bold">{heading}</h1>
        <p class="mt-2 max-w-xl text-gray-300">{description}</p>
        <div class="mt-6 flex flex-wrap gap-6">
            <A href={resolve("/")}>Return home</A>
            {#if !notFound}
                <A href="https://uptime.pompy.dev/status/wbp" external>View service status</A>
            {/if}
        </div>
    </section>
{/if}
