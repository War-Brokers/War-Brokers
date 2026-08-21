<script lang="ts">
    import type { HTMLTdAttributes } from "svelte/elements"

    import { cn } from "$lib/utils"

    const { class: className, children, ...restProps }: HTMLTdAttributes = $props()
</script>

<td
    data-slot="table-cell"
    class={cn(
        "bg-clip-padding p-2 align-middle whitespace-nowrap has-[[role=checkbox]]:pe-0",
        className,
    )}
    {...restProps}
>
    {@render children?.()}
</td>
