<script lang="ts">
    import type { HTMLThAttributes } from "svelte/elements"

    import { cn } from "$lib/utils"

    const { class: className, children, ...restProps }: HTMLThAttributes = $props()
</script>

<th
    data-slot="table-head"
    class={cn(
        "h-10 whitespace-nowrap bg-clip-padding px-2 text-start align-middle font-medium text-gray-100 [&:has([role=checkbox])]:pe-0",
        className,
    )}
    {...restProps}
>
    {@render children?.()}
</th>
