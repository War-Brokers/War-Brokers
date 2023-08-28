# Contribution Guide

## Welcome!

Hello, and thank <u>you 🫵</u> for taking your precious time to contribute to
War Brokers Projects! We hope you have a pleasant experience working with us <3

## How is the project organized?

The War Brokers Projects monorepo is managed by the following:

- [turborepo](https://turbo.build/repo)
  - used to orchestrate everything
  - config: [`turbo.json`](./turbo.json)
- [pnpm workspace](https://pnpm.io/workspaces)
  - used for JavaScript/Typescript projects and `package.json` scripts
  - config: [`pnpm-workspace.yaml`](./pnpm-workspace.yaml)
- [cargo workspaces](https://doc.rust-lang.org/book/ch14-03-cargo-workspaces.html)
  - used for rust projects
  - config: [`Cargo.toml`](./Cargo.toml)

## Setting up

**⚠️ WAIT! ⚠️**

If you are using Windows OS, make sure to run all commands in git bash which
you can download [here](https://git-scm.com/downloads).

1. Install the following
   - git
   - vscode
   - NodeJS
   - pnpm
   - rust toolchain (recommend using rustup)
2. Fork this repository
3. `git clone` the forked repository to your computer
4. Open cloned repository with vscode
   - install recommended extensions (a toast should show up on the bottom right corner of the window)
5. Install dependencies
   ```
   pnpm install
   ```
6. Initialize Git Hooks
   - this is used to lint your commit messages so they follow [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0)
   ```
   pnpm prepare
   ```
7. read `README.md` files of projects you would like to work on.
   You can find all projects in the [`apps`](./apps) and [`libs`](./libs)
   directory. You can run `package.json` scripts in the project directory like
   normal.

   For example:

   ```
   cd apps/wbtimeline && pnpm dev
   ```

## More

- Managing packages
  - [How do I add a package?](./docs/package-addition.md)
  - [How do I remove a package?](./docs/package-removal.md)
