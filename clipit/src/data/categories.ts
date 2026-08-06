// ClipFlow categories.
// A "category" maps directly to a Twitch game_id — the same id passed to
// GET /api/users/clips?game_id=...  (see services/api.ts getClips()).
// Subscribing to a category = adding its game_id to the user's selected set,
// which is persisted locally (services/preferences.ts) and drives the feed.
//
// game_id values are stable public Twitch directory IDs. `hue` drives the
// ClipFlow gradient placeholder used when a clip has no thumbnail.

export interface Category {
  /** Twitch game_id — passed straight to the clips endpoint */
  game_id: string;
  name: string;
  hue: number;
  group: 'gaming' | 'irl';
}

export const CATEGORIES: Category[] = [
  { game_id: '509658', name: 'Just Chatting', hue: 275, group: 'irl' },
  { game_id: '516575', name: 'VALORANT', hue: 350, group: 'gaming' },
  { game_id: '32399', name: 'Counter-Strike', hue: 34, group: 'gaming' },
  { game_id: '21779', name: 'League of Legends', hue: 212, group: 'gaming' },
  { game_id: '33214', name: 'Fortnite', hue: 248, group: 'gaming' },
  { game_id: '32982', name: 'Grand Theft Auto V', hue: 150, group: 'gaming' },
  { game_id: '27471', name: 'Minecraft', hue: 128, group: 'gaming' },
  { game_id: '29595', name: 'Dota 2', hue: 18, group: 'gaming' },
  { game_id: '512710', name: 'Call of Duty: Warzone', hue: 92, group: 'gaming' },
  { game_id: '511224', name: 'Apex Legends', hue: 2, group: 'gaming' },
  { game_id: '18122', name: 'World of Warcraft', hue: 200, group: 'gaming' },
  { game_id: '515025', name: 'Overwatch 2', hue: 30, group: 'gaming' },
  { game_id: '30921', name: 'Rocket League', hue: 220, group: 'gaming' },
  { game_id: '491487', name: 'Dead by Daylight', hue: 0, group: 'gaming' },
  { game_id: '417752', name: 'Talk Shows & Podcasts', hue: 288, group: 'irl' },
  { game_id: '26936', name: 'Music', hue: 322, group: 'irl' },
  { game_id: '509660', name: 'Art', hue: 168, group: 'irl' },
  { game_id: '509667', name: 'Food & Drink', hue: 44, group: 'irl' },
  { game_id: '509663', name: 'Sports', hue: 108, group: 'irl' },
  { game_id: '509659', name: 'Special Events', hue: 190, group: 'irl' },
];

const BY_ID = new Map(CATEGORIES.map((c) => [c.game_id, c]));

export const getCategory = (gameId: string): Category | undefined => BY_ID.get(gameId);

export const getCategoryName = (gameId: string): string =>
  BY_ID.get(gameId)?.name ?? 'Twitch';

export const getCategoryHue = (gameId: string): number =>
  BY_ID.get(gameId)?.hue ?? 275;

// ClipFlow gradient placeholder for a given hue (used when no thumbnail).
export const gradientFor = (hue: number): string =>
  `linear-gradient(150deg, hsl(${hue} 56% 27%) 0%, hsl(${(hue + 24) % 360} 50% 15%) 55%, hsl(${(hue + 8) % 360} 46% 9%) 100%)`;

export default CATEGORIES;
