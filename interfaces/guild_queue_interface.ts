export interface SongInterface {
     title: string;
     url: string;
     duration: number;
     thumbnail: string;
     description: string;
}

export interface GuildQueueInterface {
     guildId: string
     queue: {
          songs: SongInterface[]
          volume: number
     }
}