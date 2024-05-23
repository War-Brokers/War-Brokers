<script lang="ts">
    import A from "$lib/components/A.svelte"

    export let rank: number
    export let nick: string
    export let uid: string
    export let stat: unknown
    export let stat2: unknown | undefined = undefined
</script>

<tr class="whitespace-nowrap p-9 hover:bg-slate-900">
    <td class="pr-4 text-right">{rank}</td>
    <td class="pr-4 text-left">
        <A href="/players/{uid}">{nick}</A>
    </td>
    <td class="text-left">{stat}</td>
    {#if stat2}
        <td class="text-left">{stat2}</td>
    {/if}
</tr>
