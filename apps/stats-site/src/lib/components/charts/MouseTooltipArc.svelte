<!--
@component
LayerChart treats touch contact as hover and prevents touch movement when an arc has a tooltip.
This wrapper keeps tooltips for hover pointers while touch pointers remain available for scrolling and tapping.
-->

<script lang="ts">
    import { Arc } from "layerchart"
    import type { ComponentProps } from "svelte"

    type MouseTooltipArcProps = Omit<ComponentProps<typeof Arc>, "data"> & { data?: unknown }

    const {
        data,
        tooltipContext,
        onpointerenter,
        onpointermove,
        onpointerleave,
        ...props
    }: MouseTooltipArcProps = $props()

    function showTooltip(event: PointerEvent) {
        if (event.pointerType !== "touch") tooltipContext?.show(event, data)
    }

    function hideTooltip(event: PointerEvent) {
        if (event.pointerType !== "touch") tooltipContext?.hide(event)
    }
</script>

<Arc
    {...props}
    onpointerenter={(event) => {
        onpointerenter?.(event)
        showTooltip(event)
    }}
    onpointermove={(event) => {
        onpointermove?.(event)
        showTooltip(event)
    }}
    onpointerleave={(event) => {
        onpointerleave?.(event)
        hideTooltip(event)
    }}
/>
