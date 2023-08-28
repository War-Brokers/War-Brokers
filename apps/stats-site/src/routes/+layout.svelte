<script>
    import "../app.scss"

    import Footer from "$lib/components/Footer.svelte"
    import Header from "$lib/components/Header.svelte"
</script>

<Header />

<main class="mx-auto my-4 flex w-full max-w-5xl flex-grow flex-col px-4">
    <slot />
</main>

<Footer />
