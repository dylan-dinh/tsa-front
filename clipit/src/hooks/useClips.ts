import { useState, useEffect, useCallback, useRef } from 'react';
import { Clip } from '../types';
import { getClips } from '../services/api';
import clipsStorage from '../services/clipsStorage';

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
      console.log('useClips: No game IDs, returning empty clips');
      setClips([]);
      setHasMore(false);
      return;
    }

    if (!token) {
      console.log('useClips: No token, returning empty clips');
      setClips([]);
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
      
      // Store in cache
      await clipsStorage.storeClips(paginatedData.clips, gameIds, paginatedData);
      
      setClips(paginatedData.clips);
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

  // Auto-load on mount and when token becomes available
  useEffect(() => {
    console.log('useClips: useEffect triggered', { 
      autoLoad, 
      isInitialized: isInitialized.current, 
      hasToken: !!token 
    });
    if (autoLoad && !isInitialized.current && token) {
      isInitialized.current = true;
      console.log('useClips: Initializing and loading clips');
      loadClips();
    }
  }, [autoLoad, token]); // Include token in dependencies

  // Also trigger load when token becomes available after initialization
  useEffect(() => {
    if (isInitialized.current && token && clips.length === 0) {
      console.log('useClips: Token available but no clips, loading');
      loadClips();
    }
  }, [token, clips.length]); // Watch for token changes and empty clips

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