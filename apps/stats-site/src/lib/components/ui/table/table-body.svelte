<script lang="ts">
    import type { HTMLAttributes } from "svelte/elements"

    import { cn } from "$lib/utils"

    const {
        class: className,
        children,
        ...restProps
    }: HTMLAttributes<HTMLTableSectionElement> = $props()
</script>

<tbody data-slot="table-body" class={cn("[&_tr:last-child]:border-0", className)} {...restProps}>
    {@render children?.()}
</tbody>
