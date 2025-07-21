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