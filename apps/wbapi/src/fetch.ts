export const upstreamTimeoutMs = 10_000

/**
 * `fetch` wrapper with 10 second timeout.
 */
export function fetchUpstream(
    input: string | URL | Request,
    init: RequestInit = {},
): Promise<Response> {
    const timeoutSignal = AbortSignal.timeout(upstreamTimeoutMs)
    const signal = init.signal ? AbortSignal.any([init.signal, timeoutSignal]) : timeoutSignal

    return fetch(input, { ...init, signal })
}

/**
 * Allow Node's HTTP client to release network resources rather than leaving the response stream open.
 */
export async function discardResponseBody(response: Response): Promise<void> {
    await response.body?.cancel()
}
