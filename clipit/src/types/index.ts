export interface User {
    id: string;
    email: string;
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