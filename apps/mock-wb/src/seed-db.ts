import postgres from "postgres"

import { stats } from "./stats"

export async function seedDB() {
    const sql = postgres(
        "postgresql://localhost:5432/postgres",
        // Disable prefetch as it is not supported for "Transaction" pool mode
        { prepare: false },
    )

    await sql`
      CREATE TABLE
          players (
              uid text NOT NULL,
              nick text NOT NULL,
              nicklower text NOT NULL,
              level integer NOT NULL,
              xp bigint NOT NULL,
              squad text NULL,
              "killsELO" double precision NOT NULL,
              "gamesELO" double precision NOT NULL,
              coins bigint NULL,
              number_of_jumps integer NULL,
              steam boolean NULL,
              CONSTRAINT players_pkey PRIMARY KEY (uid)
          )`

    await sql`CREATE EXTENSION pg_trgm`
    await sql`CREATE INDEX IF NOT EXISTS squad_index ON players USING hash (squad)`
    await sql`CREATE INDEX IF NOT EXISTS player_search_index ON players USING gin (nicklower gin_trgm_ops)`
    await sql`CREATE INDEX IF NOT EXISTS killselo_index ON players USING btree ("killsELO")`
    await sql`CREATE INDEX IF NOT EXISTS gameselo_index ON players USING btree ("gamesELO")`
    await sql`CREATE INDEX IF NOT EXISTS xp_index ON players USING btree (xp)`
    await sql`CREATE INDEX IF NOT EXISTS level_index ON players USING btree (level)`

    const total = stats.length
    for (let i = 0; i < total; i++) {
        const {
            uid,
            nick,
            nicklower,
            level,
            xp,
            squad,
            killsELO,
            gamesELO,
            coins,
            number_of_jumps,
            steam,
        } = stats[i]
        if ((i + 1) % 100 === 0)
            console.log(
                `seeding ${(100 * (i + 1)) / total}% complete (${i + 1} / ${total})`,
            )

        await sql`INSERT INTO players VALUES (${uid}, ${nick}, ${nicklower}, ${level}, ${xp}, ${squad}, ${killsELO}, ${gamesELO}, ${coins}, ${number_of_jumps}, ${steam})`
    }

    console.log("seeding complete!")
}
