<script>
    import { page } from "$app/stores"
    import Title from "$lib/components/title.svelte"
</script>

{#if $page.error}
    <Title title={`${$page.status} ${$page.error.message}`} />

    <h1 class="mb-2 text-5xl font-black">{$page.status}</h1>
    <span class="text-lg">{$page.error.message}</span>
{/if}
