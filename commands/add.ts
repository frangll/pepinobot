import { SlashCommandBuilder, CommandInteraction } from "discord.js";
import { guildQueueHandler } from "../controller/queue";
import { InfoData, video_basic_info } from "play-dl";
import { getVoiceConnection } from "@discordjs/voice";
import { checkVideoDuration } from "../utils/videoDurationHandler";
import { secondsToFormat } from "../utils/secondsConverter";
const { max_video_duration_seconds } = require("../config/main.json");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("add")
        .setDescription("Shows the queue of the music player.")
        .addStringOption((option) => option.setName("songurl").setDescription("The URL of the song to be played").setRequired(true)),
    async execute(interaction: CommandInteraction) {
        const url = interaction.options.get("songurl", true);
        const songUrl: any = url.value;
        const guildId = interaction.guildId;
        let info: InfoData;

        if (!getVoiceConnection(guildId)) {
            return await interaction.reply("No active session found, please join a voice channel and use the `/play [url]` command.");
        }

        try {
            info = await video_basic_info(songUrl);
        } catch (err) {
            return await interaction.reply("That was not a valid url, please try again.");
        }

        // Check if the track duration provided is less or equal than max_video_duration_seconds
        let duration = info.video_details.durationInSec;

        if (checkVideoDuration(duration)) {
            return await interaction.reply(`Provided track length is exceeding the maximum allowed. (Maximum allowed: ${secondsToFormat(max_video_duration_seconds)})`);
        }

        // Add the song to the queue
        guildQueueHandler.addSongToQueue(guildId, {
            title: info.video_details.title,
            url: songUrl,
            thumbnail: info.video_details.thumbnails[0].url,
            description: info.video_details.description,
            duration: info.video_details.durationInSec,
        });

        await interaction.reply(`Song: ${info.video_details.title} has been added to the queue.`);
    },
};
