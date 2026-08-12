import postgres from "postgres"

import { stats } from "./stats"

// PostgreSQL's bind-protocol limit is 65,535 parameters per statement.
// We're using 11 parameters per row: floor(65,535 / 11) = 5,957 rows
// We're using batch size of 5000 to make the number look nice.
const BATCH_SIZE = 5000

export async function seedDB() {
    const sql = postgres(
        "postgresql://postgres@localhost:5432/postgres",
        // Disable prefetch as it is not supported for "Transaction" pool mode
        { prepare: false },
    )

    const total = stats.length
    for (let start = 0; start < total; start += BATCH_SIZE) {
        const batch = stats.slice(start, start + BATCH_SIZE).map((stat) => ({
            uid: stat.uid,
            nick: stat.nick,
            nicklower: stat.nick.toLocaleLowerCase(),
            level: stat.level,
            xp: stat.xp,
            squad: stat.squad,
            killsELO: stat.killsELO,
            gamesELO: stat.gamesELO,
            coins: stat.coins,
            number_of_jumps: stat.number_of_jumps,
            steam: stat.steam === undefined ? null : stat.steam,
        }))

        await sql`INSERT INTO players ${sql(batch)}`

        const inserted = Math.min(start + BATCH_SIZE, total)
        const progressPercent = 100 * (inserted / total)
        console.log(`seeding ${progressPercent.toFixed(2)}% complete (${inserted} / ${total})`)
    }

    console.log("seeding complete!")
}
