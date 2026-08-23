export function formatTimeAlive(seconds: number) {
    return `${(seconds / 60 / 60).toLocaleString("en-US", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    })} hours`
}
