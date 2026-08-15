<script lang="ts">
    import ArrowDown from "@lucide/svelte/icons/arrow-down"
    import ArrowUp from "@lucide/svelte/icons/arrow-up"
    import ArrowUpDown from "@lucide/svelte/icons/arrow-up-down"

    type SortDirection = "asc" | "desc" | false

    const {
        getSort,
        label,
        ontoggle,
    }: {
        getSort: () => SortDirection
        label: string
        ontoggle: (multi: boolean) => void
    } = $props()

    const sort = $derived(getSort())
</script>

<button
    type="button"
    class="-mx-2 flex h-10 w-[calc(100%+1rem)] items-center gap-2 px-2 text-start font-medium hover:bg-gray-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-orange-400 active:bg-gray-800"
    aria-label={`Sort by ${label}`}
    onclick={(event) => {
        ontoggle(event.shiftKey)
    }}
>
    <span>{label}</span>
    {#if sort === "asc"}
        <ArrowUp class="size-4 shrink-0 text-orange-400" />
    {:else if sort === "desc"}
        <ArrowDown class="size-4 shrink-0 text-orange-400" />
    {:else}
        <ArrowUpDown class="size-4 shrink-0 text-gray-300" />
    {/if}
</button>
