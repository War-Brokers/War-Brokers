<script lang="ts">
    import { Popover } from "flowbite-svelte"
    import { QuestionCircleSolid } from "flowbite-svelte-icons"

    export let title: string
    export let data: string | number
    export let _id: string | undefined = undefined
    export let percentile: Promise<number> | undefined = undefined
</script>

<div class="flex w-24 flex-col">
    <div class="flex w-full">
        <span class="whitespace-nowrap font-bold dark:text-gray-400"
            >{title}</span
        >
        {#await percentile then percentile}
            {#if percentile !== undefined}
                <button id={_id}>
                    <QuestionCircleSolid class="ms-1.5 h-4 w-4 text-gray-200" />
                    <span class="sr-only">Show information</span>
                </button>
                <Popover
                    triggeredBy="#{_id}"
                    class="w-72text-sm font-light dark:border-gray-600 dark:bg-gray-900 dark:text-gray-400"
                    placement="top-start"
                >
                    <div class="space-y-2 p-3">
                        <h3 class="font-medium text-gray-900 dark:text-white">
                            better than
                            <span class="font-black">
                                {percentile.toFixed(3)}%
                            </span>
                            of the players!
                        </h3>
                    </div>
                </Popover>
            {/if}
        {/await}
    </div>
    <span class="text-2xl font-black">{data}</span>
</div>
