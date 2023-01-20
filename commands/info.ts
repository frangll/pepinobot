import { SlashCommandBuilder, CommandInteraction } from "discord.js";
const { version } = require("../config/main.json");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("info")
        .setDescription("Shows the bot informations available.")
        .addStringOption((option) => option.setName("argument").setDescription("r")),
    async execute(interaction: CommandInteraction) {
        const arg = interaction.options.get("argument");
        if (arg && arg.value === "revy") {
            return await interaction.reply("akrushridge");
        }

        await interaction.reply(`Current version: ${version}`);
    },
};
