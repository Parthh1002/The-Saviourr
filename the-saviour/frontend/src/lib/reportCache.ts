// In-memory cache for bridging data between the Report Generation API and the Puppeteer rendering page.
// In a real enterprise system, this would be Redis.

const cache = new Map<string, any>();

export const reportCache = {
  set: (id: string, data: any) => {
    cache.set(id, data);
    // Auto-expire after 5 minutes
    setTimeout(() => cache.delete(id), 5 * 60 * 1000);
  },
  get: (id: string) => cache.get(id),
  delete: (id: string) => cache.delete(id)
};
