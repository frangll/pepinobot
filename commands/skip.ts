import { SlashCommandBuilder, CommandInteraction } from "discord.js";
import { createAudioResource, getVoiceConnection } from "@discordjs/voice";
import { guildQueueHandler } from "../controller/queue";
import play from "play-dl";
import { createNowPlayingSongEmbed } from "../utils/nowPlayingSongEmbed";

module.exports = {
    data: new SlashCommandBuilder().setName("skip").setDescription("Skips the current song playing"),
    async execute(interaction: CommandInteraction) {
        const connection = getVoiceConnection(interaction.guildId);
        guildQueueHandler.removeFirstSongFromQueue(interaction.guildId);

        if (guildQueueHandler.getSongsFromQueue(interaction.guildId).length > 0) {
            const nextSong = guildQueueHandler.getSongsFromQueue(interaction.guildId)[0];

            const nextSongEmbed = createNowPlayingSongEmbed({
                description: nextSong.description,
                duration: nextSong.duration,
                thumbnailUrl: nextSong.thumbnail,
                title: nextSong.title,
                guildId: interaction.guildId,
                enableNextSongMessage: true
            });

            const song = await play.stream(nextSong.url);
            const audio = createAudioResource(song.stream, {
                inputType: song.type,
            });

            //@ts-ignore
            connection.state.subscription.player.play(audio);
            return await interaction.reply({ embeds: [nextSongEmbed] });
        }

        // @ts-ignore
        connection.state.subscription.player.stop();
        await interaction.reply("Queue is empty, nothing to skip to.");
    },
};
