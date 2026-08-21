<script lang="ts">
    import { resolve } from "$app/paths"
    import A from "$lib/components/A.svelte"

    const { nick, uid }: { nick: string; uid: string } = $props()
</script>

<A href={resolve("/players/[uid]", { uid })} class="font-bold">{nick}</A>
