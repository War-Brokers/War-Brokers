# Contribution Guide

## Welcome!

Hi! Thank you for taking your precious time to contribute to
War Brokers Projects! We hope you have a pleasant experience working with us <3

## How is the project organized?

The War Brokers Projects monorepo is managed using the following technologies:

- [turborepo](https://turbo.build/repo)
  - used to orchestrate everything
  - config: [`turbo.json`](./turbo.json)
- [yarn workspace](https://yarnpkg.com/features/workspaces)

## Online Infrastructure

Our codes are deployed to the following services:

- [Supabase](https://supabase.com) - authentication, db, and other backend stuff
- [Vercel](https://vercel.com/home) - web hosting
- [DigitalOcean](https://digitalocean.com) - server hosting

## Setting up

**⚠️ WAIT! ⚠️**

If you are using Windows OS, make sure to run all commands in git bash which
you can download [here](https://git-scm.com/downloads).

1. Install the following
   - git
   - vscode
   - NodeJS
   - yarn
2. Fork this repository
3. `git clone` the forked repository to your computer
4. Open cloned repository with vscode
   - install recommended extensions (a toast should show up on the bottom right corner of the window)
5. Install dependencies
   ```
   yarn install
   ```
6. Initialize Git Hooks
   - this is used to lint your commit messages so they follow [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0)
   ```
   yarn prepare
   ```
7. read the `README.md` files of projects you would like to work on.
   Projects are located in [`apps`](./apps) and [`libs`](./libs)
   directory. You can run `package.json` scripts in the project directory like so:

   ```
   cd apps/wbtimeline && yarn dev
   ```

## More

- Managing packages
  - [How do I add a package?](./docs/package-addition.md)
