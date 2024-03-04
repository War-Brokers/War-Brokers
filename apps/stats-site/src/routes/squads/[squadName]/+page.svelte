<script>
    import { page } from "$app/stores"
    import Title from "$lib/components/title.svelte"

    const pathname = $page.url.pathname
    const squadName = pathname.slice(pathname.lastIndexOf("/") + 1)
</script>

<Title title={`Squad ${squadName}`} />

<h2 class="w-full text-center text-3xl font-black">Squad {squadName}</h2>
