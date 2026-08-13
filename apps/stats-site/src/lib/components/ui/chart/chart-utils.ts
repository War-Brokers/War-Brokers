import { getContext, setContext } from "svelte"

export type ChartMetric = {
    key: string
    label: string
    colorClass: string
    format: (value: unknown) => string
}

export type ChartConfig = ChartMetric[]

type ChartContextValue = {
    config: ChartConfig
}

const chartContextKey = Symbol("chart-context")

export function setChartContext(value: ChartContextValue) {
    return setContext(chartContextKey, value)
}

export function useChart() {
    return getContext<ChartContextValue>(chartContextKey)
}
