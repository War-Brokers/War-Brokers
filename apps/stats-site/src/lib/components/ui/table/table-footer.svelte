<script lang="ts">
    import type { HTMLAttributes } from "svelte/elements"

    import { cn } from "$lib/utils"

    const {
        class: className,
        children,
        ...restProps
    }: HTMLAttributes<HTMLTableSectionElement> = $props()
</script>

<tfoot
    data-slot="table-footer"
    class={cn(
        "border-t border-gray-700 bg-gray-700/50 font-medium [&>tr]:last:border-b-0",
        className,
    )}
    {...restProps}
>
    {@render children?.()}
</tfoot>
