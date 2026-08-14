<script lang="ts">
    import { flip, shift } from "@floating-ui/dom"
    import { Popover } from "flowbite-svelte"
    import QuestionMarkIcon from "flowbite-svelte-icons/QuestionCircleSolid.svelte"

    import { resolve } from "$app/paths"
    import A from "$lib/components/A.svelte"
    import { percentile2rank } from "$lib/rank"
    import { cn } from "$lib/utils"

    export let title: string
    export let data: string | number
    export let _id: string | undefined = undefined
    export let percentile: Promise<number | undefined> | undefined = undefined
    export let compact = false

    const chart = {
        baseline: 68,
        height: 50,
        left: 8,
        width: 224,
        zRange: 3.5,
    }

    function percentileToZ(percentile: number): number {
        const probability = Math.max(0.0001, Math.min(0.9999, percentile / 100))
        const value = probability * 2 - 1
        const coefficient = 0.147
        const logarithm = Math.log(1 - value * value)
        const first = 2 / (Math.PI * coefficient) + logarithm / 2

        return (
            Math.sign(value) *
            Math.SQRT2 *
            Math.sqrt(Math.sqrt(first * first - logarithm / coefficient) - first)
        )
    }

    function bellCurve(percentile: number): {
        areaPath: string
        curvePath: string
        markerX: number
        markerY: number
    } {
        const point = (z: number): [number, number] => [
            chart.left + ((z + chart.zRange) / (chart.zRange * 2)) * chart.width,
            chart.baseline - Math.exp(-(z * z) / 2) * chart.height,
        ]
        const z = Math.max(-chart.zRange, Math.min(chart.zRange, percentileToZ(percentile)))
        const steps = 80
        const curvePoints = Array.from({ length: steps + 1 }, (_, index) =>
            point(-chart.zRange + (index / steps) * chart.zRange * 2),
        )
        const areaSteps = Math.max(1, Math.ceil(((z + chart.zRange) / (chart.zRange * 2)) * steps))
        const areaPoints = Array.from({ length: areaSteps + 1 }, (_, index) =>
            point(-chart.zRange + (index / areaSteps) * (z + chart.zRange)),
        )
        const [markerX, markerY] = point(z)
        const pointsToPath = (points: [number, number][]) =>
            points
                .map(([x, y], index) => `${index === 0 ? "M" : "L"}${x.toFixed(2)},${y.toFixed(2)}`)
                .join(" ")

        return {
            areaPath: `M${chart.left},${chart.baseline} ${areaPoints.map(([x, y]) => `L${x.toFixed(2)},${y.toFixed(2)}`).join(" ")} L${markerX.toFixed(2)},${chart.baseline} Z`,
            curvePath: pointsToPath(curvePoints),
            markerX,
            markerY,
        }
    }
</script>

<div class={cn("flex flex-col", compact ? "w-full min-w-0 items-center" : "min-w-24")}>
    {#if title || percentile}
        <div class={cn("flex w-full", compact && "justify-center")}>
            {#if title}
                <span class="whitespace-nowrap font-bold dark:text-gray-400">
                    {title}
                </span>
            {/if}
            {#await percentile then percentile}
                {#if percentile !== undefined}
                    {@const { rank, icon } = percentile2rank(percentile)}
                    <div class={cn("flex items-center justify-center", title && "ms-1.5")} id={_id}>
                        <img
                            alt="The project logo"
                            src={icon}
                            class="aspect-square w-7 text-gray-200"
                        />
                        <span class="sr-only">Show information</span>
                    </div>
                    <Popover
                        triggeredBy="#{_id}"
                        class="z-10 w-72 max-w-[calc(100vw-2rem)] space-y-3 p-3 text-sm font-light dark:border-gray-600 dark:bg-gray-900 dark:text-gray-400"
                        {...{ middlewares: [flip(), shift({ padding: 16 })] }}
                        placement="top-start"
                    >
                        <div class="flex flex-col items-center justify-center">
                            <h3 class="text-center font-black dark:text-gray-200">
                                {rank}
                            </h3>
                            <img
                                alt="The project logo"
                                src={icon}
                                class="aspect-square w-16 text-gray-200"
                            />
                        </div>
                        {@const curve = bellCurve(percentile)}
                        <svg class="h-24 w-full overflow-visible" viewBox="0 0 240 88" role="img">
                            <title>
                                Bell curve showing this player at the
                                {percentile.toFixed(3)} percentile
                            </title>
                            <path
                                d={`${curve.curvePath} L${chart.left + chart.width},${chart.baseline} L${chart.left},${chart.baseline} Z`}
                                class="fill-gray-100 dark:fill-gray-800"
                            />
                            <path d={curve.areaPath} class="fill-orange-200 dark:fill-orange-900" />
                            <path
                                d={curve.curvePath}
                                class="fill-none stroke-gray-500 dark:stroke-gray-400"
                                stroke-width="2"
                                stroke-linecap="round"
                            />
                            <line
                                x1={curve.markerX}
                                x2={curve.markerX}
                                y1="8"
                                y2={chart.baseline}
                                class="stroke-orange-700 dark:stroke-orange-400"
                                stroke-width="2"
                                stroke-dasharray="3 3"
                            />
                            <circle
                                cx={curve.markerX}
                                cy={curve.markerY}
                                r="4"
                                class="fill-orange-700 stroke-white dark:fill-orange-400 dark:stroke-gray-900"
                                stroke-width="2"
                            />
                        </svg>
                        <h3 class="font-medium text-gray-900 dark:text-white">
                            better than
                            <span class="font-black">
                                {percentile.toFixed(3)}%
                            </span>
                            of the players!
                        </h3>
                        <br />
                        <A href={resolve("/ranks")} class="flex font-medium">
                            <QuestionMarkIcon class="mr-1 w-4" /> Learn More
                        </A>
                    </Popover>
                {/if}
            {/await}
        </div>
    {/if}
    <span
        class={cn(
            "font-black",
            compact ? "w-full break-words text-center sm:text-2xl" : "text-2xl",
        )}>{data}</span
    >
</div>
