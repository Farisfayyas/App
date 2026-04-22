import { create } from 'zustand';
import { Item, SwipeAction, SwipeRecord, PriceRange, PreferenceProfile } from '@/types';
import { supabase } from '@/services/supabase';

// Derives a price range bucket from a numeric price (EUR)
function getPriceRange(price: number): PriceRange {
  if (price < 100) return 'budget';
  if (price < 300) return 'mid';
  if (price < 800) return 'premium';
  return 'luxury';
}

// Counts occurrences of each value across all records, returns top N
function topN(values: string[], n = 5): string[] {
  const counts: Record<string, number> = {};
  for (const v of values) counts[v] = (counts[v] ?? 0) + 1;
  return Object.entries(counts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, n)
    .map(([k]) => k);
}

interface SwipeStore {
  queue: Item[];
  history: SwipeRecord[];
  sessionId: string;
  // Persists each swipe to Supabase in the background (non-blocking)
  swipe: (item: Item, action: SwipeAction, userId?: string) => void;
  loadQueue: (items: Item[]) => void;
  // Returns a preference profile derived from the full swipe history.
  // The recommendation algorithm will consume this to rank future items.
  getPreferenceProfile: () => PreferenceProfile;
}

export const useSwipeStore = create<SwipeStore>((set, get) => ({
  queue: [],
  history: [],
  sessionId: `session-${Date.now()}-${Math.random().toString(36).slice(2)}`,

  loadQueue: (items) => set({ queue: items }),

  swipe: (item, action, userId) => {
    const record: SwipeRecord = {
      itemId: item.id,
      action,
      timestamp: Date.now(),
      sessionId: get().sessionId,
      itemBrand: item.brand,
      itemCategory: item.category,
      itemPriceRange: getPriceRange(item.price),
      itemStyleTags: item.styleTags,
      itemColors: item.colors,
    };

    set((state) => ({ history: [...state.history, record] }));

    // Fire-and-forget: write to Supabase when authenticated
    if (userId) {
      supabase
        .from('swipes')
        .upsert({
          user_id: userId,
          item_id: item.id,
          action,
          session_id: record.sessionId,
          item_brand: item.brand,
          item_category: item.category,
          item_price_range: record.itemPriceRange,
          item_style_tags: item.styleTags,
          item_colors: item.colors,
        })
        .then(({ error }) => {
          // Silently ignore — offline-first, synced when network is available
          if (error) console.warn('swipe sync error', error.message);
        });
    }
  },

  getPreferenceProfile: () => {
    const history = get().history;
    const liked = history.filter((r) => r.action === 'like' || r.action === 'cart');

    const priceRangeCounts: Record<PriceRange, number> = {
      budget: 0, mid: 0, premium: 0, luxury: 0,
    };
    for (const r of liked) priceRangeCounts[r.itemPriceRange]++;
    const dominantPriceRange = (
      Object.entries(priceRangeCounts).sort((a, b) => b[1] - a[1])[0]?.[0] ?? 'mid'
    ) as PriceRange;

    return {
      topBrands: topN(liked.map((r) => r.itemBrand)),
      topCategories: topN(liked.map((r) => r.itemCategory)),
      topStyleTags: topN(liked.flatMap((r) => r.itemStyleTags)),
      topColors: topN(liked.flatMap((r) => r.itemColors)),
      dominantPriceRange,
      likeRate: history.length > 0 ? liked.length / history.length : 0,
    };
  },
}));
