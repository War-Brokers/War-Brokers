import "./tailwind.css"
import "./global.scss"
import "@fortawesome/fontawesome-svg-core/styles.css"

import { config } from "@fortawesome/fontawesome-svg-core"
import type { Metadata } from "next"
import type { ReactNode } from "react"

// https://fontawesome.com/docs/web/use-with/react/use-with#getting-font-awesome-css-to-work
config.autoAddCss = false

export const metadata: Metadata = {
    title: "War Brokers Timeline",
    description:
        "Various events happened in the War Brokers community in a chronological order.",
}

export default function RootLayout({ children }: { children: ReactNode }) {
    return (
        <html lang="en" className="dark h-full bg-[#2d2a38] text-gray-100">
            <head>
                <script
                    src="https://rybbit.pompy.dev/api/script.js"
                    data-site-id="1"
                    data-web-vitals="true"
                    defer
                ></script>
                <link
                    rel="shortcut icon"
                    type="image/svg+xml"
                    href="/favicon.svg"
                />
            </head>
            <body>{children}</body>
        </html>
    )
}
