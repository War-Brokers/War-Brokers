<script lang="ts">
    import { Popover } from "flowbite-svelte"
    import QuestionMarkIcon from "flowbite-svelte-icons/QuestionCircleSolid.svelte"

    import { percentile2rank, type Rank } from "$lib/rank"

    export let title: string
    export let data: string | number
    export let _id: string | undefined = undefined
    export let percentile: Promise<number> | undefined = undefined

    let rank: Rank
    let icon: string

    $: percentile?.then((value) => {
        const res = percentile2rank(value)
        rank = res.rank
        icon = res.icon
    })
</script>

<div class="flex min-w-24 flex-col">
    <div class="flex w-full">
        <span class="whitespace-nowrap font-bold dark:text-gray-400">
            {title}
        </span>
        {#await percentile then percentile}
            {#if percentile !== undefined}
                <div class="flex items-center justify-center" id={_id}>
                    <img
                        alt="The project logo"
                        src={icon}
                        class="ms-1.5 aspect-square w-7 text-gray-200"
                    />
                    <span class="sr-only">Show information</span>
                </div>
                <Popover
                    triggeredBy="#{_id}"
                    class="space-y-2 p-3 text-sm font-light dark:border-gray-600 dark:bg-gray-900 dark:text-gray-400"
                    placement="top-start"
                >
                    <div class="flex flex-col items-center justify-center">
                        <h3 class="text-center font-black dark:text-gray-200">
                            {rank}
                        </h3>
                        <img
                            alt="The project logo"
                            src={icon}
                            class="aspect-square w-16 text-gray-200"
                        />
                    </div>
                    <h3 class="font-medium text-gray-900 dark:text-white">
                        better than
                        <span class="font-black">
                            {percentile.toFixed(3)}%
                        </span>
                        of the players!
                    </h3>
                    <br />
                    <a
                        href="/ranks"
                        class="flex font-medium hover:text-gray-300"
                    >
                        <QuestionMarkIcon class="mr-1 w-4" /> Learn More
                    </a>
                </Popover>
            {/if}
        {/await}
    </div>
    <span class="text-2xl font-black">{data}</span>
</div>
