<script lang="ts">
    import { getChartContext, Tooltip as TooltipPrimitive } from "layerchart"

    import { cn } from "$lib/utils"

    import { useChart } from "./chart-utils"

    const {
        labelFormatter = (value: unknown) => String(value),
    }: {
        labelFormatter?: (value: unknown) => string
    } = $props()

    const chart = useChart()
    const context = getChartContext()
    const numberFormatter = new Intl.NumberFormat("en-US", { useGrouping: "min2" })

    type TooltipPayload = {
        key: string
        label: unknown
        name: string | undefined
        value: unknown
        color: string | undefined
    }

    type TooltipItem = TooltipPayload & {
        colorClass: string | undefined
        format: (value: unknown) => string
    }

    function isRecord(value: unknown): value is Record<string, unknown> {
        return typeof value === "object" && value !== null
    }

    function parsePayload(value: unknown): TooltipPayload[] {
        if (!Array.isArray(value)) return []

        return value.flatMap((item: unknown) => {
            if (!isRecord(item)) return []

            const key = typeof item["key"] === "string" ? item["key"] : ""
            const name = typeof item["name"] === "string" ? item["name"] : undefined
            const color = typeof item["color"] === "string" ? item["color"] : undefined

            return [{ key, name, color, label: item["label"], value: item["value"] }]
        })
    }

    function getTooltipItems(data: unknown, fallback: TooltipPayload[]): TooltipItem[] {
        if (!isRecord(data)) return resolveFallbackItems(fallback)

        const items = chart.config.flatMap((series) => {
            if (!(series.key in data)) return []

            return [
                {
                    key: series.key,
                    label: fallback[0]?.label,
                    value: data[series.key],
                    color: undefined,
                    name: series.label,
                    colorClass: series.colorClass,
                    format: series.format,
                },
            ]
        })

        return items.length > 0 ? items : resolveFallbackItems(fallback)
    }

    function resolveFallbackItems(items: TooltipPayload[]): TooltipItem[] {
        return items.map((item) => {
            const metric = chart.config.find((metric) => metric.key === item.key)

            return {
                ...item,
                name: metric?.label ?? item.name,
                colorClass: metric?.colorClass,
                format: metric?.format ?? formatValue,
            }
        })
    }

    function formatValue(value: unknown): string {
        if (typeof value === "number" || typeof value === "bigint")
            return numberFormatter.format(value)

        return String(value)
    }
</script>

<TooltipPrimitive.Root {context} variant="none" motion="none">
    {#snippet children({ data, payload: rawPayload })}
        {@const fallback = parsePayload(rawPayload as unknown)}
        {@const payload = getTooltipItems(data as unknown, fallback)}
        <div
            class="grid min-w-36 gap-1.5 rounded-lg border border-gray-600 bg-gray-900 px-3 py-2 text-xs shadow-xl"
        >
            {#if payload[0]}
                <div class="font-medium text-gray-100">
                    {labelFormatter(payload[0].label)}
                </div>
            {/if}
            {#each payload as item, index (`${item.key}-${index}`)}
                <div class="flex items-center justify-between gap-5 leading-none">
                    <div class="flex items-center gap-2 text-gray-400">
                        <span
                            class={cn("size-2.5 shrink-0 rounded-sm bg-current", item.colorClass)}
                            style:background-color={item.color}
                        ></span>
                        {item.name ?? item.key}
                    </div>
                    <span class="font-mono font-medium tabular-nums text-gray-100">
                        {item.format(item.value)}
                    </span>
                </div>
            {/each}
        </div>
    {/snippet}
</TooltipPrimitive.Root>
