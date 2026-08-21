<script lang="ts">
    import type { HTMLTableAttributes } from "svelte/elements"

    import { cn } from "$lib/utils"

    const { class: className, children, ...restProps }: HTMLTableAttributes = $props()
</script>

<div data-slot="table-container" class="relative size-full overflow-x-auto">
    <table data-slot="table" class={cn("w-full caption-bottom text-sm", className)} {...restProps}>
        {@render children?.()}
    </table>
</div>
