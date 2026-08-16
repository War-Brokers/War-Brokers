<script>
    import "../app.css"

    import Footer from "$lib/components/Footer.svelte"
    import Header from "$lib/components/Header.svelte"
</script>

<Header />

<main class="mx-auto my-6 flex w-full max-w-5xl grow flex-col px-4">
    <slot />
</main>

<Footer />
