import { gameModes } from "@warbrokers/types/src/gameMode"
import { vehicles } from "@warbrokers/types/src/vehicle"
import { weapons } from "@warbrokers/types/src/weapon"
import express from "express"
import basicAuth from "express-basic-auth"

import { seedDB } from "./seed-db"
import { dailyStats, stats, untrackedPlayer } from "./dummy-players"
import { csvStringify, formatTimestampDate, pick } from "./utils"

const PORT = 4000

const latestDailyWeaponColumns = (field: string) => weapons.map((id) => `${field}.${id}`)
const latestDailyVehicleColumns = (field: string) => vehicles.map((id) => `${field}.${id}`)
const latestDailyColumns = [
    "nick",
    "uid",
    "guest",
    "join_date",
    "last_seen",
    "coins",
    "xp",
    "level",
    ...latestDailyWeaponColumns("damage_dealt"),
    ...latestDailyWeaponColumns("damage_received"),
    ...latestDailyWeaponColumns("deaths"),
    ...latestDailyVehicleColumns("distance_driven"),
    ...latestDailyVehicleColumns("distance_driven_count"),
    ...latestDailyWeaponColumns("headshots"),
    ...latestDailyVehicleColumns("kills_per_vehicle"),
    ...latestDailyWeaponColumns("kills_per_weapon"),
    ...latestDailyWeaponColumns("longest_kill"),
    ...latestDailyWeaponColumns("most_kills_between_deaths"),
    ...latestDailyWeaponColumns("most_kills_in_round"),
    "number_of_capture_points",
    "number_of_jumps",
    "scuds_launched",
    ...latestDailyVehicleColumns("self_destructs"),
    ...latestDailyWeaponColumns("shots_fired_unzoomed"),
    ...latestDailyWeaponColumns("shots_fired_zoomed"),
    ...latestDailyWeaponColumns("shots_hit_unzoomed"),
    ...latestDailyWeaponColumns("shots_hit_zoomed"),
    "time_alive",
    "time_alive_count",
    "time_alive_longest",
    ...gameModes.map((id) => `wins.${id}`),
    ...gameModes.map((id) => `losses.${id}`),
    "frame_rate",
    "frame_rate_count",
    "ping_time",
    "ping_time_count",
    "total_kills",
    "kill_to_death_ratio",
    "kills_per_minute",
    "gamesELO",
    "killsELO",
    "zombie_kills",
    "zombie_deaths",
    "zombie_time_alive",
    "zombie_time_alive_count",
    "zombie_wins",
] as const

await seedDB()

const app = express()
app.set("json spaces", 0)
app.use(
    basicAuth({
        users: { id: "pw" },
        challenge: true,
    }),
)

app.get("/", (req, res) => {
    res.send("Hello, World!")
})

// todo: incomplete
app.get("/latest.txt", (req, res) => {
    res.type("text/plain")
    res.send(
        csvStringify(
            stats.map((player) => ({
                ...player,
                join_date: formatTimestampDate(player.joinTime),
                last_seen: formatTimestampDate(player.time),
            })),
        ),
    )
})

// todo: incomplete
app.get("/latest_daily.txt", (req, res) => {
    res.type("text/plain")
    res.send(
        csvStringify(
            dailyStats.map((player) => ({
                ...player,
                join_date: formatTimestampDate(player.joinTime),
                last_seen: formatTimestampDate(player.time),
            })),
            latestDailyColumns,
        ),
    )
})

app.get("/get_latest_time.php", (_req, res) => {
    const sixteenHoursInSeconds = 16 * 60 * 60
    const updatedAt = Math.floor(Date.now() / 1000) + sixteenHoursInSeconds
    res.type("text/html").send(String(updatedAt))
})

// todo: incomplete
app.get("/get_daily_stats.php", (req, res) => {
    const uid = req.query["uid"]
    if (typeof uid !== "string" || !uid) {
        res.send(
            'Please provide a UID. Like this: <a href="/get_daily_stats.php?uid=000000000000000000000001">/get_daily_stats.php?uid=000000000000000000000001</a>',
        )
        return
    }

    const data = dailyStats.find((e) => e.uid === uid)
    if (!data) {
        res.send(`No data for player: ${uid}`)
        return
    }

    res.json({ $id: data.uid, ...data })
})

app.get("/get_player_list.php", (req, res) => {
    const fields = req.query["squad"]
        ? (["nick", "nicklower", "uid", "squad"] as const)
        : (["nick", "nicklower", "uid"] as const)

    res.json([
        ...stats.map((player) => pick(player, fields)),
        {
            nick: "end_of_list",
            uid: "000000000000000000000000",
        },
    ])
})

app.get("/get_player_stats.php", (req, res) => {
    const uid = req.query["uid"]
    if (typeof uid !== "string" || !uid) {
        res.send(
            'Please provide a UID. Like this: <a href="/get_player_stats.php?uid=000000000000000000000001">/get_player_stats.php?uid=000000000000000000000001</a>',
        )
        return
    }

    const data =
        stats.find((e) => e.uid === uid) ??
        (uid === untrackedPlayer.uid ? untrackedPlayer : undefined)

    if (!data) {
        res.send(`No data for player: ${uid}`)
        return
    }

    res.json(data)
})

app.listen(PORT, () => {
    console.log(`Mock War Brokers DB is running on http://localhost:${PORT}`)
})
