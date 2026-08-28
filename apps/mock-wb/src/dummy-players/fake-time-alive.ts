import { faker } from "@faker-js/faker"

import { ExponentialOptions } from "./distributions"

export function fakeTimeAlive() {
    const secondsPerHour = 60 * 60
    const maxTimeAliveHours = 17_500

    return faker.number.float({ min: 0, max: 1 }) < 0.0001
        ? faker.number.float({
              min: 2_500 * secondsPerHour,
              max: maxTimeAliveHours * secondsPerHour,
              fractionDigits: 5,
          })
        : (faker.helpers.maybe(
              () =>
                  faker.number.float(
                      ExponentialOptions({
                          min: 25 * secondsPerHour,
                          max: maxTimeAliveHours * secondsPerHour,
                          scale: 8 * secondsPerHour,
                          shape: 0.4,
                      }),
                  ),
              { probability: 0.215 },
          ) ??
              faker.number.float({
                  min: 0,
                  max: 25 * secondsPerHour - 1,
                  fractionDigits: 5,
              }))
}

export function fakeTimeAliveCount({
    timeAlive,
    totalDeaths,
}: {
    timeAlive: number
    totalDeaths: number
}) {
    return timeAlive === 0 ? 0 : totalDeaths + 1
}

export function fakeTimeAliveLongest({
    timeAlive,
    timeAliveCount,
    averageTimeAlive,
}: {
    timeAlive: number
    timeAliveCount: number
    averageTimeAlive: number
}) {
    if (timeAliveCount === 0) return 0
    if (timeAliveCount === 1) return timeAlive

    return faker.number.float({
        min: averageTimeAlive,
        max: Math.min(timeAlive, Math.max(averageTimeAlive * 5, 2000)),
        fractionDigits: 5,
    })
}

export function fakeZombieTimeAlive(zombieTimeAliveCount: number) {
    if (zombieTimeAliveCount === 0) return 0

    return faker.number.float({
        min: 0,
        max: zombieTimeAliveCount * 1000,
        fractionDigits: 5,
    })
}
