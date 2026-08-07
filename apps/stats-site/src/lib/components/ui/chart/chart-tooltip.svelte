<script lang="ts">
    import { getChartContext, Tooltip as TooltipPrimitive } from "layerchart"

    import { useChart } from "./chart-utils"

    const {
        labelFormatter = (value: unknown) => String(value),
        valueFormatter = formatValue,
    }: {
        labelFormatter?: (value: unknown) => string
        valueFormatter?: ((value: unknown) => string) | undefined
    } = $props()

    const chart = useChart()
    const context = getChartContext()
    const numberFormatter = new Intl.NumberFormat("en-US", { useGrouping: "min2" })

    type TooltipItem = {
        key: string
        label: unknown
        name: string
        value: unknown
        color: string | undefined
    }

    function isRecord(value: unknown): value is Record<string, unknown> {
        return typeof value === "object" && value !== null
    }

    function parsePayload(value: unknown): TooltipItem[] {
        if (!Array.isArray(value)) return []

        return value.flatMap((item: unknown) => {
            if (!isRecord(item)) return []

            const key = typeof item["key"] === "string" ? item["key"] : "count"
            const name = typeof item["name"] === "string" ? item["name"] : key
            const color = typeof item["color"] === "string" ? item["color"] : undefined

            return [{ key, name, color, label: item["label"], value: item["value"] }]
        })
    }

    function formatValue(value: unknown): string {
        if (typeof value === "number" || typeof value === "bigint")
            return numberFormatter.format(value)

        return String(value)
    }
</script>

<TooltipPrimitive.Root {context} variant="none" motion="none">
    {#snippet children({ payload: rawPayload })}
        {@const payload = parsePayload(rawPayload as unknown)}
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
                            class="size-2.5 shrink-0 rounded-sm"
                            style:background-color={item.color}
                        ></span>
                        {chart.config[item.key]?.label ?? item.name}
                    </div>
                    <span class="font-mono font-medium tabular-nums text-gray-100">
                        {valueFormatter(item.value)}
                    </span>
                </div>
            {/each}
        </div>
    {/snippet}
</TooltipPrimitive.Root>
