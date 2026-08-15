<script lang="ts">
    import type { HTMLAttributes } from "svelte/elements"

    import { cn } from "$lib/utils"

    const {
        class: className,
        children,
        ...restProps
    }: HTMLAttributes<HTMLTableSectionElement> = $props()
</script>

<thead data-slot="table-header" class={cn("[&_tr]:border-b", className)} {...restProps}>
    {@render children?.()}
</thead>
