# Contribution Guide

- Must follow [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0)
- must run commands on shell-like terminal emulators (e.g. sh, bash, zsh, fish, git bash, etc...)

## If you are on Windows OS

- Do **NOT** use the Command Prompt (cmd)
- Do **NOT** use Windows PowerShell
- Run all commands from PowerShell\* or a Linux terminal such as WSL or Git Bash

\* PowerShell and Windows PowerShell are [different applications](https://learn.microsoft.com/en-us/powershell/scripting/whats-new/differences-from-windows-powershell?view=powershell-7.3)

## Setting up

1. Install the following:
   - NodeJS
   - pnpm
   - git
   - vscode
   - rust toolchain (recommend using rustup)
2. Fork this repository
3. Clone the forked repository
4. Open repository with vscode
   - install recommended extensions (a toast should show up on the bottom right corner of the window)
5. Install dependencies
   ```
   pnpm install
   ```
6. Initialize Git Hooks ([husky](https://github.com/typicode/husky))
   ```
   pnpm prepare
   ```
7. read `README.md` files in [`apps`](./apps) and [`libs`](./libs)

## package.json script naming convention

- `build` - build library / app
- `dev` - run with live reload
- `start` - start the built app
- `lint` - run lint
- `clean` - remove all generated files

## Managing workspaces

Workspaces are managed by the following files

- Rust: [`Cargo.toml`](./Cargo.toml)
- JS / TS: [`pnpm-workspace.yaml`](./pnpm-workspace.yaml)
