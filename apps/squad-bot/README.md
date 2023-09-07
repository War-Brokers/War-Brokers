# Squad Bot

<!-- beta bot: https://discord.com/api/oauth2/authorize?client_id=1083253941342580806&permissions=414464658432&scope=bot%20applications.commands -->

[![](https://img.shields.io/badge/invite_bot-blue?style=for-the-badge&logo=discord&logoColor=white)](https://discord.com/api/oauth2/authorize?client_id=725779812412817429&permissions=414464658432&scope=bot%20applications.commands)

War Brokers utility bot for discord

## Setting up for development

1. Set up monorepo ([`CONTRIBUTING.md`](../../CONTRIBUTING.md))
2. Create a discord application for the bot

   - how-to - https://discordjs.guide/preparations/setting-up-a-bot-application.html
   - enable all `Privileged Gateway Intents`
     ![privileged gateway intents](../../.github/img/privileged-gateway-intents.png)

3. Clone this repository

4. Rename `.env.example` to `.env` and fill it up appropriately

5. Generate firebase service account key

   - click [this](https://console.firebase.google.com/u/0/project/_/settings/serviceaccounts/adminsdk) link, select your project, then generate new key. Rename it to `serviceAccountKey.json` then put it in the `src` directory.

6. Start the bot in testing mode

   ```
   pnpm dev
   ```

## Setting up for production (using docker)

_Read the previous section first_

1. Install docker and docker compose
2. Create `.env` file
3. Prepare `serviceAccountKey.json` file
4. Run the following docker compose file
   ```yaml
   version: "3"
   services:
     squad-bot:
       restart: unless-stopped
       image: developomp/wbp-squad-bot:latest
       environment:
         DISCORD_BOT_TOKEN: ${DISCORD_BOT_TOKEN}
       volumes:
         - ./serviceAccountKey.json:/home/node/dist/serviceAccountKey.json
   ```

## Learning Materials

- [Discord Developers Documentation](https://discord.com/developers/docs)
- [Discord.js Guide](https://discordjs.guide)
- [Sapphire framework Documentation](https://sapphirejs.dev/docs/General/Welcome)
