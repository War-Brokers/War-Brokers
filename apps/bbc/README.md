# Project BBC - Better Broker Client

[![download badge](https://img.shields.io/badge/download_latest_version-gray?style=for-the-badge)](https://github.com/War-Brokers/War-Brokers/releases)

An experimental War Brokers client made to test different ideas:
designs, technologies, mechanics, etc...

## Will this replace the official War Brokers Client?

No. And for realistic reasons (trust me bro). This is only meant to be a practice/experiment client.

## Platform Support Table

| Platform |         Architectures and stuff          |    Supported     |
| :------: | :--------------------------------------: | :--------------: |
| Windows  |              x86_64 (64bit)              |       Yes        |
|  Linux   |                  x86_64                  |      Yes\*       |
|  MacOS   | AArch64 (Apple Silicon) & x86_64 (intel) |       Yes        |
|   Web    |                    -                     | No (not planned) |
|  Mobile  |                    -                     | No (not planned) |

\*: We're sticking with X11 for now. Wayland users will have to rely on Xwayland
for the time being.

## License

- [Kenney Assets](https://kenney.nl) - [CC0][CC0]
- [FilmCow](https://youtube.com/@filmcow)
  - [FilmCow SFX](https://filmcow.itch.io/filmcow-sfx) - [Royalty Free](./filmcow-sfx-license.pdf)
  - [FilmCow SFX 2](https://filmcow.itch.io/filmcow-sfx-2) - [Royalty Free](./filmcow-sfx-license.pdf)
- project source code - [MIT License](./LICENSE)
- Overpass font - [OFL](https://github.com/RedHatOfficial/Overpass/blob/master/OFL.txt)

[CC0]: https://creativecommons.org/share-your-work/public-domain/cc0

## Setting up for development

1. Set up monorepo ([`CONTRIBUTING.md`](../../CONTRIBUTING.md))
2. Set up bevy game engine dependencies
   - [bevy engine dependencies](https://bevyengine.org/learn/book/getting-started/setup)
3. Run the game
   ```
   pnpm dev
   ```
