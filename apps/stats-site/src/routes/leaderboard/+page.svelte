<script lang="ts">
    import { resolve } from "$app/paths"
    import DataHeaderCell from "$lib/components/Table/DataHeaderCell.svelte"
    import IndexHeaderCell from "$lib/components/Table/IndexHeaderCell.svelte"
    import Table from "$lib/components/Table/Table.svelte"
    import THead from "$lib/components/Table/THead.svelte"
    import Title from "$lib/components/title.svelte"
    import { formatTimeAlive } from "$lib/formatting"

    import type { PageData } from "./$types"
    import { SIMPLE_LEADERBOARD_LEN } from "./config"
    import LeaderboardHeading from "./LeaderboardHeading.svelte"
    import LoadingRows from "./LoadingRows.svelte"
    import Row from "./Row.svelte"
    import StateRow from "./StateRow.svelte"
    import ViewMore from "./ViewMore.svelte"

    export let data: PageData
    const { killsEloRanking, gamesEloRanking, timeAliveRanking, xpRanking } = data
</script>

<Title title="Leaderboard" />

<h2 class="w-full text-center text-3xl font-black">Global Leaderboard</h2>

<div class="flex w-full flex-col">
    <LeaderboardHeading>Kills ELO</LeaderboardHeading>
    <Table>
        <caption class="sr-only">Kills Elo leaderboard</caption>
        <THead>
            <IndexHeaderCell>#</IndexHeaderCell>
            <DataHeaderCell>Player</DataHeaderCell>
            <th class="min-w-24">Kills ELO</th>
        </THead>
        {#await killsEloRanking}
            <tbody
                class="animate-pulse motion-reduce:animate-none"
                aria-busy="true"
                aria-label="Kills Elo leaderboard"
            >
                <LoadingRows
                    rows={SIMPLE_LEADERBOARD_LEN + 1}
                    headers={[{ label: "Kills ELO", skeletonClass: "w-20" }]}
                />
            </tbody>
        {:then killsEloRanking}
            <tbody>
                {#if killsEloRanking.length === 0}
                    <StateRow colspan={3} rows={SIMPLE_LEADERBOARD_LEN + 1} tone="empty">
                        No ranked players are available.
                    </StateRow>
                {:else}
                    {#each killsEloRanking as { uid, nick, squad, killsELO }, i (uid)}
                        <Row rank={i + 1} {nick} {squad} {uid} stats={[killsELO.toFixed(2)]} />
                    {/each}
                    <ViewMore href={resolve("/leaderboard/killsELO")} />
                {/if}
            </tbody>
        {:catch _}
            <tbody>
                <StateRow colspan={3} rows={SIMPLE_LEADERBOARD_LEN + 1} tone="error">
                    Failed to load
                </StateRow>
            </tbody>
        {/await}
    </Table>

    <LeaderboardHeading>Games ELO</LeaderboardHeading>
    <Table>
        <caption class="sr-only">Games Elo leaderboard</caption>
        <THead>
            <IndexHeaderCell>#</IndexHeaderCell>
            <DataHeaderCell>Player</DataHeaderCell>
            <th class="min-w-24">Games ELO</th>
        </THead>
        {#await gamesEloRanking}
            <tbody
                class="animate-pulse motion-reduce:animate-none"
                aria-busy="true"
                aria-label="Games Elo leaderboard"
            >
                <LoadingRows
                    rows={SIMPLE_LEADERBOARD_LEN + 1}
                    headers={[{ label: "Games ELO", skeletonClass: "w-20" }]}
                />
            </tbody>
        {:then gamesEloRanking}
            <tbody>
                {#if gamesEloRanking.length === 0}
                    <StateRow colspan={3} rows={SIMPLE_LEADERBOARD_LEN + 1} tone="empty">
                        No ranked players are available.
                    </StateRow>
                {:else}
                    {#each gamesEloRanking as { uid, nick, squad, gamesELO }, i (uid)}
                        <Row rank={i + 1} {nick} {squad} {uid} stats={[gamesELO.toFixed(2)]} />
                    {/each}
                    <ViewMore href={resolve("/leaderboard/gamesELO")} />
                {/if}
            </tbody>
        {:catch _}
            <tbody>
                <StateRow colspan={3} rows={SIMPLE_LEADERBOARD_LEN + 1} tone="error">
                    Failed to load
                </StateRow>
            </tbody>
        {/await}
    </Table>

    <LeaderboardHeading>Time Alive</LeaderboardHeading>
    <Table>
        <caption class="sr-only">Time Alive leaderboard</caption>
        <THead>
            <IndexHeaderCell>#</IndexHeaderCell>
            <DataHeaderCell>Player</DataHeaderCell>
            <th class="min-w-32">Time Alive</th>
        </THead>
        {#await timeAliveRanking}
            <tbody
                class="animate-pulse motion-reduce:animate-none"
                aria-busy="true"
                aria-label="Time Alive leaderboard"
            >
                <LoadingRows
                    rows={SIMPLE_LEADERBOARD_LEN + 1}
                    headers={[{ label: "Time Alive", skeletonClass: "w-24" }]}
                />
            </tbody>
        {:then timeAliveRanking}
            <tbody>
                {#if timeAliveRanking.length === 0}
                    <StateRow colspan={3} rows={SIMPLE_LEADERBOARD_LEN + 1} tone="empty">
                        No ranked players are available.
                    </StateRow>
                {:else}
                    {#each timeAliveRanking as { uid, nick, squad, time_alive }, i (uid)}
                        <Row
                            rank={i + 1}
                            {nick}
                            {squad}
                            {uid}
                            stats={[formatTimeAlive(time_alive)]}
                        />
                    {/each}
                    <ViewMore href={resolve("/leaderboard/timeAlive")} />
                {/if}
            </tbody>
        {:catch _}
            <tbody>
                <StateRow colspan={3} rows={SIMPLE_LEADERBOARD_LEN + 1} tone="error">
                    Failed to load
                </StateRow>
            </tbody>
        {/await}
    </Table>

    <LeaderboardHeading>XP & Level</LeaderboardHeading>
    <Table>
        <caption class="sr-only">XP and level leaderboard</caption>
        <THead>
            <IndexHeaderCell>#</IndexHeaderCell>
            <DataHeaderCell>Player</DataHeaderCell>
            <th class="min-w-32">XP</th>
            <th class="min-w-24">Level</th>
        </THead>
        {#await xpRanking}
            <tbody
                class="animate-pulse motion-reduce:animate-none"
                aria-busy="true"
                aria-label="XP and level leaderboard"
            >
                <LoadingRows
                    rows={SIMPLE_LEADERBOARD_LEN + 1}
                    headers={[
                        { label: "XP", skeletonClass: "w-20" },
                        { label: "Level", skeletonClass: "w-12" },
                    ]}
                />
            </tbody>
        {:then xpRanking}
            <tbody>
                {#if xpRanking.length === 0}
                    <StateRow colspan={4} rows={SIMPLE_LEADERBOARD_LEN + 1} tone="empty">
                        No ranked players are available.
                    </StateRow>
                {:else}
                    {#each xpRanking as { uid, nick, squad, xp, level }, i (uid)}
                        <Row
                            rank={i + 1}
                            {nick}
                            {squad}
                            {uid}
                            stats={[xp.toLocaleString("en-US"), level]}
                        />
                    {/each}
                    <ViewMore href={resolve("/leaderboard/xp")} />
                {/if}
            </tbody>
        {:catch _}
            <tbody>
                <StateRow colspan={4} rows={SIMPLE_LEADERBOARD_LEN + 1} tone="error">
                    Failed to load
                </StateRow>
            </tbody>
        {/await}
    </Table>
</div>
