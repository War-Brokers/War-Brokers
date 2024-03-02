export function string2number(str: string): number {
    return Number(
        // remove comma
        str.replace(/,/g, ""),
    )
}
