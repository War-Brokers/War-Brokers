import Link from "next/link"

export default function Header() {
    return (
        <header className="flex flex-col gap-8 pt-9 text-center">
            <h1 className="text-5xl font-bold">War Brokers Timeline</h1>
            <span>
                Made by{" "}
                <Link href="https://github.com/developomp" target="_blank">
                    [LP] POMP (developomp)
                </Link>
            </span>
        </header>
    )
}
