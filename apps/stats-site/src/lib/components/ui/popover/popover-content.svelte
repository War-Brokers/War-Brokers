<script lang="ts">
    import { Popover as PopoverPrimitive } from "bits-ui"

    import { cn } from "$lib/utils"

    const {
        class: className,
        align = "center",
        sideOffset = 4,
        ...restProps
    }: PopoverPrimitive.ContentProps = $props()
</script>

<PopoverPrimitive.Portal>
    <PopoverPrimitive.Content
        data-slot="popover-content"
        {align}
        {sideOffset}
        class={cn(
            "z-50 flex w-72 origin-(--bits-popover-content-transform-origin) flex-col gap-2.5 rounded-lg bg-gray-900 p-2.5 text-sm text-gray-100 shadow-md ring-1 ring-gray-700 outline-hidden",
            className,
        )}
        {...restProps}
    />
</PopoverPrimitive.Portal>
