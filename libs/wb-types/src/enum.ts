/** Converts a union into a tuple so enum value exports retain every member in their type. */
type UnionToIntersection<U> = (U extends unknown ? (value: U) => void : never) extends (
    value: infer I,
) => void
    ? I
    : never

type LastOf<U> =
    UnionToIntersection<U extends unknown ? () => U : never> extends () => infer L ? L : never

type UnionToTuple<U, Tuple extends unknown[] = []> = [U] extends [never]
    ? Tuple
    : UnionToTuple<Exclude<U, LastOf<U>>, [LastOf<U>, ...Tuple]>

/**
 * Returns an enum's runtime values as a tuple containing every enum member.
 *
 * ```typescript
 * enum MyEnum {
 *     A = "a",
 *     B = "b",
 *     C = "c",
 * }
 *
 * enumValues(MyEnum) === [MyEnum.A, MyEnum.B, MyEnum.C] // true
 * ```
 */
export function enumValues<const Enum extends Record<string, string | number>>(value: Enum) {
    const values = Object.values(value).filter(
        (entry) => typeof entry !== "string" || !(entry in value),
    )

    // eslint-disable-next-line @typescript-eslint/no-unsafe-type-assertion
    return values as unknown as UnionToTuple<Enum[keyof Enum]>
}
