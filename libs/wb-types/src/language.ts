import { enumValues } from "./enum"

export enum Language {
    DE = "de", // Deutsche
    EN = "en", // English
    ES = "es", // Español
    FR = "fr", // France
    IT = "it", // 🤌
    JA = "ja", // Japanese
    KO = "ko", // Korean
    NL = "nl", // Netherlands
    PT = "pt", // Portuguese
    RU = "ru", // Russian
    ZH = "zh", // Chinese
}

export const languages = enumValues(Language)
