import { defineSecret } from "firebase-functions/params"

export const WB_ID = "WB_ID"
export const WB_PW = "WB_PW"
export const WB_DB_IP = "WB_DB_IP"

export default {
    wb: {
        id: defineSecret(WB_ID),
        pw: defineSecret(WB_PW),
        ip_db: defineSecret(WB_DB_IP), // IP address of the DB
    },
} as const
