import React, { useState, useCallback } from 'react';
import { StyleSheet, View } from 'react-native';
import { Item, SwipeAction } from '@/types';
import { colors } from '@/constants/tokens';
import { SwipeCard } from './SwipeCard';

interface SwipeStackProps {
  items: Item[];
  onSwipe: (item: Item, action: SwipeAction) => void;
}

// Background card slots — purely visual, not interactive
function StaticCard({ item, slot }: { item: Item; slot: 'middle' | 'back' }) {
  const isBack = slot === 'back';
  return (
    <View
      style={[
        styles.staticCard,
        isBack ? styles.backCard : styles.middleCard,
      ]}
    >
      {/* Tinted background that peeks behind the front card */}
      <View
        style={[
          StyleSheet.absoluteFill,
          {
            backgroundColor: isBack ? colors.sage : colors.cream,
            borderRadius: 4,
          },
        ]}
      />
    </View>
  );
}

export function SwipeStack({ items, onSwipe }: SwipeStackProps) {
  const [topIdx, setTopIdx] = useState(0);

  const handleSwipeComplete = useCallback(
    (item: Item, action: SwipeAction) => {
      // Notify parent store
      onSwipe(item, action);
      // Advance the queue — the departing card has already animated off-screen
      setTopIdx((i) => i + 1);
    },
    [onSwipe]
  );

  // Guard: no items left
  if (topIdx >= items.length) {
    return (
      <View style={styles.emptyContainer}>
        {/* Empty state — parent screen can handle this */}
      </View>
    );
  }

  const frontItem  = items[topIdx];
  const middleItem = items[topIdx + 1];
  const backItem   = items[topIdx + 2];

  return (
    <View style={styles.container}>
      {/* Back card — lowest z-index, smallest */}
      {backItem && <StaticCard item={backItem} slot="back" />}

      {/* Middle card */}
      {middleItem && <StaticCard item={middleItem} slot="middle" />}

      {/* Front card — gesture-enabled, re-mounts on each advance via key */}
      <SwipeCard
        key={frontItem.id}
        item={frontItem}
        onSwipeComplete={handleSwipeComplete}
        swipedCount={topIdx}
        totalCount={items.length}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
  emptyContainer: {
    flex: 1,
  },
  // Static card positions match the Swoon wireframe (Design B)
  staticCard: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    overflow: 'hidden',
    borderRadius: 4,
  },
  backCard: {
    left: 30,
    right: 30,
    transform: [{ scale: 0.90 }, { translateY: 12 }],
    opacity: 0.5,
  },
  middleCard: {
    left: 22,
    right: 22,
    transform: [{ scale: 0.95 }, { translateY: 6 }],
    opacity: 0.8,
  },
});
