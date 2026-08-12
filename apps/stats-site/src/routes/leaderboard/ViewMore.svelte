<script lang="ts">
    import type { ResolvedPathname } from "$app/types"
    import A from "$lib/components/A.svelte"

    export let href: ResolvedPathname
</script>

<tr><td colspan="999" class="text-center"><A {href}>view more...</A></td></tr>
