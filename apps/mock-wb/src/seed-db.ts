import postgres from "postgres"

import { stats } from "./stats"

// PostgreSQL's bind-protocol limit is 65,535 parameters per statement.
// We're using 45 parameters per row: floor(65,535 / 45) = 1,456 rows.
const BATCH_SIZE = 1250

export async function seedDB() {
    const sql = postgres("postgresql://postgres@localhost:5432/postgres")

    const total = stats.length
    for (let start = 0; start < total; start += BATCH_SIZE) {
        const batch = stats.slice(start, start + BATCH_SIZE).map((stat) => ({
            uid: stat.uid,
            nick: stat.nick,
            nicklower: stat.nick.toLocaleLowerCase(),
            level: stat.level,
            xp: stat.xp,
            coins: stat.coins,
            squad: stat.squad,
            killsELO: stat.killsELO,
            gamesELO: stat.gamesELO,
            wins: stat.wins,
            losses: stat.losses,
            number_of_jumps: stat.number_of_jumps,
            scuds_launched: stat.scuds_launched,
            zombie_kills: stat.zombie_kills,
            zombie_deaths: stat.zombie_deaths,
            zombie_time_alive: stat.zombie_time_alive ?? null,
            zombie_time_alive_count: stat.zombie_time_alive_count ?? null,
            zombie_wins: stat.zombie_wins,
            self_destructs: stat.self_destructs,
            distance_driven: stat.distance_driven,
            distance_driven_count: stat.distance_driven_count,
            kills_per_vehicle: stat.kills_per_vehicle,
            shots_fired_unzoomed: stat.shots_fired_unzoomed,
            shots_fired_zoomed: stat.shots_fired_zoomed,
            shots_hit_unzoomed: stat.shots_hit_unzoomed,
            shots_hit_zoomed: stat.shots_hit_zoomed,
            damage_dealt: stat.damage_dealt,
            damage_received: stat.damage_received,
            most_kills_between_deaths: stat.most_kills_between_deaths ?? null,
            most_kills_in_round: stat.most_kills_in_round ?? null,
            kills_per_weapon: stat.kills_per_weapon,
            deaths: stat.deaths,
            headshots: stat.headshots,
            longest_kill: stat.longest_kill ?? null,
            banned: stat.banned,
            steam: stat.steam ?? null,
            time: stat.time,
            joinTime: stat.joinTime,
            ping_time: stat.ping_time ?? null,
            ping_time_count: stat.ping_time_count ?? null,
            frame_rate: stat.frame_rate ?? null,
            frame_rate_count: stat.frame_rate_count ?? null,
            time_alive_count: stat.time_alive_count ?? null,
            time_alive_longest: stat.time_alive_longest ?? null,
            time_alive: stat.time_alive ?? null,
        }))

        await sql`INSERT INTO players ${sql(batch)}`

        const inserted = Math.min(start + BATCH_SIZE, total)
        const progressPercent = 100 * (inserted / total)
        console.log(`seeding ${progressPercent.toFixed(2)}% complete (${inserted} / ${total})`)
    }

    console.log("seeding complete!")
}
