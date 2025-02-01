import { type Region } from "@warbrokers/types/src/region"

export const probablyAPIVersion = 301

/**
 * useless for us
 */
export function locationURL() {
    return `https://warbrokers.io/get_location.php` as const
}

export function playerCountURL() {
    return "https://warbrokers.io/player_count.php" as const
}

export function playersOnlineURL() {
    return "https://warbrokers.io/players_online.php" as const
}

export function twitchStreamsURL() {
    return `https://store1.warbrokers.io/${probablyAPIVersion}/get_twitch_streams.php` as const
}

export function serverListURL(location: Region) {
    return `https://store1.warbrokers.io/${probablyAPIVersion}/server_list.php?location=${location}` as const
}

export function playerListURL() {
    return `https://store1.warbrokers.io/${probablyAPIVersion}/get_player_list.php` as const
}

export function changelogURL() {
    return `https://store1.warbrokers.io/${probablyAPIVersion}/motd.php` as const
}
