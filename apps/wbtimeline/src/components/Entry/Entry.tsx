import "./styles.scss"

import { faCog, faFlag } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { nanoid } from "nanoid"

interface Props {
    className?: string

    category: "community" | "development"
    subcategory?: string
    timestamp: string

    title: string
    description: string
    media?: string[]
}

export default function Entry(props: Props) {
    return (
        <section
            className={`entry ml-[6.56rem] mr-4 p-4 lg:ml-4 ${props.className}`}
        >
            <div className="icon absolute flex aspect-square w-14 items-center justify-center rounded-full border-[3px] border-solid border-white bg-gray-900">
                {icon(props.category)}
            </div>

            <div className="item pb-4">
                <div className="date whitespace-nowrap uppercase tracking-widest">
                    {props.timestamp}
                </div>

                <div className="content">
                    <span className="subcategory">{props.subcategory}</span>
                    <h2 className="my-4 text-2xl font-bold leading-7">
                        {props.title}
                    </h2>

                    <div
                        className="description"
                        dangerouslySetInnerHTML={{ __html: props.description }}
                    />

                    {props.media?.map(media)}
                </div>
            </div>
        </section>
    )
}

function icon(category: Props["category"]) {
    switch (category) {
        case "community":
            return <FontAwesomeIcon icon={faFlag} />

        case "development":
            return <FontAwesomeIcon icon={faCog} />
    }
}

function media(media: string) {
    if (media.startsWith("/img"))
        // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text
        return <img key={nanoid()} src={media} />

    // if the link is a youtube video
    if (media.includes("youtube.com")) {
        return (
            <div key={nanoid()} className="video-container">
                <iframe src={media} />
            </div>
        )
    }
}
