# Contribution guide

## Welcome!

Hi! Thank you for taking your precious time to contribute to
War Brokers Projects! We hope you have a pleasant experience working with us <3

## Online infrastructure

![Infrastructure Diagram](./.github/img/infra.png)

## Getting started

Everything in this repository is put there under the assumption that the viewer is a developer.
If you are **NOT** a developer, but would like to contribute to the project, head over to our
[discord server](https://discord.com/invite/synPSeuNFK) and share your feature suggestions and
bug reports there!

If you are a developer wanting to work on the code, make sure you are familiar with the following:

- git & GitHub (PR, clone, fork)
- networking fundamentals
- nodejs ecosystem (javascript, typescript, npm, yarn, etc.)
- JS frameworks
  - [react](https://github.com/facebook/react)
  - [next.js](https://github.com/vercel/next.js)
  - [express](https://github.com/expressjs/express)
  - [trpc](https://github.com/trpc/trpc)
- [turborepo](https://turbo.build/repo)
- [devenv](https://devenv.sh/getting-started)
  - and by extension [direnv](https://devenv.sh/automatic-shell-activation)

Note that the above is a non-exhaustive, bare minimum list of things you need to be familiar with.

## Command cheat sheet

- Start testing server
  - http://localhost:5432 - WBAPI postgres DB
  - http://localhost:4000 - WB DB
  - http://localhost:5000 - wbapi
  - http://localhost:5173 - stats site
  - http://localhost:3000 - wbtimeline
  ```
  devenv up
  ```

## More

- Managing packages
  - [How do I add a package?](./docs/package-addition.md)
