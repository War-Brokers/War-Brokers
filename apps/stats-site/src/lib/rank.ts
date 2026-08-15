import adequate from "$lib/assets/ranks/shield-bronze-2.svg"
import advanced from "$lib/assets/ranks/shield-gold-6.svg"
import pro from "$lib/assets/ranks/shield-gold-10.svg"
import master from "$lib/assets/ranks/shield-gold-11.svg"
import godlike from "$lib/assets/ranks/shield-platinum-12.svg"
import legendary from "$lib/assets/ranks/shield-ruby-12.svg"
import ascended from "$lib/assets/ranks/shield-sapphire-12.svg"
import competent from "$lib/assets/ranks/shield-silver-3.svg"
import novice from "$lib/assets/ranks/shield-unranked.svg"

export type Rank =
    | "Ascended"
    | "Godlike"
    | "Legendary"
    | "Master"
    | "Pro"
    | "Advanced"
    | "Competent"
    | "Adequate"
    | "Novice"

export const rank2iconMap: { [key in Rank]: string } = {
    Ascended: ascended,
    Godlike: godlike,
    Legendary: legendary,
    Master: master,
    Pro: pro,
    Advanced: advanced,
    Competent: competent,
    Adequate: adequate,
    Novice: novice,
}

export const rank2percentileMap: { [key in Rank]: number } = {
    Ascended: 99.95,
    Godlike: 99.9,
    Legendary: 99.5,
    Master: 98,
    Pro: 95,
    Advanced: 90,
    Competent: 80,
    Adequate: 60,
    Novice: 0,
}

export function percentile2rank(percentile: number): {
    rank: Rank
    icon: string
} {
    let rank: Rank = "Novice"

    if (percentile > rank2percentileMap["Adequate"]) rank = "Adequate"
    if (percentile > rank2percentileMap["Competent"]) rank = "Competent"
    if (percentile > rank2percentileMap["Advanced"]) rank = "Advanced"
    if (percentile > rank2percentileMap["Pro"]) rank = "Pro"
    if (percentile > rank2percentileMap["Master"]) rank = "Master"
    if (percentile > rank2percentileMap["Legendary"]) rank = "Legendary"
    if (percentile > rank2percentileMap["Godlike"]) rank = "Godlike"
    if (percentile > rank2percentileMap["Ascended"]) rank = "Ascended"

    return { rank, icon: rank2iconMap[rank] }
}
