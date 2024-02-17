import { defineSecret } from "firebase-functions/params"

export const WB_ID = "WB_ID"
export const WB_PW = "WB_PW"
export const WB_IP = "WB_IP"

export default {
    wb: {
        id: defineSecret(WB_ID),
        pw: defineSecret(WB_PW),
        ip: defineSecret(WB_IP),
    },
} as const
