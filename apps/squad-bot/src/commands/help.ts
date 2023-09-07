import { type ChatInputCommand, Command } from "@sapphire/framework"
import type { ChatInputCommandInteraction } from "discord.js"
import {
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    EmbedBuilder,
} from "discord.js"

export class HelpCommand extends Command {
    public override registerApplicationCommands(
        registry: ChatInputCommand.Registry,
    ) {
        registry.registerChatInputCommand((builder) =>
            builder.setName("help").setDescription("Show helpful information"),
        )
    }

    public async chatInputRun(interaction: ChatInputCommandInteraction) {
        interaction.reply({
            embeds: [
                new EmbedBuilder()
                    .setColor("#00FF00")
                    .setTitle("How to use SquadBot")
                    .addFields(
                        {
                            name: "What commands can I use?",
                            value: "Press the slash (`/`) key then select SquadBot to see all available commands.",
                        },
                        {
                            name: "Link your stats!",
                            value: "To use the `/stats` command, you first have to link your stats to SquadBot by calling the `/link` command. You only need to do this once.",
                        },
                    )
                    .setImage(
                        "https://cdn.discordapp.com/attachments/925824717808623660/941249359968866304/linkstats-example.png",
                    ),
            ],
            components: [
                new ActionRowBuilder<ButtonBuilder>().addComponents(
                    new ButtonBuilder()
                        .setLabel("Support")
                        .setURL("https://discord.gg/BzbBfAz9gX")
                        .setStyle(ButtonStyle.Link),
                    new ButtonBuilder()
                        .setLabel("Invite")
                        .setURL(
                            "https://discord.com/api/oauth2/authorize?client_id=725779812412817429&permissions=414464658432&scope=bot%20applications.commands",
                        )
                        .setStyle(ButtonStyle.Link),
                ),
            ],
        })
    }
}
