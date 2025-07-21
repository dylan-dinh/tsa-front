export interface User {
    id: string;
    email: string;
    username?: string;
    first_name?: string;
    last_name?: string;
    display_name?: string;
    login?: string;
    twitch_username?: string;
    twitch_id?: string;
    email_verified?: boolean;
    twitch_avatar?: string;
    created_at?: string;
    updated_at?: string;
  }
  
  export interface Streamer {
    id: string;
    name: string;
    url: string;
  }
  
  export interface LoginResponse {
    token: string;
    user: User;
  }
  
  export interface RegisterResponse {
    user: User;
  }

  export interface TwitchLoginResponse {
    message: string;
    token: string;
  }

  export interface Clip {
    ID: number;
    TwitchID?: string;
    BroadcasterID: number;
    BroadcasterName?: string;
    EmbedURL?: string;
    GameID: string;
    Language?: string;
    Title?: string;
    VideoID: number;
    CreatorID: number;
    CreatorName?: string;
    ThumbnailURL?: string;
    URL?: string;
    ViewCount: number;
    Duration: number;
    CreatedAt: string;
    UpdatedAt: string;
  }

  export interface PaginatedClipsResponse {
  clips: Clip[];
  page: number;
  limit: number;
  total: number;
  total_pages: number;
  has_next: boolean;
  has_prev: boolean;
}

export interface ClipsResponse {
  message: string;
  data: PaginatedClipsResponse;
}