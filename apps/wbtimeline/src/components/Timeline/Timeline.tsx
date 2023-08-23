import { nanoid } from "nanoid"

import Entry from "@/components/Entry"
import data from "@/data"

import styles from "./styles.module.scss"

export default function Timeline() {
    return (
        <div
            className={`relative flex w-full max-w-6xl flex-col gap-20 ${styles.timeline}`}
        >
            {data.map((item) => (
                <Entry key={nanoid()} {...item} />
            ))}

            <Entry
                className="mb-96"
                timestamp="NOW"
                title="You can be part of the history"
                description={
                    'Join the <a href="https://discord.gg/warbrokers" target="_blank">War Brokers discord community</a> today and be a part of the history!'
                }
                category="community"
            />
        </div>
    )
}
