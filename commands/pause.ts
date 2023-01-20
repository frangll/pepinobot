import { getVoiceConnection } from "@discordjs/voice";
import { SlashCommandBuilder, CommandInteraction } from "discord.js";

module.exports = {
    data: new SlashCommandBuilder().setName("pause").setDescription("Pauses the music player."),
    async execute(interaction: CommandInteraction) {
        const connection = getVoiceConnection(interaction.guildId);
        //@ts-ignore
        connection.state.subscription.player.pause();
        await interaction.reply("Music has been paused.");
    },
};
