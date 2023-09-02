import { defineSecret } from "firebase-functions/params"

export const WB_ID = "WB_ID"
export const WB_PW = "WB_PW"
export const WB_DOMAIN = "WB_DOMAIN"
export const UPSTASH_URL = "UPSTASH_URL"
export const UPSTASH_TOKEN = "UPSTASH_TOKEN"

export default {
    wb: {
        id: defineSecret(WB_ID),
        pw: defineSecret(WB_PW),
        domain: defineSecret(WB_DOMAIN),
    },
    upstash: {
        url: defineSecret(UPSTASH_URL),
        token: defineSecret(UPSTASH_TOKEN),
    },
} as const
