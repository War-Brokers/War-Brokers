<script>
    import "../app.scss"

    import { FirebaseApp } from "sveltefire"

    import Footer from "$lib/components/Footer.svelte"
    import Header from "$lib/components/Header.svelte"
    import { auth, firestore, storage } from "$lib/firebase"
</script>

<FirebaseApp {auth} {firestore} {storage}>
    <Header />

    <main class="flex my-4 flex-auto max-w-5xl mx-auto w-full">
        <slot />
    </main>

    <Footer />
</FirebaseApp>
