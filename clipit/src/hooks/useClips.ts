import { useState, useEffect, useCallback, useRef } from 'react';
import { Clip } from '../types';
import { getClips } from '../services/api';
import clipsStorage from '../services/clipsStorage';

// Shown when the backend has no clips yet so the embed UI is always exercised.
const DEMO_CLIP_BASE = {
  TwitchID: 'QuaintBetterFennelTheTarFu-s0cX0N8h7MCvMIJo',
  URL: 'https://www.twitch.tv/partychip/clip/QuaintBetterFennelTheTarFu-s0cX0N8h7MCvMIJo',
  EmbedURL: 'https://clips.twitch.tv/embed?clip=QuaintBetterFennelTheTarFu-s0cX0N8h7MCvMIJo',
  BroadcasterID: 0,
  BroadcasterName: 'partychip',
  GameID: '509658',
  Title: 'Demo clip — real clips appear once the backend has ingested some',
  VideoID: 0,
  CreatorID: 0,
  ViewCount: 12000,
  Duration: 28,
  CreatedAt: new Date().toISOString(),
  UpdatedAt: new Date().toISOString(),
};

const DEMO_CLIPS: Clip[] = [
  { ...DEMO_CLIP_BASE, ID: -1 },
  { ...DEMO_CLIP_BASE, ID: -2 },
  { ...DEMO_CLIP_BASE, ID: -3 },
];

interface UseClipsOptions {
  gameIds: string[];
  token: string;
  pageSize?: number;
  autoLoad?: boolean;
}

interface UseClipsReturn {
  clips: Clip[];
  loading: boolean;
  loadingMore: boolean;
  error: string | null;
  hasMore: boolean;
  loadClips: () => Promise<void>;
  loadMore: () => Promise<void>;
  refresh: () => Promise<void>;
  clearCache: () => void;
}

export const useClips = ({
  gameIds,
  token,
  pageSize = 100,
  autoLoad = true
}: UseClipsOptions): UseClipsReturn => {
  const [clips, setClips] = useState<Clip[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(false);
  
  const isInitialized = useRef(false);

  // Load initial clips
  const loadClips = useCallback(async () => {
    console.log('useClips: loadClips called', { gameIds: gameIds.length, token: !!token });
    
    if (gameIds.length === 0) {
      console.log('useClips: No game IDs, showing demo clips');
      setClips(DEMO_CLIPS);
      setHasMore(false);
      return;
    }

    if (!token) {
      console.log('useClips: No token, showing demo clips');
      setClips(DEMO_CLIPS);
      setHasMore(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Check if we have valid cached data
      if (await clipsStorage.isCacheValid(gameIds)) {
        console.log('useClips: Using cached clips');
        const cachedClips = await clipsStorage.getClips();
        const metadata = await clipsStorage.getMetadata();
        
        setClips(cachedClips);
        setHasMore(metadata ? metadata.currentPage < metadata.totalPages : false);
        return;
      } else {
        console.log('useClips: Cache invalid or empty, fetching from API');
      }

      // Fetch from API
      console.log('useClips: Making API call with gameIds:', gameIds);
      const response = await getClips(gameIds, token, 1, pageSize);
      const paginatedData = response.data.data;
      
      console.log('useClips: API response received:', {
        clipsCount: paginatedData.clips.length,
        hasNext: paginatedData.has_next,
        page: paginatedData.page
      });
      
      // Debug: Log the first clip to see the full structure
      if (paginatedData.clips.length > 0) {
        console.log('useClips: First clip data:', {
          ID: paginatedData.clips[0].ID,
          Title: paginatedData.clips[0].Title,
          BroadcasterName: paginatedData.clips[0].BroadcasterName,
          EmbedURL: paginatedData.clips[0].EmbedURL,
          ViewCount: paginatedData.clips[0].ViewCount
        });
      }
      
      const clipsToShow = paginatedData.clips.length > 0 ? paginatedData.clips : DEMO_CLIPS;

      // Store in cache
      await clipsStorage.storeClips(clipsToShow, gameIds, paginatedData);
      
      setClips(clipsToShow);
      setHasMore(paginatedData.has_next);
      
      console.log('useClips: Clips loaded and set in state:', paginatedData.clips.length);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load clips';
      setError(errorMessage);
      console.error('Error loading clips:', err);
    } finally {
      setLoading(false);
    }
  }, [gameIds, token, pageSize]);

  // Load more clips (for infinite scroll)
  const loadMore = useCallback(async () => {
    if (!hasMore || loadingMore) return;

    setLoadingMore(true);
    setError(null);

    try {
      const nextPage = await clipsStorage.getNextPage();
      const response = await getClips(gameIds, token, nextPage, pageSize);
      const paginatedData = response.data.data;
      
      // Append to cache
      await clipsStorage.appendClips(paginatedData.clips, paginatedData);
      
      // Update state
      setClips(prevClips => [...prevClips, ...paginatedData.clips]);
      setHasMore(paginatedData.has_next);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load more clips';
      setError(errorMessage);
      console.error('Error loading more clips:', err);
    } finally {
      setLoadingMore(false);
    }
  }, [gameIds, token, pageSize, hasMore, loadingMore]);

  // Refresh clips (clear cache and reload)
  const refresh = useCallback(async () => {
    await clipsStorage.clearClips();
    await loadClips();
  }, [loadClips]);

  // Clear cache
  const clearCache = useCallback(async () => {
    await clipsStorage.clearClips();
    setClips([]);
    setHasMore(false);
  }, []);

  // Auto-load on mount (shows demo clips when no token / no game subs).
  // Re-runs when token arrives so real clips replace the demos.
  useEffect(() => {
    if (!autoLoad) return;
    if (!isInitialized.current) {
      isInitialized.current = true;
      loadClips();
      return;
    }
    // Token became available after initial load — reload with real data.
    if (token) loadClips();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoLoad, token]);

  return {
    clips,
    loading,
    loadingMore,
    error,
    hasMore,
    loadClips,
    loadMore,
    refresh,
    clearCache,
  };
}; 