import express from "express"
import basicAuth from "express-basic-auth"

import { seedDB } from "./seed-db"
import { dailyStats, stats } from "./stats"
import { csvStringify, pick } from "./utils"

const PORT = 4000

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
    /**
     * Formats UNIX timestamp (seconds) to YY-MM-DD.
     */
    function formatTimestampDate(timestamp: number) {
        return timestamp === 0 ? 0 : new Date(timestamp * 1000).toISOString().slice(2, 10)
    }

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
    res.send(csvStringify(dailyStats))
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

    const data = stats.find((e) => e.uid === uid)
    if (!data) {
        res.send(`No data for player: ${uid}`)
        return
    }

    res.json(data)
})

app.listen(PORT, () => {
    console.log(`Mock War Brokers DB is running on http://localhost:${PORT}`)
})
