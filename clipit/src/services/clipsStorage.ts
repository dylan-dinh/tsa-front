import { Clip, PaginatedClipsResponse } from '../types';
import storage from './storage';

const CLIPS_STORAGE_KEY = 'tsa_clips_cache';
const CLIPS_METADATA_KEY = 'tsa_clips_metadata';
const CACHE_EXPIRY_KEY = 'tsa_clips_cache_expiry';
const CACHE_DURATION = 30 * 60 * 1000; // 30 minutes

interface ClipsMetadata {
  lastFetched: number;
  totalClips: number;
  totalPages: number;
  currentPage: number;
  gameIds: string[];
}

export class ClipsStorageService {
  private static instance: ClipsStorageService;

  private constructor() {}

  static getInstance(): ClipsStorageService {
    if (!ClipsStorageService.instance) {
      ClipsStorageService.instance = new ClipsStorageService();
    }
    return ClipsStorageService.instance;
  }

  // Store clips in local storage
  async storeClips(clips: Clip[], gameIds: string[], paginationData: PaginatedClipsResponse): Promise<void> {
    try {
      // Store clips
      await storage.setItem(CLIPS_STORAGE_KEY, JSON.stringify(clips));
      
      // Store metadata
      const metadata: ClipsMetadata = {
        lastFetched: Date.now(),
        totalClips: paginationData.total,
        totalPages: paginationData.total_pages,
        currentPage: paginationData.page,
        gameIds: gameIds,
      };
      await storage.setItem(CLIPS_METADATA_KEY, JSON.stringify(metadata));
      
      // Store cache expiry
      await storage.setItem(CACHE_EXPIRY_KEY, (Date.now() + CACHE_DURATION).toString());
    } catch (error) {
      console.error('Failed to store clips in storage:', error);
    }
  }

  // Append clips to existing storage (for pagination)
  async appendClips(newClips: Clip[], paginationData: PaginatedClipsResponse): Promise<void> {
    try {
      const existingClips = await this.getClips();
      const allClips = [...existingClips, ...newClips];
      
      // Store updated clips
      await storage.setItem(CLIPS_STORAGE_KEY, JSON.stringify(allClips));
      
      // Update metadata
      const metadata = await this.getMetadata();
      if (metadata) {
        metadata.currentPage = paginationData.page;
        metadata.totalClips = paginationData.total;
        metadata.totalPages = paginationData.total_pages;
        await storage.setItem(CLIPS_METADATA_KEY, JSON.stringify(metadata));
      }
    } catch (error) {
      console.error('Failed to append clips to storage:', error);
    }
  }

  // Get clips from local storage
  async getClips(): Promise<Clip[]> {
    try {
      const clipsData = await storage.getItem(CLIPS_STORAGE_KEY);
      return clipsData ? JSON.parse(clipsData) : [];
    } catch (error) {
      console.error('Failed to get clips from storage:', error);
      return [];
    }
  }

  // Get metadata from local storage
  async getMetadata(): Promise<ClipsMetadata | null> {
    try {
      const metadataData = await storage.getItem(CLIPS_METADATA_KEY);
      return metadataData ? JSON.parse(metadataData) : null;
    } catch (error) {
      console.error('Failed to get metadata from storage:', error);
      return null;
    }
  }

  // Check if cache is valid
  async isCacheValid(gameIds: string[]): Promise<boolean> {
    try {
      const metadata = await this.getMetadata();
      if (!metadata) {
        console.log('clipsStorage: No metadata found, cache invalid');
        return false;
      }

      // Check if cache has expired
      const expiryTime = await storage.getItem(CACHE_EXPIRY_KEY);
      if (!expiryTime || Date.now() > parseInt(expiryTime)) {
        console.log('clipsStorage: Cache expired or no expiry time');
        return false;
      }

      // Check if game IDs match
      if (metadata.gameIds.length !== gameIds.length) {
        console.log('clipsStorage: Game IDs count mismatch');
        return false;
      }
      const gameIdsMatch = metadata.gameIds.every((id: string, index: number) => id === gameIds[index]);
      if (!gameIdsMatch) {
        console.log('clipsStorage: Game IDs don\'t match');
        return false;
      }

      console.log('clipsStorage: Cache is valid');
      return true;
    } catch (error) {
      console.error('Failed to check cache validity:', error);
      return false;
    }
  }

  // Clear all clips data
  async clearClips(): Promise<void> {
    try {
      await storage.removeItem(CLIPS_STORAGE_KEY);
      await storage.removeItem(CLIPS_METADATA_KEY);
      await storage.removeItem(CACHE_EXPIRY_KEY);
    } catch (error) {
      console.error('Failed to clear clips from storage:', error);
    }
  }

  // Get clips for a specific page range (for infinite scroll)
  async getClipsForPage(page: number, limit: number): Promise<Clip[]> {
    const allClips = await this.getClips();
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    return allClips.slice(startIndex, endIndex);
  }

  // Check if we have more clips to load
  async hasMoreClips(): Promise<boolean> {
    const metadata = await this.getMetadata();
    if (!metadata) return false;
    return metadata.currentPage < metadata.totalPages;
  }

  // Get next page number
  async getNextPage(): Promise<number> {
    const metadata = await this.getMetadata();
    return metadata ? metadata.currentPage + 1 : 1;
  }
}

export default ClipsStorageService.getInstance(); 