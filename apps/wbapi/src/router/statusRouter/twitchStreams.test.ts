import { parseData } from "./twitchStreams"

test("twitchStreams", () => {
    expect(parseData("0,")).toStrictEqual({
        success: true,
        data: { total: 0, streams: [] },
    })

    expect(
        parseData(
            "3,thumbnail_1,streamer_1,69420,thumbnail_2,streamer_2,69420,thumbnail_3,streamer_3,69420",
        ),
    ).toStrictEqual({
        success: true,
        data: {
            total: 3,
            streams: [
                {
                    thumbnail: "thumbnail_1",
                    streamer: "streamer_1",
                    viewers: 69420,
                },
                {
                    thumbnail: "thumbnail_2",
                    streamer: "streamer_2",
                    viewers: 69420,
                },
                {
                    thumbnail: "thumbnail_3",
                    streamer: "streamer_3",
                    viewers: 69420,
                },
            ],
        },
    })
})
