import assert from "node:assert/strict"

import { faker } from "@faker-js/faker"

type FakeRecordOptions<Key extends string, Value> = {
    keys: readonly Key[]
    fakeValue: (key: Key) => Value
}

/**
 * Generates a value for every supplied key. Random omission can apply to each
 * key independently or to the entire record. Empty results are `undefined`.
 */
export function fakeRecord<const Key extends string, Value>(
    options: FakeRecordOptions<Key, Value> & { randomOmission: "subset" },
): Partial<Record<Key, Value>> | undefined
export function fakeRecord<const Key extends string, Value>(
    options: FakeRecordOptions<Key, Value> & { randomOmission: "all-or-nothing" },
): Record<Key, Value> | undefined
export function fakeRecord<const Key extends string, Value>(
    options: FakeRecordOptions<Key, Value> & { randomOmission?: never },
): Record<Key, Value>
export function fakeRecord({
    keys,
    fakeValue,
    randomOmission,
}: {
    keys: readonly string[]
    fakeValue: (...args: never[]) => unknown
    randomOmission?: "subset" | "all-or-nothing"
}) {
    const generate = ({ randomSubset }: { randomSubset: boolean } = { randomSubset: false }) => {
        const record: Record<string, unknown> = {}

        for (const key of keys) {
            if (!randomSubset || faker.datatype.boolean({ probability: 0.9 })) {
                record[key] = Reflect.apply(fakeValue, undefined, [key])
            }
        }

        return record
    }

    if (randomOmission === "subset") {
        const record = generate({ randomSubset: true })
        return Object.keys(record).length === 0 ? undefined : record
    }

    if (randomOmission === "all-or-nothing") {
        const record = faker.helpers.maybe(() => generate(), { probability: 0.9 })
        return record === undefined || Object.keys(record).length === 0 ? undefined : record
    }

    return generate()
}

/**
 * Splits `total` randomly across all supplied `keys` while preserving the exact total.
 *
 * ```javascript
 * distribute({ keys: ["p61", "p62", "p67"], total: 100 })
 * ```
 *
 * Might return:
 *
 * ```javascript
 * {
 *     p61: 52,
 *     p62: 31,
 *     p67: 17,
 * }
 * ```
 *
 * and
 *
 * ```javascript
 * sumStats(distribute({ keys, total })) === total // is true
 * ```
 *
 * If keys is empty, it returns `{}`.
 */
export function distribute({ keys, total }: { keys: readonly string[]; total: number }) {
    if (keys.length === 0) return {}

    const weights = keys.map(() => faker.number.float({ min: 0.01, max: 1 }))
    const totalWeight = weights.reduce((sum, weight) => sum + weight, 0)
    const distributed = fakeRecord({
        keys,
        fakeValue: (key) => {
            const weight = weights[keys.indexOf(key)] ?? 0
            return Math.floor((total * weight) / totalWeight)
        },
    })
    const remainder = total - Object.values(distributed).reduce((total, value) => total + value, 0)
    const firstKey = keys[0]

    if (firstKey !== undefined) distributed[firstKey] = (distributed[firstKey] ?? 0) + remainder

    assert.equal(
        Object.values(distributed).reduce((sum, value) => sum + value, 0),
        total,
        "Distributed values must sum to the requested total",
    )

    return distributed
}
