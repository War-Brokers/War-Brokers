const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

async function isServerAlive() {
    try {
        const res = await fetch("http://127.0.0.1:5000/ping")
        if (!res.ok) return false
        return (await res.text()) === '"pong!"'
    } catch {
        return false
    }
}

// eslint-disable-next-line no-constant-condition
while (true) {
    if (await isServerAlive()) break
    await sleep(1000)
}
