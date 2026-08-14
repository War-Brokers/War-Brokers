export type CategoryBreakdownRow = {
    key: string
    label: string
    value: number
    colorClass: string
}

export type CategoryBreakdownModel = {
    id: string
    title: string
    categoryLabel: string
    categoryPlural: string
    valueLabel: string
    chartKind: "part-to-whole" | "ranked-values"
    rows: readonly CategoryBreakdownRow[]
    formatValue: (value: number) => string
}
