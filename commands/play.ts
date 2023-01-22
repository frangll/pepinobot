import { joinVoiceChannel, createAudioPlayer, NoSubscriberBehavior, createAudioResource, getVoiceConnection } from "@discordjs/voice";
import { SlashCommandBuilder, CommandInteraction } from "discord.js";
import { guildQueueHandler } from "../controller/queue";
import play, { InfoData } from "play-dl";
import { checkVideoDuration } from "../utils/videoDurationHandler";
import { createNowPlayingSongEmbed } from "../utils/nowPlayingSongEmbed";
import { secondsToFormat } from "../utils/secondsConverter";
const { max_video_duration_seconds } = require("../config/main.json");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("play")
        .setDescription("Plays music from a given url")
        .addStringOption((option) => option.setName("url").setDescription("Youtube video URL to play from").setRequired(true)),
    async execute(interaction: CommandInteraction) {
        const url = interaction.options.get("url", true);
        const songUrl: any = url.value;
        const guildId = interaction.guildId;
        let songInfo: InfoData;
        const voiceChannelId = interaction.guild?.members?.cache.get(interaction.member!.user.id)?.voice.channelId;

        // Check if the user is in a voice channel
        if (!voiceChannelId) {
            return await interaction.reply("Please join a voice channel first.");
        }

        // Check if there is already a connection
        if (getVoiceConnection(guildId)) {
            return await interaction.reply("There is already a song playing, please use the /skip command if you wish to play the next song, or if you are in a different channel /stop me first.");
        }

        // Check if the video url is valid
        try {
            songInfo = await play.video_info(songUrl);
        } catch (err) {
            return await interaction.reply("That was not a valid url, please try again.");
        }

        // Check if the track duration provided is less or equal than max_video_duration_seconds
        let duration = songInfo.video_details.durationInSec;

        if (checkVideoDuration(duration)) {
            return await interaction.reply(`Provided track length is exceeding the maximum allowed. (Maximum allowed: ${secondsToFormat(max_video_duration_seconds)})`);
        }

        const songEmbed = createNowPlayingSongEmbed({
            description: songInfo.video_details.description,
            duration: songInfo.video_details.durationInSec,
            thumbnailUrl: songInfo.video_details.thumbnails[0].url,
            title: songInfo.video_details.title,
            guildId: interaction.guildId,
        })

        // Channel connection information
        const connection = joinVoiceChannel({
            channelId: interaction.guild?.members?.cache.get(interaction.member!.user.id)?.voice.channelId!,
            guildId: guildId,
            adapterCreator: interaction.guild!.voiceAdapterCreator,
        });

        const audioPlayer = createAudioPlayer({
            behaviors: {
                noSubscriber: NoSubscriberBehavior.Play,
            },
        });

        const subscription = connection.subscribe(audioPlayer);
        const player = subscription.player;

        // Creating the player with subscription
        async function createPlayer(url: string) {
            const song = await play.stream(url);
            const audio = createAudioResource(song.stream, {
                inputType: song.type,
            });
            player.play(audio);
        }

        // Only the first time this gets called
        createPlayer(songUrl);

        guildQueueHandler.addSongToQueue(guildId, {
            title: songInfo.video_details.title,
            url: songInfo.video_details.url,
            thumbnail: songInfo.video_details.thumbnails[0].url,
            description: songInfo.video_details.description,
            duration: songInfo.video_details.durationInSec,
        });

        player.on("stateChange", async (oldState, newState) => {
            if (newState.status === "idle") {
                guildQueueHandler.removeFirstSongFromQueue(guildId);
                const songList = guildQueueHandler.getSongsFromQueue(guildId);
                if (songList.length < 1) {
                    //player.stop();
                    connection.destroy(); // Leave the voice channel
                    return await interaction.channel.send("Song queue is now empty, leaving voice channel.");
                }
                const nextSong = songList[0];

                // Generate the embed
                const nextSongEmbed = createNowPlayingSongEmbed({
                    description: nextSong.description,
                    duration: nextSong.duration,
                    thumbnailUrl: nextSong.thumbnail,
                    title: nextSong.title,
                    guildId: interaction.guildId,
                    enableNextSongMessage: true
                })

                // Create the player
                createPlayer(nextSong.url);
                await interaction.channel.send({ embeds: [nextSongEmbed] });
            }
        });

        await interaction.reply({ embeds: [songEmbed] });
    },
};
