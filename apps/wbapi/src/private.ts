export function isPrivate(ip: string | undefined): boolean {
    if (!ip) return false

    if (ip.startsWith("::ffff:")) ip = ip.slice(7)

    if (ip.includes("."))
        return [
            /^10\./, // 10.0.0.0/8
            /^172\.(1[6-9]|2[0-9]|3[0-1])\./, // 172.16.0.0/12
            /^192\.168\./, // 192.168.0.0/16
            /^127\./, // 127.0.0.0/8 (loopback)
        ].some((range) => range.test(ip))

    if (ip.includes(":"))
        return [
            /^::1$/, // IPv6 loopback
            /^fc00:/i, // fc00::/7 (unique local)
            /^fe80:/i, // fe80::/10 (link-local)
            /^fd/i, // fd00::/8 (unique local)
        ].some((range) => range.test(ip))

    return false
}
