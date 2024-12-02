# Contribution guide

## Online infrastructure

![Infrastructure Diagram](./.github/img/infra.png)

## Getting started

Everything in this repository is put there under the assumption that the viewer
is a developer. If you are **NOT** a developer, but would like to contribute to
the project, head over to our [discord server][discord-invite] and share your
suggestions and bug reports with us!

If you are a developer who want to get their hands dirty, begin by familiarizing
yourself with the following:

- code management
  - VCS (git & GitHub)
  - unit testing with [jest](https://jestjs.io)
  - end-to-end web app testing with [playwright](https://playwright.dev)
  - monorepo management with [turborepo](https://turbo.build/repo)
  - development environment setup with [devenv](https://devenv.sh/getting-started)
    - and by extension [direnv](https://devenv.sh/automatic-shell-activation) and [nix](https://nix.dev/tutorials/nix-language)
  - formatting with [prettier](https://prettier.io)
  - linting with [eslint](https://eslint.org)
  - [vscode](https://code.visualstudio.com)
- web
  - HTML + CSS + JS
  - OSI model
  - Critical Rendering Path
  - rendering strategies
    - Server-side Rendering (SSR)
    - Static Site Generation (SSG)
    - Client-side Rendering (CSR)
- nodejs ecosystem
  - [Node.js](https://nodejs.org)
  - [javascript](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
  - [typescript](https://typescriptlang.org)
  - [react](https://github.com/facebook/react)
  - [next.js](https://github.com/vercel/next.js)
  - [svelte](https://svelte.dev) and [sveltekit](https://kit.svelte.dev)
  - [express](https://github.com/expressjs/express)
  - [trpc](https://github.com/trpc/trpc)

Note that the list above is non-exhaustive. Don't get discouraged though. You
can always learn as you go, and members of our [discord server][discord-invite]
can help you if you get stuck at any point.

## Getting started for real

Simply clone the repository, install devenv, and run `devenv up`. It will
automagically build and launch the following services for you.

- Start testing server
  - http://localhost:5432 - WBAPI postgres DB
  - http://localhost:4000 - WB DB
  - http://localhost:5000 - wbapi
  - http://localhost:5173 - stats site
  - http://localhost:3000 - wbtimeline

[discord-invite]: https://discord.com/invite/synPSeuNFK
