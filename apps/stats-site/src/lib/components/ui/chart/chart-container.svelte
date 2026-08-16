<script lang="ts">
    import type { Snippet } from "svelte"
    import type { HTMLAttributes } from "svelte/elements"

    import { cn } from "$lib/utils"

    import { type ChartConfig, setChartContext } from "./chart-utils"

    const {
        id,
        class: className,
        config,
        children,
        ...restProps
    }: HTMLAttributes<HTMLDivElement> & {
        id: string
        config: ChartConfig
        children?: Snippet
    } = $props()

    setChartContext({
        get config() {
            return config
        },
    })
</script>

<div
    data-chart={id}
    data-slot="chart"
    class={cn(
        "flex justify-center overflow-visible text-xs",
        "[&_.lc-highlight-line]:stroke-0 [&_.lc-highlight-point]:stroke-transparent",
        "[&_.lc-axis-tick]:stroke-0 [&_.lc-axis-tick-label]:fill-gray-400",
        "[&_.lc-grid-y-rule]:stroke-gray-700/60",
        "[&_.lc-rule-x-line:not(.lc-grid-x-rule)]:stroke-0 [&_.lc-rule-y-line:not(.lc-grid-y-rule)]:stroke-0",
        "[&_.lc-root-container]:w-full [&_.lc-tooltip-rects-g]:fill-transparent [&_text]:stroke-transparent",
        className,
    )}
    {...restProps}
>
    {@render children?.()}
</div>
