<script lang="ts">
    import Title from "$lib/components/title.svelte"

    import type { PageData } from "./$types"

    export let data: PageData
    const { player } = data
</script>

<Title title={player.nick} />

<div class="flex gap-10">
    <div>
        <span class="font-bold dark:text-gray-400">Games Elo</span>
        <h2 class="text-2xl font-black">{player.gamesELO}</h2>
    </div>

    <div>
        <span class="font-bold dark:text-gray-400">Kills Elo</span>
        <h2 class="text-2xl font-black">{player.killsELO}</h2>
    </div>
</div>
