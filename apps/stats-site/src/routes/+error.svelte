<script>
    import { page } from "$app/stores"
    import Title from "$lib/components/title.svelte"
</script>

{#if $page.error}
    <Title title={`${$page.status} ${$page.error.message}`} />

    <h1>{$page.status} - {$page.error.message}</h1>
{/if}
