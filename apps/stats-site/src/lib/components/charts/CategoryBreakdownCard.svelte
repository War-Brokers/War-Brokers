<script lang="ts">
    import { PieChart } from "layerchart"

    import * as Chart from "$lib/components/ui/chart"
    import { cn } from "$lib/utils"

    import type { CategoryBreakdownModel } from "./categoryBreakdown"
    import MouseTooltipArc from "./MouseTooltipArc.svelte"

    const {
        model,
        hoveredCategoryKey,
        onHoveredCategoryKeyChange,
        pinnedCategoryKey,
        onPinnedCategoryKeyChange,
    }: {
        model: CategoryBreakdownModel
        hoveredCategoryKey?: string | undefined
        onHoveredCategoryKeyChange?: ((key: string | undefined) => void) | undefined
        pinnedCategoryKey?: string | undefined
        onPinnedCategoryKeyChange?: ((key: string | undefined) => void) | undefined
    } = $props()

    let hoveredRowKey = $state<string | undefined>()
    let hoveredPieKey = $state<string | undefined>()
    let localPinnedCategoryKey = $state<string | undefined>()

    const defaultPieOuterRadius = 0.88
    const hoveredPieOuterRadius = 0.91
    const pinnedPieOuterRadius = 0.95
    const defaultPieInnerRadius = defaultPieOuterRadius * 0.5
    const pinnedPieInnerRadius = pinnedPieOuterRadius * 0.5

    const rows = $derived(model.rows.filter((row) => row.value !== 0))
    const total = $derived(rows.reduce((sum, row) => sum + row.value, 0))
    const maximum = $derived(Math.max(0, ...rows.map((row) => row.value)))
    const percentageFormatter = new Intl.NumberFormat("en-US", {
        style: "percent",
        minimumFractionDigits: 1,
        maximumFractionDigits: 1,
    })
    const localHoveredCategoryKey = $derived(hoveredRowKey ?? hoveredPieKey)
    const activeHoveredCategoryKey = $derived(localHoveredCategoryKey ?? hoveredCategoryKey)
    const activePinnedCategoryKey = $derived(
        onPinnedCategoryKeyChange ? pinnedCategoryKey : localPinnedCategoryKey,
    )
    const activeCategoryKey = $derived(activePinnedCategoryKey ?? activeHoveredCategoryKey)
    const chartConfig = $derived([
        {
            key: "value",
            label: model.valueLabel,
            colorClass: "text-orange-500",
            format: (value: unknown) => {
                const numericValue = Number(value)
                const percentage = percentageFormatter.format(
                    total === 0 ? 0 : numericValue / total,
                )

                return `${model.formatValue(numericValue)} (${percentage})`
            },
        },
    ])
    const donutData = $derived(
        rows.map((row) => {
            const outerRadius = getPieOuterRadius(row.key)

            return {
                ...row,
                props: {
                    class: cn(
                        "cursor-pointer fill-current stroke-gray-900",
                        row.colorClass,
                        activeCategoryKey && activeCategoryKey !== row.key
                            ? "opacity-30"
                            : "opacity-100",
                    ),
                    innerRadius: getPieInnerRadius(row.key, outerRadius),
                    outerRadius,
                    "data-category-key": row.key,
                },
            }
        }),
    )

    function axisWidth(value: number) {
        return maximum === 0 ? 0 : (value / maximum) * 100
    }

    function getPieOuterRadius(key: string) {
        if (activePinnedCategoryKey === key) return pinnedPieOuterRadius
        if (activePinnedCategoryKey === undefined && activeHoveredCategoryKey === key)
            return hoveredPieOuterRadius

        return defaultPieOuterRadius
    }

    function getPieInnerRadius(key: string, outerRadius: number) {
        const innerRadius =
            activePinnedCategoryKey === key ? pinnedPieInnerRadius : defaultPieInnerRadius

        return innerRadius / outerRadius
    }

    function getCategoryKey(value: unknown) {
        return typeof value === "object" &&
            value !== null &&
            "key" in value &&
            typeof value.key === "string"
            ? value.key
            : undefined
    }

    function setHoveredRowKey(key: string | undefined) {
        hoveredRowKey = key
        onHoveredCategoryKeyChange?.(hoveredRowKey ?? hoveredPieKey)
    }

    function setHoveredPieData(value: unknown) {
        hoveredPieKey = getCategoryKey(value)
        onHoveredCategoryKeyChange?.(hoveredRowKey ?? hoveredPieKey)
    }

    function togglePinnedCategory(value: unknown) {
        const key = getCategoryKey(value)
        if (key === undefined) return

        const nextPinnedCategoryKey = activePinnedCategoryKey === key ? undefined : key

        if (onPinnedCategoryKeyChange) {
            onPinnedCategoryKeyChange(nextPinnedCategoryKey)
        } else {
            localPinnedCategoryKey = nextPinnedCategoryKey
        }
    }
