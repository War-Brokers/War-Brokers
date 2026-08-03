import { playerCount } from "./playerCount"

test("does not wait forever when the upstream API stops responding", async () => {
    const originalFetch = globalThis.fetch
    const timeoutController = new AbortController()
    const timeoutSpy = jest
        .spyOn(AbortSignal, "timeout")
        .mockReturnValue(timeoutController.signal)
    globalThis.fetch = jest.fn(
        (_input: string | URL | Request, init?: RequestInit) =>
            new Promise((_resolve, reject) => {
                init?.signal?.addEventListener(
                    "abort",
                    () => reject(init.signal?.reason),
                    { once: true },
                )
            }),
    )

    try {
        const request = playerCount().then(
            () => "completed" as const,
            () => "rejected" as const,
        )
        timeoutController.abort(new Error("upstream timeout"))

        const result = await Promise.race([
            request,
            new Promise<"timed out">((resolve) =>
                setTimeout(() => resolve("timed out"), 100),
            ),
        ])

        expect(result).toBe("rejected")
    } finally {
        timeoutSpy.mockRestore()
        globalThis.fetch = originalFetch
    }
})
