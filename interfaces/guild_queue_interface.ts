export interface SongInterface {
     title: string;
     url: string;
}

export interface GuildQueueInterface {
     guildId: string
     queue: {
          songs: SongInterface[]
          volume: number
     }
}