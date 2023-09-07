import { type ChatInputCommand, Command } from "@sapphire/framework"
import type { ChatInputCommandInteraction } from "discord.js"
import { EmbedBuilder } from "discord.js"
import fetch from "node-fetch"

import { setUser } from "../db"

const failEmbed = new EmbedBuilder()
    .setColor("#FF0000")
    .setTitle("Incorrect ID")
    .setDescription("Please state a correct players ID\nNeed help? `/help`")

const successEmbed = new EmbedBuilder()
    .setColor("#00ff00")
    .setTitle("Congrats soldier!")
    .setDescription(
        "You successfully linked your stats to SquadBot!\nYou can now use `/stats` to get your stats!",
    )

export class LinkCommand extends Command {
    public override registerApplicationCommands(
        registry: ChatInputCommand.Registry,
    ) {
        registry.registerChatInputCommand((builder) =>
            builder
                .setName("link")
                .setDescription(
                    "Link your War Brokers Stats to your discord account!",
                )
                .addStringOption((option) =>
                    option
                        .setName("id")
                        .setDescription("Your War Brokers Player ID")
                        .setRequired(true),
                ),
        )
    }

    public async chatInputRun(interaction: ChatInputCommandInteraction) {
        const warbrokersID = interaction.options.getString("id")!

        const res = await fetch(
            `https://stats.warbrokers.io/players/i/${warbrokersID}`,
        )

        // if user does not exist
        if (!res.ok) {
            interaction.reply({
                embeds: [failEmbed],
            })
            return
        }

        setUser(interaction.user.id, warbrokersID)
        interaction.reply({
            embeds: [successEmbed],
        })
    }
}
