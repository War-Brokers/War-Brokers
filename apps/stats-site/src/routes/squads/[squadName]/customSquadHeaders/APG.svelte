<script lang="ts">
    import { resolve } from "$app/paths"
    import A from "$lib/components/A.svelte"
    import SquadEmblem from "$lib/img/squads/APG.png"

    import type { PageData } from "../$types"

    const { leaders }: PageData = $props()
</script>

<header class="flex flex-col">
    <h2 class="mx-auto mb-4 text-3xl font-black">Squad APG</h2>
    <span class="mx-auto mb-10 text-xl font-black">
        Squad Leaders:
        {#await leaders}
            <span class="skeleton-reveal inline-flex items-baseline" aria-busy="true">
                <span
                    class="inline-block h-6 w-32 animate-pulse rounded bg-gray-600 motion-reduce:animate-none"
                    aria-hidden="true"
                ></span>
            </span>
        {:then leaders}
            {#if leaders}
                {#each leaders as leader (leader.uid)}
                    <A href={resolve("/players/[uid]", { uid: leader.uid })}>{leader.nick}</A>
                {/each}
            {:else}
                <span class="font-bold text-red-400" role="status">No leaders found</span>
            {/if}
        {:catch _}
            <span class="font-bold text-red-400" role="status">Failed to load</span>
        {/await}
    </span>

    <div class="mb-10 flex w-full flex-col items-center justify-center gap-36 lg:flex-row">
        <div class="flex grow basis-0 items-center justify-center">
            <img src={SquadEmblem} alt="APG squad emblem" />
        </div>
        <div class="grow basis-0">
            <h3 class="mb-2 text-xl font-black">Requirements</h3>
            <ol type="I" class="mb-2 list-inside font-normal" style="list-style-type: upper-roman">
                <li>You must be higher than <span class="font-black">Level 73</span></li>
                <li>
                    You must have a
                    <span class="font-black">Kills ELO better than 96% of players</span>
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
                    You must <span class="font-black">be respectful</span> of others and act mature
                </li>
            </ol>
            <p class="mb-5 text-gray-400">
                <span class="font-black text-gray-400">Note:</span> The chances of acceptance SIGNIFICANTLY
                drop if you don't meet these criteria.
            </p>

            <div class="w-fit animate-bounce">
                <A class="text-2xl font-bold" href="https://forms.gle/STUdYz6KuVFijVJ57" external>
                    Apply Now!
                </A>
            </div>
        </div>
    </div>
</header>
