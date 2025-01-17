export interface MediaSource {
  name: string;
  urlPatterns: RegExp[];
  getEmbedUrl: (url: string) => string;
}

export const mediaSources: MediaSource[] = [
  {
    name: 'youtube',
    urlPatterns: [
      /^https?:\/\/(www\.)?(youtube\.com|youtu\.be)\/.+/
    ],
    getEmbedUrl: (url: string): string => {
      const videoId = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/))([^&?/]+)/)?.[1];
      return videoId ? `https://www.youtube.com/embed/${videoId}` : url;
    }
  },
  {
    name: 'tiktok',
    urlPatterns: [
      /^https?:\/\/(www\.)?tiktok\.com\/@[\w.-]+\/video\/\d+/
    ],
    getEmbedUrl: (url: string): string => {
      const videoId = url.match(/\/video\/(\d+)/)?.[1];
      return videoId ? `https://www.tiktok.com/embed/${videoId}` : url;
    }
  },
  {
    name: 'twitch',
    urlPatterns: [
      /^https?:\/\/(www\.)?twitch\.tv\/(videos\/\d+|\w+)/
    ],
    getEmbedUrl: (url: string): string => {
      const channelMatch = url.match(/twitch\.tv\/(\w+)$/);
      const videoMatch = url.match(/videos\/(\d+)/);
      if (videoMatch) {
        return `https://player.twitch.tv/?video=${videoMatch[1]}&parent=localhost`;
      }
      if (channelMatch) {
        return `https://player.twitch.tv/?channel=${channelMatch[1]}&parent=localhost`;
      }
      return url;
    }
  },
  {
    name: 'vimeo',
    urlPatterns: [
      /^https?:\/\/(www\.)?vimeo\.com\/\d+/
    ],
    getEmbedUrl: (url: string): string => {
      const videoId = url.match(/vimeo\.com\/(\d+)/)?.[1];
      return videoId ? `https://player.vimeo.com/video/${videoId}` : url;
    }
  }
];