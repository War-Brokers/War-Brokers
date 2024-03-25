import { z } from "zod"

// 24 character hexadecimal string
export const uid = z
    .string()
    .length(24)
    .refine(
        (str) => {
            return /[0-9a-fA-F]{24}/.test(str)
        },
        { message: "uid must be a 24 character hexadecimal string" },
    )

export const nick = z.string().min(2).max(20)
