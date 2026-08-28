<script lang="ts">
    import { Axis } from "layerchart"

    import { getLineScale } from "./distributionChartGeometry"
    import type { DistributionChartContext, DistributionLineAxis } from "./distributionChartTypes"

    type Props = {
        context: DistributionChartContext
        horizontalTicks: number[]
        lineAxis: DistributionLineAxis
        formatHorizontalTick: (value: unknown) => string
    }

    let { context, horizontalTicks, lineAxis, formatHorizontalTick }: Props = $props()

    const lineScale = $derived(getLineScale(context.yRange, lineAxis.domain))
</script>

<Axis
    placement="bottom"
    scale={context.xScale}
    ticks={horizontalTicks}
    format={formatHorizontalTick}
/>
<Axis
    placement={lineAxis.placement}
    scale={lineScale}
    ticks={lineAxis.ticks}
    format={(value) => lineAxis.format(Number(value))}
    tickMarks={lineAxis.tickMarks}
/>
