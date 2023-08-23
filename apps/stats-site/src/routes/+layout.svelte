<script>
    import { FirebaseApp } from "sveltefire"

    import { auth, firestore, storage } from "$lib/firebase"
</script>

<FirebaseApp {auth} {firestore} {storage}>
    <slot />
</FirebaseApp>
