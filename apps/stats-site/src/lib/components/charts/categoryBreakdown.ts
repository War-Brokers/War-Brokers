export type CategoryBreakdownRow = {
    key: string
    label: string
    value: number
    colorClass: string
}

type CategoryBreakdownBase = {
    id: string
    title: string
    categoryLabel: string
    categoryPlural: string
    valueLabel: string
    rows: readonly CategoryBreakdownRow[]
    visibleRowCount?: number
    formatValue: (value: number) => string
}

export type CategoryBreakdownModel = CategoryBreakdownBase &
    (
        | {
              chartKind: "part-to-whole"
              totalLabel: string
          }
        | {
              chartKind: "ranked-values"
          }
    )
