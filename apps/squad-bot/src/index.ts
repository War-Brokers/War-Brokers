import {
    ApplicationCommandRegistries,
    RegisterBehavior,
    SapphireClient,
} from "@sapphire/framework"
import { GatewayIntentBits } from "discord.js"
import admin from "firebase-admin"

import { env } from "./env"
import serviceAccountKey from "./serviceAccountKey.json"

admin.initializeApp({
    credential: admin.credential.cert(
        serviceAccountKey as admin.ServiceAccount,
    ),
})

const client = new SapphireClient({
    intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages],
})

// remove unused slash commands and stuff
ApplicationCommandRegistries.setDefaultBehaviorWhenNotIdentical(
    RegisterBehavior.BulkOverwrite,
)

client.login(env.DISCORD_BOT_TOKEN)
