<script lang="ts">
    import { resolve } from "$app/paths"
    import A from "$lib/components/A.svelte"

    const { name }: { name: string } = $props()
</script>

<A href={resolve("/squads/[squadName]", { squadName: name })} class="font-bold">
    {name}<span class="sr-only"> squad</span>
</A>
