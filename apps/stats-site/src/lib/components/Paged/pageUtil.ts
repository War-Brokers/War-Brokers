export const defaultValue = { page: 1, offset: 0, invalidated: true }

const MAX_DIGIT = 10

export function parsePage(
    str: string | null,
    limit: number,
): {
    page: number
    offset: number
    invalidated: boolean
} {
    if (str == null) return defaultValue
    if (str.length > MAX_DIGIT) return defaultValue

    for (const char of str)
        if (!["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"].includes(char))
            return defaultValue

    const page = parseInt(str)

    if (!Number.isFinite(page)) return defaultValue
    if (page == 0) return defaultValue

    return { page, offset: (page - 1) * limit, invalidated: false }
}
