import type { CategoryBreakdownRow } from "$lib/components/charts/categoryBreakdown"

type CategoryValues = Readonly<Record<string, number>> | null | undefined
type CategoryPresentation = Pick<CategoryBreakdownRow, "label" | "colorClass">

export function feetToMeters(feet: number) {
    return feet * 0.3048
}

export function formatInteger(value: number) {
    return value.toLocaleString("en-US", { maximumFractionDigits: 0 })
}

export function formatDecimal(value: number) {
    return value.toLocaleString("en-US", {
        minimumFractionDigits: 1,
        maximumFractionDigits: 1,
    })
}

export function formatPercentage(value: number) {
    return `${formatDecimal(value)}%`
}

export function formatMeters(value: number) {
    return `${formatDecimal(value)} m`
}

export function addValues(...records: CategoryValues[]) {
    const sums: Record<string, number> = {}

    for (const record of records) {
        for (const [key, value] of Object.entries(record ?? {})) {
            sums[key] = (sums[key] ?? 0) + value
        }
    }

    return sums
}

export function divideValues(numerators: CategoryValues, denominators: CategoryValues, factor = 1) {
    return Object.fromEntries(
        Object.entries(denominators ?? {})
            .filter(([, denominator]) => denominator > 0)
            .map(([key, denominator]) => [key, ((numerators?.[key] ?? 0) / denominator) * factor]),
    )
}

export function mapValues(values: CategoryValues, mapValue: (value: number) => number) {
    return Object.fromEntries(
        Object.entries(values ?? {}).map(([key, value]) => [key, mapValue(value)]),
    )
}

export function createRows(
    values: CategoryValues,
    getPresentation: (key: string) => CategoryPresentation,
    includeZero = false,
) {
    return Object.entries(values ?? {})
        .filter(([, value]) => Number.isFinite(value) && (includeZero || value > 0))
        .map(([key, value]) => ({
            key,
            value,
            ...getPresentation(key),
        }))
        .sort((a, b) => b.value - a.value || a.label.localeCompare(b.label))
}
