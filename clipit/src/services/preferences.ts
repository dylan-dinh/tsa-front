import storage from './storage';
import { getUserGames, subscribeToGame, unsubscribeFromGame } from './api';

const SUBS_KEY = 'tsa_subscribed_games';
const SAVED_KEY = 'tsa_saved_clips';
const VOTES_KEY = 'tsa_clip_votes';

async function readJson<T>(key: string, fallback: T): Promise<T> {
  try {
    const raw = await storage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

async function writeJson(key: string, value: unknown): Promise<void> {
  try {
    await storage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error('preferences: failed to write', key, e);
  }
}

/* ---- Subscribed categories (game_ids) ---- */

export async function getSubscribedGames(): Promise<string[]> {
  return readJson<string[]>(SUBS_KEY, []);
}

export async function setSubscribedGames(gameIds: string[]): Promise<void> {
  await writeJson(SUBS_KEY, Array.from(new Set(gameIds)));
}

export async function toggleSubscribedGame(
  gameId: string,
  meta?: { name?: string; box_art_url?: string },
): Promise<string[]> {
  const current = await getSubscribedGames();
  const isSubscribed = current.includes(gameId);
  const next = isSubscribed ? current.filter((id) => id !== gameId) : [...current, gameId];
  await setSubscribedGames(next);

  // Fire-and-forget backend sync when the user is authenticated.
  const token = await storage.getItem('token');
  if (token) {
    if (isSubscribed) {
      unsubscribeFromGame(gameId).catch(() => {});
    } else {
      subscribeToGame(gameId, meta).catch(() => {});
    }
  }

  return next;
}

/**
 * Pull the authoritative subscription list from the backend and write it to
 * local storage. Call this on Discover mount when a token is available so the
 * local cache stays in sync across sessions / devices.
 */
export async function syncSubscriptionsFromBackend(): Promise<string[]> {
  try {
    const token = await storage.getItem('token');
    if (!token) return getSubscribedGames();
    const resp = await getUserGames();
    const ids = resp.data.games.map((g) => g.twitch_id);
    await writeJson(SUBS_KEY, Array.from(new Set(ids)));
    return ids;
  } catch {
    return getSubscribedGames();
  }
}

/* ---- Saved clips ---- */

export async function getSavedClipIds(): Promise<string[]> {
  return readJson<string[]>(SAVED_KEY, []);
}

export async function toggleSavedClip(clipId: string): Promise<string[]> {
  const current = await getSavedClipIds();
  const next = current.includes(clipId)
    ? current.filter((id) => id !== clipId)
    : [...current, clipId];
  await writeJson(SAVED_KEY, next);
  return next;
}

/* ---- Votes ---- */

export type Vote = 'up' | 'down' | null;

export async function getVotes(): Promise<Record<string, Vote>> {
  return readJson<Record<string, Vote>>(VOTES_KEY, {});
}

export async function setVote(clipId: string, vote: Vote): Promise<Record<string, Vote>> {
  const votes = await getVotes();
  if (vote === null) delete votes[clipId];
  else votes[clipId] = vote;
  await writeJson(VOTES_KEY, votes);
  return votes;
}

export default {
  getSubscribedGames,
  setSubscribedGames,
  toggleSubscribedGame,
  syncSubscriptionsFromBackend,
  getSavedClipIds,
  toggleSavedClip,
  getVotes,
  setVote,
};
