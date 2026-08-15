<script lang="ts">
    import type { HTMLAttributes } from "svelte/elements"

    import { cn } from "$lib/utils"

    const {
        class: className,
        children,
        ...restProps
    }: HTMLAttributes<HTMLTableRowElement> = $props()
</script>

<tr
    data-slot="table-row"
    class={cn(
        "border-b border-gray-700 transition-colors hover:bg-gray-700 data-[state=selected]:bg-gray-700",
        className,
    )}
    {...restProps}
>
    {@render children?.()}
</tr>
