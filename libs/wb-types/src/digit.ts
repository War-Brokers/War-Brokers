import { z } from "zod"

export const DigitSchema = z.enum([
    "0",
    "1",
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",
    "8",
    "9",
])

export type Digit = z.infer<typeof DigitSchema>
