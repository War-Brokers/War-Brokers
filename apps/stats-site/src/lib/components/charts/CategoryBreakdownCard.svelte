<script lang="ts">
    import { PieChart } from "layerchart"

    import * as Chart from "$lib/components/ui/chart"

    import type { CategoryBreakdownModel } from "./categoryBreakdown"

    const { model }: { model: CategoryBreakdownModel } = $props()

    let expanded = $state(false)
    let hoveredRowKey = $state<string | undefined>()
    let hoveredPieKey = $state<string | undefined>()

    const hoveredKey = $derived(hoveredRowKey ?? hoveredPieKey)
    const total = $derived(model.rows.reduce((sum, row) => sum + row.value, 0))
    const maximum = $derived(Math.max(0, ...model.rows.map((row) => row.value)))
    const visibleRowCount = $derived(model.visibleRowCount ?? 6)
    const visibleRows = $derived(expanded ? model.rows : model.rows.slice(0, visibleRowCount))
    const hasHiddenRows = $derived(model.rows.length > visibleRowCount)
    const chartConfig = $derived([
        {
            key: "value",
            label: model.valueLabel,
            colorClass: "text-orange-500",
            format: (value: unknown) => model.formatValue(Number(value)),
        },
    ])
    const donutData = $derived(
        model.rows.map((row) => ({
            ...row,
            props: {
                class: `fill-current stroke-gray-900 transition-opacity duration-150 motion-reduce:transition-none ${row.colorClass} ${hoveredKey && hoveredKey !== row.key ? "opacity-30" : "opacity-100"}`,
                "data-category-key": row.key,
            },
        })),
    )

    function axisWidth(value: number) {
        return maximum === 0 ? 0 : (value / maximum) * 100
    }

    function setHoveredPieData(value: unknown) {
        hoveredPieKey =
            typeof value === "object" &&
            value !== null &&
            "key" in value &&
            typeof value.key === "string"
                ? value.key
                : undefined
    }
</script>

<article
    class="overflow-hidden border border-gray-700 bg-gray-900"
    aria-labelledby={`${model.id}-title`}
>
    <header class="bg-gray-700 px-4 py-3 text-center">
        <h3 id={`${model.id}-title`} class="text-lg font-black text-gray-100">{model.title}</h3>
    </header>

    {#if model.rows.length === 0}
        <p class="flex min-h-80 items-center justify-center p-5 text-sm text-gray-400">No data.</p>
    {:else}
        {#if model.chartKind === "part-to-whole"}
            <figure class="px-4 pb-8 pt-6">
                <div
                    class="relative h-56 w-full sm:h-64"
                    role="img"
                    aria-label={`Donut chart showing ${model.formatValue(total)} ${model.totalLabel.toLocaleLowerCase()} distributed across ${model.rows.length} ${model.categoryPlural}.`}
                >
                    <Chart.Container
                        id={`${model.id}-donut`}
                        config={chartConfig}
                        class="h-56 w-full sm:h-64"
                    >
                        <PieChart
                            data={donutData}
                            key="key"
                            label="label"
                            value="value"
                            innerRadius={0.5}
                            outerRadius={0.88}
                            padAngle={0.01}
                            props={{ arc: { strokeWidth: 2 } }}
                        >
                            {#snippet tooltip()}
                                <Chart.Tooltip
                                    clampToContainer
                                    labelFormatter={(value) => String(value)}
                                    onDataChange={setHoveredPieData}
                                />
                            {/snippet}
                        </PieChart>
                    </Chart.Container>
                    <div
                        class="pointer-events-none absolute inset-0 flex flex-col items-center justify-center"
                        aria-hidden="true"
                    >
                        <strong class="text-2xl font-black tabular-nums text-gray-100">
                            {model.formatValue(total)}
                        </strong>
                        <span class="text-xs font-bold uppercase tracking-wider text-gray-400">
                            {model.totalLabel}
                        </span>
                    </div>
                </div>
                <figcaption class="sr-only">
                    {model.valueLabel} are sorted from most to least in the list below.
                </figcaption>
            </figure>
        {/if}

        <ol
            id={`${model.id}-rows`}
            class={`space-y-5 px-5 pb-6 ${model.chartKind === "ranked-values" ? "pt-6" : ""}`}
        >
            {#each visibleRows as row (row.key)}
                <li
                    class={`transition-opacity duration-150 motion-reduce:transition-none ${hoveredKey && hoveredKey !== row.key ? "opacity-30" : "opacity-100"}`}
                    data-category-key={row.key}
                    onpointerenter={() => (hoveredRowKey = row.key)}
                    onpointerleave={() => (hoveredRowKey = undefined)}
                >
                    <span class="flex items-baseline justify-between gap-3">
                        <span class="min-w-0 font-bold text-gray-200">{row.label}</span>
                        <strong class="shrink-0 font-black tabular-nums text-gray-100">
                            {model.formatValue(row.value)}
                        </strong>
                    </span>
                    <span class="mt-2 block h-3 overflow-hidden rounded-full bg-gray-700">
                        <span
                            class={`block h-full rounded-full bg-current ${row.colorClass}`}
                            style:width={`${axisWidth(row.value)}%`}
                            aria-hidden="true"
                        ></span>
                        <span class="sr-only">
                            {row.label}: {model.formatValue(row.value)}
                            {model.valueLabel.toLocaleLowerCase()}
                        </span>
                    </span>
                </li>
            {/each}
        </ol>

        {#if hasHiddenRows}
            <div class="px-5 pb-6 text-center">
                <button
                    type="button"
                    class="min-h-10 rounded-lg px-3 text-sm font-bold text-orange-400 underline decoration-2 underline-offset-4 hover:text-orange-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-400"
                    aria-controls={`${model.id}-rows`}
                    aria-expanded={expanded}
                    onclick={() => (expanded = !expanded)}
                >
                    {expanded
                        ? `Show fewer ${model.categoryPlural}`
                        : `Show all ${model.categoryPlural}`}
                </button>
            </div>
        {/if}

        <table class="sr-only">
            <caption>{model.title}</caption>
            <thead>
                <tr>
                    <th scope="col">{model.categoryLabel}</th>
                    <th scope="col">{model.valueLabel}</th>
                </tr>
            </thead>
            <tbody>
                {#each model.rows as row (row.key)}
                    <tr>
                        <th scope="row">{row.label}</th>
                        <td>{model.formatValue(row.value)}</td>
                    </tr>
                {/each}
            </tbody>
        </table>
    {/if}
</article>
