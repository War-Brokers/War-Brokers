import type { ChartContextValue } from "layerchart"

import type { ChartBucket } from "./distributionData"

export type DistributionChartContext = Pick<
    ChartContextValue<ChartBucket>,
    "containerWidth" | "xScale" | "yScale" | "tooltip"
> & {
    yRange: number[]
}

export type DistributionLineAxis = {
    placement: "right"
    domain: [number, number]
    ticks: number[]
    format: (value: number) => string
    tickMarks: false
}
