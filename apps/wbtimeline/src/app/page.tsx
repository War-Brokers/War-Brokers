import Header from "@/components/Header"
import Timeline from "@/components/Timeline"

export default function Page() {
    return (
        // the white vertical line breaks without this wrapper div for some reason
        <div className="flex flex-col items-center gap-40">
            <Header />
            <Timeline />
        </div>
    )
}
