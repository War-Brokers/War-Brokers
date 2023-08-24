<script lang="ts">
    import Title from "$lib/components/title.svelte"

    import type { PageData } from "./$types"

    export let data: PageData
    const { playersOnline } = data
</script>

<Title title="Home" />

<h1 class="font-black text-3xl mx-auto">Home</h1>

<div class="flex gap-10">
    <div>
        <span class="dark:text-gray-400 font-bold">Players online</span>
        <h2 class="font-black text-2xl">{playersOnline}</h2>
    </div>
</div>
