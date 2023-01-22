import { EmbedBuilder } from "discord.js";
import { secondsToFormat } from "./secondsConverter";
import { guildQueueHandler } from "../controller/queue";

interface EmbedInterface {
    title: string;
    thumbnailUrl: string;
    description: string;
    duration: number;
    guildId: string;
    enableNextSongMessage?: boolean
}

export function createNowPlayingSongEmbed(data: EmbedInterface) {
    const queue = data.enableNextSongMessage ? guildQueueHandler.getSongsFromQueue(data.guildId) : [];

    const embed = new EmbedBuilder()
        .setColor(0x0388fc)
        .setTitle(`Now playing`)
        .setThumbnail(data.thumbnailUrl)
        .addFields(
            { name: "Title", value: data.title },
            { name: "Song duration", value: secondsToFormat(data.duration) }
        )
        .setTimestamp()
    queue.length > 1 ? embed.setFooter({ text: `Next song in queue: ${queue[1].title}` }) : null;

    return embed;
}
