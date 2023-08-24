<script>
    import "../app.scss"

    import Footer from "$lib/components/Footer.svelte"
    import Header from "$lib/components/Header.svelte"
</script>

<Header />

<main class="px-4 flex flex-col my-4 flex-auto max-w-5xl mx-auto w-full">
    <slot />
</main>

<Footer />
