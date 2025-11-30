<script lang="ts">
    import Title from "$lib/components/title.svelte"
    import CAESAREmblem from "$lib/img/squads/CAESAR.png"

    import type { PageData } from "./$types"

    export let data: PageData
    const { members } = data
</script>

<Title title="Squad CAESAR" />

<img src={CAESAREmblem} class="mx-auto w-28" alt="CAESAR squad emblem" />

<h2 class="mb-10 mt-4 w-full text-center text-3xl font-black">CAESAR Squad</h2>

<b class="mb-10 text-center"><i>"Res, non verba"</i></b>

<span class="w-full text-center text-xl font-black">Squad Leaders</span>
<span
    class="text-s mx-auto mb-10 inline-flex flex-wrap justify-center gap-1 font-bold"
>
    <a
        class="whitespace-nowrap underline underline-offset-4 hover:text-orange-500"
        href="/players/600722c9bfea71503dbd4905">Colonel Grant</a
    >
    /
    <a
        class="whitespace-nowrap underline underline-offset-4 hover:text-orange-500"
        href="/players/6006c985d142af9d4670c226">Nyarlatoteph</a
    >
    /
    <a
        class="whitespace-nowrap underline underline-offset-4 hover:text-orange-500"
        href="/players/63c8fbcfd142aff929a28ea2">Colonel Fires</a
    >
    /
    <a
        class="whitespace-nowrap underline underline-offset-4 hover:text-orange-500"
        href="/players/63c8ffa1d142afe031a28e1d">Commander Phönix</a
    >
    /
    <a
        class="whitespace-nowrap underline underline-offset-4 hover:text-orange-500"
        href="/players/5f086e2dd142afe8153aef05">THE DOZER</a
    >
    /
    <a
        class="whitespace-nowrap underline underline-offset-4 hover:text-orange-500"
        href="/players/63dbce11fe3c7a6a6807aa5f">7|Ammo</a
    >
    /
    <a
        class="whitespace-nowrap underline underline-offset-4 hover:text-orange-500"
        href="/players/638b25a0bfea713b7218483b">Achilles007</a
    >
    /
    <a
        class="whitespace-nowrap underline underline-offset-4 hover:text-orange-500"
        href="/players/6698bdf3d142af601f50256a">What! U Died ?</a
    >
</span>

<span class="mb-4 w-full text-center">
    <h3 class="mb-1 text-xl font-black">Requirements</h3>
    <ul class="font-bold">
        <li>Burning will to improuve</li>
        <li>Be chivalrous</li>
        <li>Level 25 or above</li>
    </ul>
</span>

<div class="mb-10 flex items-baseline gap-1">
    <span class="text-xl font-bold">{members.length}</span> members
</div>

<div class="flex flex-col gap-4">
    {#each members as player (player.uid)}
        <a href="/players/{player.uid}">
            <div class="flex flex-col rounded-lg bg-slate-700 p-4">
                <span class="mb-4 text-xl font-bold">{player.nick}</span>

                <div class="felx flex-row gap-4">Stats (WIP)</div>
            </div>
        </a>
    {/each}
</div>
