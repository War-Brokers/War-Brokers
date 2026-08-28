import type { faker } from "@faker-js/faker"

/**
 * Generates option for faker.js with laplace distribution.
 */
export function LaplaceOptions({
    min,
    max,
    mode,
    leftScale,
    rightScale,
    spikeProbability,
}: {
    min: number
    max: number
    mode: number
    leftScale: number
    rightScale: number
    spikeProbability: number
}) {
    return {
        min,
        max,
        distributor: (randomizer) => {
            if (randomizer.next() < spikeProbability) return (mode - min) / (max - min)

            let value: number

            do {
                const isLeft = randomizer.next() < leftScale / (leftScale + rightScale)
                const scale = isLeft ? leftScale : rightScale
                const distance = -scale * Math.log(1 - randomizer.next())
                value = mode + (isLeft ? -distance : distance)
            } while (value < min || value > max)

            return (value - min) / (max - min)
        },
    } as const satisfies Parameters<typeof faker.number.float>["0"]
}

/**
 * Generates option for faker.js with exponential distribution.
 */
export function ExponentialOptions({
    min,
    max,
    scale,
    shape,
}: {
    min: number
    max: number
    scale: number
    shape: number
}) {
    // cumulative distribution function
    const cdf = (value: number) => 1 - Math.exp(-Math.pow(value / scale, shape))
    const minimumCdf = cdf(min)
    const maximumCdf = cdf(max)

    return {
        min,
        max,
        distributor: (randomizer) => {
            const probability = minimumCdf + randomizer.next() * (maximumCdf - minimumCdf)
            const value = scale * Math.pow(-Math.log(1 - probability), 1 / shape)

            return (value - min) / (max - min)
        },
    } as const satisfies Parameters<typeof faker.number.float>["0"]
}
