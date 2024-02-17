# WBAPI

A one-stop hub for accessing various War Brokers APIs and DBs.

Prior to this project, developers had to manually scrape War Brokers' website
or use undocumented API endpoints. WBAPI aims to solve this problem by
providing simple interface between it and you.

## Usage

Documentations as well as the API itself can be found here: https://wbapi.wbpjs.com

## Tech Stack

- [Upstash (Redis)](https://upstash.com) - leaderboard, index, etc
- [Firebase functions](https://firebase.google.com/docs/functions) - backend
- [Firebase hosting](https://firebase.google.com/docs/hosting) - exposing firebase functions to the web

## Setting up

To test the project locally, perform the following steps:

1. Set up monorepo ([`CONTRIBUTING.md`](../../CONTRIBUTING.md))
2. Create a firebase project

   - You can sign-up and create a project [here](https://console.firebase.google.com)
   - Initialize firestore
   - Initialize hosting
     - If you are not using firebase's [multisites](https://firebase.google.com/docs/hosting/multisites) feature, remove the "targets" section in [.firebaserc](./.firebaserc) file
     - If you are, change the resource identifier's name appropriately

3. Change the name of the firebase project in [.firebaserc](./.firebaserc) appropriately
4. Set up [firebase CLI](https://firebase.google.com/docs/cli)
5. Open terminal in this (`wbapi`) directory
6. Start emulator.

   - Local server: http://localhost:5000
   - Emulator UI: http://localhost:4000

   ```
   pnpm start
   ```

If you also want to set up automatic GitHub action for it, perform the following steps:

1. Generate a firebase admin SDK key

   - Navigate [here](https://console.firebase.google.com/u/1/project/_/settings/serviceaccounts/adminsdk)
   - Select your project
   - Click "Generate new private key" (should download a json file)
   - Copy its contents to `GCP_SA_KEY` secret on GitHub action

2. Change admin SDK key permission

   navigate [here](https://console.cloud.google.com/iam-admin/iam), make sure you are on the right project, edit the firebase admin SDK principal, and add the "Owner" role
