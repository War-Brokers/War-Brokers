import adequate from "$lib/assets/ranks/shield-bronze-2.svg"
import advanced from "$lib/assets/ranks/shield-gold-6.svg"
import pro from "$lib/assets/ranks/shield-gold-10.svg"
import master from "$lib/assets/ranks/shield-gold-11.svg"
import godlike from "$lib/assets/ranks/shield-platinum-12.svg"
import legendary from "$lib/assets/ranks/shield-ruby-12.svg"
import ascended from "$lib/assets/ranks/shield-sapphire-12.svg"
import competent from "$lib/assets/ranks/shield-silver-3.svg"
import novice from "$lib/assets/ranks/shield-unranked.svg"

export const ranks = {
    Ascended: /***/ { icon: ascended, /***/ color: "#1250BC", percentile: 99.99 },
    Godlike: /****/ { icon: godlike, /****/ color: "#73F0E8", percentile: 99.9 },
    Legendary: /**/ { icon: legendary, /**/ color: "#C62D43", percentile: 99.5 },
    Master: /*****/ { icon: master, /*****/ color: "#FC9504", percentile: 98 },
    Pro: /********/ { icon: pro, /********/ color: "#FEC92B", percentile: 95 },
    Advanced: /***/ { icon: advanced, /***/ color: "#FEEF8E", percentile: 90 },
    Competent: /**/ { icon: competent, /**/ color: "#DDE7ED", percentile: 80 },
    Adequate: /***/ { icon: adequate, /***/ color: "#EDA379", percentile: 60 },
    Novice: /*****/ { icon: novice, /*****/ color: "#324692", percentile: 0 },
} as const satisfies Record<
    string,
    {
        icon: string
        color: string
        percentile: number
    }
>

export type Rank = keyof typeof ranks

const rankNamesByPercentile = Object.keys(ranks)
    .filter((rank): rank is Rank => Object.hasOwn(ranks, rank))
    .sort((a, b) => ranks[b].percentile - ranks[a].percentile)

export function percentile2rank(percentile: number) {
    const rank =
        rankNamesByPercentile.find((rank) => percentile > ranks[rank].percentile) ??
        rankNamesByPercentile.at(-1)

    if (rank === undefined) throw new Error("At least one rank must be configured")

    return { rank, icon: ranks[rank].icon } as const satisfies { rank: Rank; icon: string }
}
