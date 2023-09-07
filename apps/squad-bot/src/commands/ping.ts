import { type ChatInputCommand, Command } from "@sapphire/framework"
import type { ChatInputCommandInteraction } from "discord.js"

export class PingCommand extends Command {
    public override registerApplicationCommands(
        registry: ChatInputCommand.Registry,
    ) {
        registry.registerChatInputCommand((builder) =>
            builder
                .setName("ping")
                .setDescription("Play ping pong with the bot"),
        )
    }

    public async chatInputRun(interaction: ChatInputCommandInteraction) {
        interaction.reply({
            content: "pong 🏓!",
            ephemeral: true,
        })
    }
}
