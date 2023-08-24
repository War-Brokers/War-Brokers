import { z } from "zod"

import { AbortError } from "@/errors"

export function string2number(str: string): number {
    const parseResult = z.number().safeParse(
        Number(
            // remove comma
            str.replace(/,/g, ""),
        ),
    )

    if (!parseResult.success) throw AbortError

    return parseResult.data
}
