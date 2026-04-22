import React, { useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
} from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { Item, SwipeAction } from '@/types';
import { colors, fonts, TAB_BAR_HEIGHT, STATUS_BAR_HEIGHT } from '@/constants/tokens';
import { MOCK_ITEMS } from '@/constants/mockData';
import { useSwipeStore } from '@/store/useSwipeStore';
import { useCartStore } from '@/store/useCartStore';
import { SwipeStack } from '@/components/swipe/SwipeStack';

const PROGRESS_TOTAL = 8;

export default function HomeScreen() {
  const swipe      = useSwipeStore((s) => s.swipe);
  const history    = useSwipeStore((s) => s.history);
  const addToCart  = useCartStore((s) => s.addToCart);
  const addToLikes = useCartStore((s) => s.addToLikes);

  const swipedCount = history.length;

  // Record swipe action and mirror it into cart/likes stores
  const handleSwipe = useCallback(
    (item: Item, action: SwipeAction) => {
      swipe(item, action);
      if (action === 'like') {
        addToLikes(item);
      } else if (action === 'cart') {
        // Default to first available size when adding directly from the swipe feed
        addToCart(item, item.sizes[0] ?? 'M');
      }
    },
    [swipe, addToLikes, addToCart]
  );

  const filledDots = Math.min(swipedCount % PROGRESS_TOTAL, PROGRESS_TOTAL);

  return (
    <View style={styles.screen}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.paper} />

      {/* ── Minimal header ─────────────────────────────────────── */}
      <View style={styles.header}>
        <Text style={styles.headerLabel}>{`Today · ${MOCK_ITEMS.length} picks`}</Text>
        <Svg width={16} height={16} viewBox="0 0 24 24" fill="none">
          <Path
            d="M4 6h16M7 12h10M10 18h4"
            stroke={colors.mute}
            strokeWidth={1.4}
            strokeLinecap="round"
          />
        </Svg>
      </View>

      {/* ── Swipe progress dots ────────────────────────────────── */}
      <View style={styles.progressRow}>
        {Array.from({ length: PROGRESS_TOTAL }).map((_, i) => (
          <View
            key={i}
            style={[styles.progressDot, i < filledDots && styles.progressDotFilled]}
          />
        ))}
      </View>

      {/* ── Card stack (fills the screen between header and tab bar) */}
      <View style={styles.stackContainer}>
        <SwipeStack items={MOCK_ITEMS} onSwipe={handleSwipe} />
      </View>

      {/* ── Bottom hint (sits just above the tab bar) ──────────── */}
      <View style={styles.bottomHint}>
        <Text style={styles.gestureHint}>Gesture to choose</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.paper,
  },
  header: {
    position: 'absolute',
    top: STATUS_BAR_HEIGHT,
    left: 0,
    right: 0,
    zIndex: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 16,
  },
  headerLabel: {
    fontFamily: fonts.monoRegular,
    fontSize: 10,
    letterSpacing: 1.4,
    color: colors.mute,
    textTransform: 'uppercase',
  },
  progressRow: {
    position: 'absolute',
    top: STATUS_BAR_HEIGHT + 48,
    left: 24,
    right: 24,
    flexDirection: 'row',
    gap: 3,
    zIndex: 20,
  },
  progressDot: {
    flex: 1,
    height: 1.5,
    backgroundColor: colors.line,
    borderRadius: 1,
  },
  progressDotFilled: {
    backgroundColor: colors.ink,
  },
  stackContainer: {
    position: 'absolute',
    top: STATUS_BAR_HEIGHT + 60,
    left: 14,
    right: 14,
    bottom: TAB_BAR_HEIGHT + 48,
  },
  bottomHint: {
    position: 'absolute',
    bottom: TAB_BAR_HEIGHT + 12,
    left: 24,
    right: 24,
  },
  gestureHint: {
    fontFamily: fonts.monoRegular,
    fontSize: 9,
    letterSpacing: 1.4,
    color: colors.mute,
    textTransform: 'uppercase',
  },
});
