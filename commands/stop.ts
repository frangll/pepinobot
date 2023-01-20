import { SlashCommandBuilder, CommandInteraction } from "discord.js";
import { getVoiceConnection } from "@discordjs/voice";
import { guildQueueHandler } from "../controller/queue";

module.exports = {
    data: new SlashCommandBuilder().setName("stop").setDescription("Stop the music playing"),
    async execute(interaction: CommandInteraction) {
        const connection = getVoiceConnection(interaction.guildId);
        if (connection) {
            //@ts-ignore
            connection.state.subscription.player.stop();
            /* connection.destroy(); */
            guildQueueHandler.clearQueue(interaction.guildId);
            return await interaction.reply("Music player has been stopped, clearing queue.");
        } else await interaction.reply("Music player is not playing right now.");
    },
};