</script>

<article class="border border-gray-700 bg-gray-900" aria-labelledby={`${model.id}-title`}>
    <header class="bg-gray-700 px-4 py-3 text-center">
        <h3 id={`${model.id}-title`} class="text-lg font-black text-gray-100">{model.title}</h3>
    </header>

    {#if rows.length === 0}
        <p class="flex min-h-80 items-center justify-center p-5 text-sm text-gray-400">No data.</p>
    {:else}
        {#if model.chartKind === "part-to-whole"}
            <figure class="px-4 pt-6">
                <div
                    class="relative h-56 w-full sm:h-64"
                    role="img"
                    aria-label={`Donut chart showing ${model.formatValue(total)} total ${model.valueLabel.toLocaleLowerCase()} distributed across ${rows.length} ${model.categoryPlural}.`}
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
                            outerRadius={defaultPieOuterRadius}
                            padAngle={0.01}
                            props={{ arc: { strokeWidth: 2 } }}
                            onArcClick={(_event, { data }) => {
                                togglePinnedCategory(data)
                            }}
                        >
                            {#snippet arc({ props })}
                                <MouseTooltipArc {...props} />
                            {/snippet}
                            {#snippet tooltip()}
                                <Chart.Tooltip
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
                            TOTAL
                        </span>
                    </div>
                </div>
                <figcaption class="sr-only">
                    {model.valueLabel} are sorted from most to least in the list below.
                </figcaption>
            </figure>
        {/if}

        <ol
            class="px-3 py-3"
            onpointerleave={() => {
                setHoveredRowKey(undefined)
            }}
        >
            {#each rows as row (row.key)}
                <li
                    class={cn(
                        "relative pt-0.5 first:pt-0",
                        activeCategoryKey && activeCategoryKey !== row.key
                            ? "opacity-30"
                            : "opacity-100",
                    )}
                    data-category-key={row.key}
                    onpointerenter={(event) => {
                        if (event.pointerType !== "touch") setHoveredRowKey(row.key)
                    }}
                >
                    <button
                        type="button"
                        class="relative block w-full cursor-pointer text-left focus-visible:z-10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-400"
                        aria-pressed={activePinnedCategoryKey === row.key}
                        onfocus={(event) => {
                            if (event.currentTarget.matches(":focus-visible"))
                                setHoveredRowKey(row.key)
                        }}
                        onblur={() => {
                            setHoveredRowKey(undefined)
                        }}
                        onclick={() => {
                            togglePinnedCategory(row)
                        }}
                    >
                        <span
                            class={cn(
                                "absolute inset-y-0 left-0 bg-current opacity-35",
                                row.colorClass,
                            )}
                            style:width={`${axisWidth(row.value)}%`}
                            aria-hidden="true"
                        ></span>
                        <span class="relative flex items-baseline justify-between gap-3 px-2 py-1">
                            <span class="min-w-0 truncate text-sm font-bold text-gray-200">
                                {row.label}
                            </span>
                            <strong class="shrink-0 text-sm font-black tabular-nums text-gray-100">
                                {model.formatValue(row.value)}
                            </strong>
                        </span>
                    </button>
                </li>
            {/each}
        </ol>

        <div class="sr-only">
            <table>
                <caption>{model.title}</caption>
                <thead>
                    <tr>
                        <th scope="col">{model.categoryLabel}</th>
                        <th scope="col">{model.valueLabel}</th>
                    </tr>
                </thead>
                <tbody>
                    {#each rows as row (row.key)}
                        <tr>
                            <th scope="row">{row.label}</th>
                            <td>{model.formatValue(row.value)}</td>
                        </tr>
                    {/each}
                </tbody>
            </table>
        </div>
    {/if}
</article>
