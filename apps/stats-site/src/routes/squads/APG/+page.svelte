<script lang="ts">
    import A from "$lib/components/A.svelte"
    import Title from "$lib/components/title.svelte"
    import SquadEmblem from "$lib/img/squads/APG.png"

    import type { PageData } from "./$types"

    const title = "APG"

    export let data: PageData
    const { members, squadLeader } = data
</script>

<Title {title} />

<h2 class="mx-auto mb-4 text-3xl font-black">
    Squad {title}
</h2>
<span class="mx-auto mb-10 text-xl font-black">
    Squad Leader :
    <a
        class="underline underline-offset-4 hover:text-orange-500"
        href="/players/{squadLeader.uid}"
    >
        {squadLeader.nick}
    </a>
</span>

<div
    class="mb-10 flex w-full flex-col items-center justify-center gap-36 lg:flex-row"
>
    <div class="flex grow basis-0 items-center justify-center">
        <img src={SquadEmblem} alt="APG squad emblem" />
    </div>
    <div class="grow basis-0">
        <h3 class="mb-2 text-xl font-black">Requirements</h3>
        <ol
            type="I"
            class="mb-2 list-inside font-normal"
            style="list-style-type:upper-roman"
        >
            <li>
                You must be higher than <span class="font-black">
                    Level 73
                </span>
            </li>
            <li>
                You must have a
                <span class="font-black">Kills ELO of 1703</span> or higher
            </li>
            <li>
                You must have a
                <span class="font-black">K/D of 2.3</span> or higher
            </li>
            <li>
                You must be proficient in at least
                <span class="font-black">one type of vehicle</span>
            </li>
            <li>
                You must have a
                <span class="font-black">good reputation</span>
                within the community and be respectful
            </li>
        </ol>
        <p class="mb-5 text-slate-400">
            <span class="font-black text-slate-400">Note:</span> The chances of acceptance
            SIGNIFICANTLY drop if you don't meet these criteria.
        </p>

        <A
            class="text-2xl font-bold"
            href="https://forms.gle/STUdYz6KuVFijVJ57"
        >
            <div class="animate-bounce">Apply Now!</div>
        </A>
    </div>
</div>

<h2 class="mx-auto text-2xl font-black">Members</h2>
<div class="mb-4 flex items-baseline gap-1">
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
