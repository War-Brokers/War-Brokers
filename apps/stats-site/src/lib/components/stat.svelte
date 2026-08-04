<script lang="ts">
    import { Popover } from "flowbite-svelte"
    import QuestionMarkIcon from "flowbite-svelte-icons/QuestionCircleSolid.svelte"

    import A from "$lib/components/A.svelte"
    import { percentile2rank } from "$lib/rank"

    export let title: string
    export let data: string | number
    export let _id: string | undefined = undefined
    export let percentile: Promise<number> | undefined = undefined
    export let compact = false
</script>

<div
    class="flex flex-col"
    class:min-w-24={!compact}
    class:min-w-0={compact}
    class:w-full={compact}
    class:items-center={compact}
>
    {#if title || percentile}
        <div class="flex w-full" class:justify-center={compact}>
            {#if title}
                <span class="whitespace-nowrap font-bold dark:text-gray-400">
                    {title}
                </span>
            {/if}
            {#await percentile then percentile}
                {#if percentile !== undefined}
                    {@const { rank, icon } = percentile2rank(percentile)}
                    <div
                        class="ms-1.5 flex items-center justify-center"
                        id={_id}
                    >
                        <img
                            alt="The project logo"
                            src={icon}
                            class="aspect-square w-7 text-gray-200"
                        />
                        <span class="sr-only">Show information</span>
                    </div>
                    <Popover
                        triggeredBy="#{_id}"
                        class="space-y-2 p-3 text-sm font-light dark:border-gray-600 dark:bg-gray-900 dark:text-gray-400"
                        placement="top-start"
                    >
                        <div class="flex flex-col items-center justify-center">
                            <h3
                                class="text-center font-black dark:text-gray-200"
                            >
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
                        <A href="/ranks" class="flex font-medium">
                            <QuestionMarkIcon class="mr-1 w-4" /> Learn More
                        </A>
                    </Popover>
                {/if}
            {/await}
        </div>
    {/if}
    <span
        class="font-black {compact
            ? 'w-full break-words sm:text-2xl'
            : 'text-2xl'}"
        class:text-center={compact}>{data}</span
    >
</div>
