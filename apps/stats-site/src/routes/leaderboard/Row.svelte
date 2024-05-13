<script lang="ts">
    export let rank: number
    export let nick: string
    export let uid: string
    export let stat: unknown
    export let stat2: unknown | undefined = undefined
</script>

<tr class="p-9 hover:bg-slate-900">
    <td class="pr-4 text-right">{rank}</td>
    <td class="text-left">
        <a class="dark:text-orange-500" href="/players/{uid}">{nick}</a>
    </td>
    <td class="text-left">{stat}</td>
    {#if stat2}
        <td class="text-left">{stat2}</td>
    {/if}
</tr>
