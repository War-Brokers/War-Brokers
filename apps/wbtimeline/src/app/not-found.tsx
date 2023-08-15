import { type Metadata } from "next"

export const metadata: Metadata = {
    title: "War Brokers Timeline | Page Not Found",
    openGraph: {
        title: "War Brokers Timeline | Page Not Found",
    },
}

export default function NotFound() {
    return (
        <div className="flex flex-col">
            <h1 className="text-7xl">404</h1>
            Page not found :(
        </div>
    )
}
