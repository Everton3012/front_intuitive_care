const DAY_MS = 24 * 60 * 60 * 1000;
export const CACHE_TTL_30_DAYS = 30 * DAY_MS;

type CacheItem<T> = {
    data: T;
    timestamp: number;
};

export function setCache<T>(key: string, data: T): void {
    const item: CacheItem<T> = {
        data,
        timestamp: Date.now(),
    };
    localStorage.setItem(key, JSON.stringify(item));
}

export function getCache<T>(key: string, ttl: number = CACHE_TTL_30_DAYS): T | null {
    const raw = localStorage.getItem(key);
    if (!raw) return null;

    try {
        const item = JSON.parse(raw) as CacheItem<T>;
        const expired = Date.now() - item.timestamp > ttl;

        if (expired) {
            localStorage.removeItem(key);
            return null;
        }

        return item.data;
    } catch {
        localStorage.removeItem(key);
        return null;
    }
}

export function clearCache(key: string): void {
    localStorage.removeItem(key);
}

export function clearCacheByPrefix(prefix: string): void {
    Object.keys(localStorage).forEach((key) => {
        if (key.startsWith(prefix)) {
            localStorage.removeItem(key);
        }
    });
}

// src/utils/cache.ts

export function clearCachePrefix(prefix: string) {
    const keysToRemove: string[] = [];
  
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith(prefix)) {
        keysToRemove.push(key);
      }
    }
  
    for (const k of keysToRemove) localStorage.removeItem(k);
  }
  
  // atalho só pro projeto
  export function clearIcCache() {
    clearCachePrefix("ic:");
  }
  