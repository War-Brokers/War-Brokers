<script lang="ts">
    import type { HTMLAttributes } from "svelte/elements"

    import { cn } from "$lib/utils"

    const { class: className, children, ...restProps }: HTMLAttributes<HTMLElement> = $props()
</script>

<caption
    data-slot="table-caption"
    class={cn("mt-4 text-sm text-gray-400", className)}
    {...restProps}
>
    {@render children?.()}
</caption>
