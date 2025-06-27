import { useState, useEffect, useCallback, useRef } from 'react';

interface UseInfiniteScrollOptions<T> {
  fetchData: (page: number) => Promise<T[]>;
  pageSize?: number;
  threshold?: number; // Distance from bottom to trigger load
  initialData?: T[];
}

interface UseInfiniteScrollReturn<T> {
  data: T[];
  loading: boolean;
  error: string | null;
  hasMore: boolean;
  loadMore: () => Promise<void>;
  refresh: () => Promise<void>;
  reset: () => void;
}

export const useInfiniteScroll = <T>({
  fetchData,
  pageSize = 10,
  threshold = 100,
  initialData = []
}: UseInfiniteScrollOptions<T>): UseInfiniteScrollReturn<T> => {
  const [data, setData] = useState<T[]>(initialData);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const [isInitialized, setIsInitialized] = useState(false);

  const abortControllerRef = useRef<AbortController | null>(null);

  const loadData = useCallback(async (pageNumber: number, append: boolean = true) => {
    if (loading || !hasMore) return;

    setLoading(true);
    setError(null);

    // Cancel previous request if it exists
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    // Create new abort controller
    abortControllerRef.current = new AbortController();

    try {
      const newData = await fetchData(pageNumber);
      
      if (newData.length === 0) {
        setHasMore(false);
      } else {
        setData(prevData => append ? [...prevData, ...newData] : newData);
        setPage(pageNumber + 1);
      }
    } catch (err) {
      if (err instanceof Error && err.name !== 'AbortError') {
        setError(err.message);
      }
    } finally {
      setLoading(false);
      setIsInitialized(true);
    }
  }, [fetchData, loading, hasMore]);

  const loadMore = useCallback(async () => {
    if (!loading && hasMore) {
      await loadData(page, true);
    }
  }, [loadData, page, loading, hasMore]);

  const refresh = useCallback(async () => {
    setData([]);
    setPage(1);
    setHasMore(true);
    setError(null);
    await loadData(1, false);
  }, [loadData]);

  const reset = useCallback(() => {
    setData([]);
    setPage(1);
    setHasMore(true);
    setError(null);
    setLoading(false);
    setIsInitialized(false);
    
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
  }, []);

  // Load initial data
  useEffect(() => {
    if (!isInitialized && initialData.length === 0) {
      loadData(1, false);
    }
  }, [isInitialized, initialData.length, loadData]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  return {
    data,
    loading,
    error,
    hasMore,
    loadMore,
    refresh,
    reset
  };
}; 