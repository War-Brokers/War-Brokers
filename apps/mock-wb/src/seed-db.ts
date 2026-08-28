import postgres from "postgres"
import { playerSchema } from "@warbrokers/types/src/player"

import { stats } from "./dummy-players"

// PostgreSQL's bind-protocol limit is 65,535 parameters per statement.
// We're using 45 parameters per row: floor(65,535 / 45) = 1,456 rows.
const BATCH_SIZE = 1250

export async function seedDB() {
    const sql = postgres("postgresql://postgres@localhost:5432/postgres", {
        transform: {
            undefined: null,
        },
    })

    const playerColumns = playerSchema.keyof().options

    const total = stats.length
    for (let start = 0; start < total; start += BATCH_SIZE) {
        const batch = stats.slice(start, start + BATCH_SIZE)

        await sql`INSERT INTO players ${sql(batch, playerColumns)}`

        const inserted = Math.min(start + BATCH_SIZE, total)
        const progressPercent = 100 * (inserted / total)
        console.log(`seeding ${progressPercent.toFixed(2)}% complete (${inserted} / ${total})`)
    }

    console.log("seeding complete!")
}
