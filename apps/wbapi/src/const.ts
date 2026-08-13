import { type Region } from "@warbrokers/types/src/region"

export const probablyAPIVersion = 314

export function playersOnlineURL() {
    return "https://warbrokers.io/players_online.php" as const
}

export function twitchStreamsURL() {
    return `https://store1.warbrokers.io/${probablyAPIVersion}/get_twitch_streams.php` as const
}

export function serverListURL(location: Region) {
    return `https://store1.warbrokers.io/${probablyAPIVersion}/server_list.php?location=${location}` as const
}
