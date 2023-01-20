import { SlashCommandBuilder, CommandInteraction } from "discord.js";
import { guildQueueHandler } from "../controller/queue";

module.exports = {
    data: new SlashCommandBuilder().setName("queue").setDescription("Shows the queue of the music player."),
    async execute(interaction: CommandInteraction) {
        const songList = guildQueueHandler.getSongsFromQueue(interaction.guildId);
        let songlist = "";

        if (songList.length < 1) {
            return await interaction.reply("No queue available.");
        }

        for (let i = 0; i < songList.length; i++) {
            songlist += `${i + 1}. ` + songList[i].title + "\n";
        }
        await interaction.reply(songlist);
    },
};
