import { ApplyOptions } from "@sapphire/decorators"
import { Events, Listener } from "@sapphire/framework"
import type { Client } from "discord.js"

@ApplyOptions<Listener.Options>({ once: true, event: Events.ClientReady })
export class ReadyListener extends Listener<typeof Events.ClientReady> {
    public async run(client: Client) {
        this.container.logger.info(`${client?.user?.tag} is up and running!`)

        client.user?.setActivity("War Brokers")
    }
}
