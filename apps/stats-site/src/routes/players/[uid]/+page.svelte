<script lang="ts">
    import Title from "$lib/components/title.svelte"

    import type { PageData } from "./$types"

    export let data: PageData
    const { player } = data
</script>

<Title title={player.nick} />

<div class="flex gap-10">
    <div>
        <span class="dark:text-gray-400 font-bold">Games Elo</span>
        <h2 class="font-black text-2xl">{player.gamesELO}</h2>
    </div>

    <div>
        <span class="dark:text-gray-400 font-bold">Kills Elo</span>
        <h2 class="font-black text-2xl">{player.killsELO}</h2>
    </div>
</div>
