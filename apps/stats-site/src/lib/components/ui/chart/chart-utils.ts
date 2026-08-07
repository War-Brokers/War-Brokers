import { getContext, setContext } from "svelte"

export type ChartConfig = Record<
    string,
    {
        label?: string
        color?: string
    }
>

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
