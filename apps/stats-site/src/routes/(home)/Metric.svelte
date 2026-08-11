<script lang="ts">
    export let label: string
    export let value: Promise<string | number>
</script>

<div class="min-w-28">
    <span class="font-bold dark:text-gray-400">{label}</span>
    <div class="flex min-h-8 items-center">
        {#await value}
            <div class="skeleton-reveal" aria-busy="true">
                <div
                    class="h-7 w-20 animate-pulse rounded bg-gray-600 motion-reduce:animate-none"
                    aria-hidden="true"
                ></div>
            </div>
        {:then value}
            <span class="text-2xl font-black tabular-nums">{value}</span>
        {:catch _}
            <span
                class="text-base font-bold text-red-400"
                role="status"
                aria-label={`${label} unavailable`}>Unavailable</span
            >
        {/await}
    </div>
    <slot />
</div>
