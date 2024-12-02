import { parse } from "csv-parse/sync"
import { stringify } from "csv-stringify/sync"

/**
 * https://stackoverflow.com/a/53739792
 */
export function flattenObject(ob: any): any {
    const toReturn: any = {}

    for (const i in ob) {
        if (!Object.prototype.hasOwnProperty.call(ob, i)) continue

        if (typeof ob[i] == "object" && ob[i] !== null) {
            const flatObject = flattenObject(ob[i])
            for (const x in flatObject) {
                if (!Object.prototype.hasOwnProperty.call(flatObject, x))
                    continue

                toReturn[i + "." + x] = flatObject[x]
            }
        } else {
            toReturn[i] = ob[i]
        }
    }

    return toReturn
}

export function parseCsv(csvString: string) {
    return parse(csvString, {
        columns: true,
        skip_empty_lines: true,
    })
}

function isEmpty(obj: object) {
    // this function is only meant to be run on objects
    if (typeof obj !== "object") return false

    for (const prop in obj) if (Object.hasOwn(obj, prop)) return false

    return true
}

export function pick(obj: any, attr: string[], deleteEmpty: boolean = true) {
    const newObj: any = {}

    for (const key of attr)
        if (Object.prototype.hasOwnProperty.call(obj, key))
            if (!(isEmpty(obj[key]) && deleteEmpty)) newObj[key] = obj[key]

    return newObj
}

export function csvStringify(obj: any[]) {
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
