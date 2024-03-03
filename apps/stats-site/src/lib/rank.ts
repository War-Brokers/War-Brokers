import adequate from "$lib/assets/ranks/shield-bronze-2.png"
import advanced from "$lib/assets/ranks/shield-gold-6.png"
import pro from "$lib/assets/ranks/shield-gold-10.png"
import master from "$lib/assets/ranks/shield-gold-11.png"
import godlike from "$lib/assets/ranks/shield-platinum-12.png"
import legendary from "$lib/assets/ranks/shield-ruby-12.png"
import competent from "$lib/assets/ranks/shield-silver-3.png"
import novice from "$lib/assets/ranks/shield-unranked.png"

export type Rank =
    | "Godlike"
    | "Legendary"
    | "Master"
    | "Pro"
    | "Advanced"
    | "Competent"
    | "Adequate"
    | "Novice"

export const rank2iconMap: { [key in Rank]: string } = {
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

    return { rank: rank, icon: rank2iconMap[rank] }
}
