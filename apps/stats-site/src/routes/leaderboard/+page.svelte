<script lang="ts">
    import Title from "$lib/components/title.svelte"

    import type { PageData } from "./$types"
    import Row from "./Row.svelte"

    export let data: PageData
    const { killsEloRanking, gamesEloRanking, xpRanking } = data

    /**
     * https://stackoverflow.com/a/2901298/12979111
     */
    function numberWithCommas(x: number): string {
        return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
    }
</script>

<Title title="Leaderboard" />

<h2 class="mb-10 w-full text-center text-3xl font-black">Global Leaderboard</h2>

<div class="flex w-full flex-col">
    <h3 class="mb-3 w-full text-xl font-semibold">Kills ELO</h3>
    <table>
        <thead>
            <tr>
                <th class="w-14 px-4 text-right">#</th>
                <th class="w-full">Player</th>
                <th class="min-w-24">Kills ELO</th>
            </tr>
        </thead>
        <tbody>
            {#await killsEloRanking}
                <tr>
                    <td>Loading...</td>
                </tr>
            {:then killsEloRanking}
                {#each killsEloRanking as { uid, nick, killsELO }, i (uid)}
                    <Row rank={i + 1} {nick} {uid} stat={killsELO} />
                {/each}
            {/await}
        </tbody>
    </table>

    <h2 class="mb-3 mt-16 w-full text-xl font-semibold">Games ELO</h2>
    <table>
        <thead>
            <tr>
                <th class="w-14 px-4 text-right">#</th>
                <th class="w-full">Player</th>
                <th class="min-w-24">Games ELO</th>
            </tr>
        </thead>
        <tbody>
            {#await gamesEloRanking}
                <tr>
                    <td>Loading...</td>
                </tr>
            {:then gamesEloRanking}
                {#each gamesEloRanking as { uid, nick, gamesELO }, i (uid)}
                    <Row rank={i + 1} {nick} {uid} stat={gamesELO} />
                {/each}
            {/await}
        </tbody>
    </table>

    <h2 class="mb-3 mt-16 w-full text-xl font-semibold">XP & Level</h2>
    <table>
        <thead>
            <tr>
                <th class="w-14 px-4 text-right">#</th>
                <th class="w-full">Player</th>
                <th class="min-w-32">XP</th>
                <th class="min-w-24">Level</th>
            </tr>
        </thead>
        <tbody>
            {#await xpRanking}
                <tr>
                    <td>Loading...</td>
                </tr>
            {:then xpRanking}
                {#each xpRanking as { uid, nick, xp, level }, i (uid)}
                    <Row
                        rank={i + 1}
                        {nick}
                        {uid}
                        stat={numberWithCommas(xp)}
                        stat2={level}
                    />
                {/each}
            {/await}
        </tbody>
    </table>
</div>

<style lang="postcss">
    table {
        @apply overflow-auto border border-slate-600;
    }

    :global(th) {
        @apply bg-slate-700 py-10 text-left;
    }

    :global(td),
    :global(th) {
        @apply py-2;
    }

    :global(tr:nth-child(even)) {
        @apply bg-slate-700;
    }
</style>
