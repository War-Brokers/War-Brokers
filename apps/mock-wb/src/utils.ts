import { parse } from "csv-parse/sync"
import { stringify } from "csv-stringify/sync"

type CsvRow = Record<string, string>
type UnknownRecord = Record<string, unknown>

function isRecord(value: unknown): value is UnknownRecord {
    return typeof value === "object" && value !== null
}

function isCsvRows(value: unknown): value is CsvRow[] {
    return (
        Array.isArray(value) &&
        value.every(
            (row: unknown) =>
                isRecord(row) &&
                !Array.isArray(row) &&
                Object.values(row).every((field) => typeof field === "string"),
        )
    )
}

/**
 * https://stackoverflow.com/a/53739792
 */
export function flattenObject(ob: UnknownRecord): UnknownRecord {
    const toReturn: UnknownRecord = {}

    for (const [key, value] of Object.entries(ob)) {
        if (isRecord(value)) {
            const flatObject = flattenObject(value)
            for (const [nestedKey, nestedValue] of Object.entries(flatObject)) {
                toReturn[`${key}.${nestedKey}`] = nestedValue
            }
        } else {
            toReturn[key] = value
        }
    }

    return toReturn
}

export function parseCsv(csvString: string): CsvRow[] {
    const rows: unknown = parse(csvString, {
        columns: true,
        skip_empty_lines: true,
    })

    if (!isCsvRows(rows)) {
        throw new TypeError("Expected CSV records with string values")
    }

    return rows
}

function isEmpty(value: unknown) {
    // this function is only meant to be run on objects
    if (typeof value !== "object") return false
    if (value === null) return true

    return Object.keys(value).length === 0
}

export function pick<T extends object, Key extends keyof T>(
    obj: T,
    attr: readonly Key[],
    deleteEmpty: boolean = true,
): Partial<Pick<T, Key>> {
    const newObj: Partial<Pick<T, Key>> = {}

    for (const key of attr)
        if (Object.prototype.hasOwnProperty.call(obj, key))
            if (!(isEmpty(obj[key]) && deleteEmpty)) newObj[key] = obj[key]

    return newObj
}

export function csvStringify(obj: readonly UnknownRecord[]): string {
    return stringify(
        obj.map((x) => flattenObject(x)),
        {
            header: true,
            quoted: true,
            cast: {
                boolean: (value) => (value ? "1" : "0"),
            },
        },
    )
}
