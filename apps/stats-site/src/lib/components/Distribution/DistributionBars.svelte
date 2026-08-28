<script lang="ts">
    import { Rect } from "layerchart"

    import type { ChartBucket } from "./distributionData"
    import { getHorizontalBarDimensions } from "./distributionChartGeometry"
    import type { DistributionChartContext } from "./distributionChartTypes"

    type Props = {
        context: DistributionChartContext
        buckets: readonly ChartBucket[]
        bucketSize: number
        colorClass: string
    }

    let { context, buckets, bucketSize, colorClass }: Props = $props()
</script>

{#each buckets as bucket (bucket.start)}
    <Rect
        {...getHorizontalBarDimensions(context, bucket, bucketSize)}
        fill="currentColor"
        stroke="none"
        motion="none"
        class={colorClass}
    />
{/each}
