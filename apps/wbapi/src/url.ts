import type Location from "@warbrokers/types/src/location"

// I literally don't know what this number is.
// Anything from 200 to 283 works, but nothing higher or lower.
export const mysteryNumber = 200

/**
 * useless for us
 */
export function locationURL() {
    return "https://warbrokers.io/get_location.php" as const
}

export function playerCountURL() {
    return "https://warbrokers.io/player_count.php" as const
}

export function playersOnlineURL() {
    return "https://warbrokers.io/players_online.php" as const
}

export function twitchStreamsURL() {
    return `https://store1.warbrokers.io/${mysteryNumber}/get_twitch_streams.php` as const
}

export function serverListURL(location: Location) {
    return `https://store1.warbrokers.io/${mysteryNumber}/server_list.php?location=${location}` as const
}
