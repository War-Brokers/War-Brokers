import { defineSecret } from "firebase-functions/params"

export const WB_ID = "WB_ID"
export const WB_PW = "WB_PW"
export const WB_DOMAIN = "WB_DOMAIN"

const wbID = defineSecret("WB_ID")
const wbPW = defineSecret("WB_PW")
const wbDomain = defineSecret("WB_DOMAIN")

export default {
    wb: {
        id: wbID,
        pw: wbPW,
        domain: wbDomain,
    },
} as const
