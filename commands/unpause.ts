import { SlashCommandBuilder, CommandInteraction } from "discord.js";
import { getVoiceConnection } from "@discordjs/voice";

module.exports = {
    data: new SlashCommandBuilder().setName("unpause").setDescription("Continues the current song on the music player."),
    async execute(interaction: CommandInteraction) {
        const connection = getVoiceConnection(interaction.guildId);
        //@ts-ignore
        connection.state.subscription.player.unpause();
        await interaction.reply("Music has been unpaused.");
    },
};
