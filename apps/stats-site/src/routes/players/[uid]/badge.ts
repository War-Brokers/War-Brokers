export enum badgeName {
    WBWC = "wbwc",
    WBWCPerf = "wbwc-perf",
}

export type Badge = {
    id: badgeName
    name: string
    date: string
    imageURL: string // 86x20 image
}

export const badges: Badge[] = [
    {
        id: badgeName.WBWC,
        name: "War Brokers World Cup Winning Team",
        date: "January 27, 2025",
        imageURL: "/badges/wbwc.avif",
    },
    {
        id: badgeName.WBWCPerf,
        name: "War Brokers World Cup 2025 Top Performers",
        date: "January 27, 2025",
        imageURL: "/badges/wbwc-perf.avif",
    },
]

export const badgedPlayers: { [key in string]: badgeName[] } = {
    "66151fc2d142afb50e946204": [badgeName.WBWC], // Automaton
    "5e48914cfe3c7a1f54b9c748": [badgeName.WBWC], // Silicon
    "5ebb843cfd3c7a4d05d0c765": [badgeName.WBWC], // 0bsolete
    "5e57527efe3c7acc73342809": [badgeName.WBWC], // EncryptR_
    "609d31d6d142af392b2023c5": [badgeName.WBWC], // Fear Striker
    "60302e62bfea714b1f19827c": [badgeName.WBWC], // REDONE
    "5ddb8a4abfea716943e9e4d5": [badgeName.WBWC], // Mrgorochin

    "5eb8e123bfea712e33e513f7": [badgeName.WBWCPerf, badgeName.WBWC], // Rocket
    "5ebf59cad142af697d790467": [badgeName.WBWCPerf], // VorteX
    "5ea0725cbfea71f973046cf9": [badgeName.WBWCPerf], // Kindness
}

export function getPlayerBadges(playerUID: string): Badge[] {
    if (!(playerUID in badgedPlayers)) return []
    return badges.filter(({ id }) => badgedPlayers[playerUID].includes(id))
}
