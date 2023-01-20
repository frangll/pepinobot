import { GuildQueueInterface, SongInterface } from "../interfaces/guild_queue_interface";

class QueueHandler {
    guilds: GuildQueueInterface[];

    constructor() {
        this.guilds = [];
    }

    // Util
    private findQueueFromGuildId(guildId: string) {
        const guild = this.guilds.find((g) => g.guildId === guildId);
        return guild;
    }

    private sendErrorToMessage() {
        return console.log("[Error]: Could not find guild in guild queue");
    }

    private createGuildQueueWithConfig(guildId: string) {
        this.guilds.push({
            guildId: guildId,
            queue: {
                songs: [],
                volume: 5,
            },
        });
    }

    // Methods
    removeFirstSongFromQueue(guildId: string) {
        const guild = this.findQueueFromGuildId(guildId);
        if (!guild) return this.sendErrorToMessage();
        guild.queue.songs.shift();
    }

    addSongToQueue(guildId: string, songObject: SongInterface) {
        const guild = this.findQueueFromGuildId(guildId);
        if (!guild) {
            this.createGuildQueueWithConfig(guildId);
            this.findQueueFromGuildId(guildId).queue.songs.push(songObject);
        } else {
            guild.queue.songs.push(songObject);
        }
    }

    getSongsFromQueue(guildId: string): SongInterface[] {
        const guild = this.findQueueFromGuildId(guildId);
        if (!guild) {
            this.sendErrorToMessage();
            return [];
        }
        return guild.queue.songs;
    }

    clearQueue(guildId: string) {
        const guild = this.findQueueFromGuildId(guildId);
        if (!guild) return this.sendErrorToMessage();

        guild.queue.songs = [];
    }
}

const guildQueueHandler = new QueueHandler();

export { guildQueueHandler };
