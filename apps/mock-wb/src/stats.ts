import { faker } from "@faker-js/faker"
import type { Player } from "@warbrokers/types/src/player"

export const stats: Player[] = faker.helpers.multiple(
    () => {
        const nick = faker.string.alphanumeric({ length: { min: 2, max: 20 } })
        const level = faker.number.int({ min: 1, max: 5000 })

        return {
            uid: faker.database.mongodbObjectId(),
            nick,
            nicklower: nick.toLowerCase(),
            level,
            xp: level * 1000, // it's wrong but it works
            coins:
                faker.helpers.maybe(() =>
                    faker.number.int({ min: 0, max: 100_000 }),
                ) || null,
            squad:
                faker.helpers.maybe(() =>
                    faker.helpers.arrayElement([
                        "SQUAD1",
                        "SQUAD2",
                        "SQUAD2",
                        "SQUAD3",
                        "SQUAD4",
                    ]),
                ) || "",
            killsELO: faker.number.float({ min: 1000, max: 3000 }),
            gamesELO: faker.number.float({ min: 1000, max: 3000 }),
            number_of_jumps:
                faker.helpers.maybe(() =>
                    faker.number.int({ min: 1, max: 10_000 }),
                ) || null,
            steam: faker.helpers.arrayElement([true, false, null]),
        } satisfies Player
    },
    { count: 10_000 },
)

// todo: incomplete
export const dailyStats: (Pick<Player, "uid" | "nick" | "nicklower"> &
    Partial<Player>)[] = []
