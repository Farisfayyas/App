import React from 'react';
import { StyleSheet, Text } from 'react-native';
import Animated, { useAnimatedStyle } from 'react-native-reanimated';
import type { SharedValue } from 'react-native-reanimated';
import { colors, fonts } from '@/constants/tokens';

interface SwipeOverlayProps {
  likesOpacity: SharedValue<number>;
  passOpacity: SharedValue<number>;
  cartOpacity: SharedValue<number>;
}

// Animated badge shown on the card face while the user is mid-swipe
export function SwipeOverlay({ likesOpacity, passOpacity, cartOpacity }: SwipeOverlayProps) {
  const likesStyle = useAnimatedStyle(() => ({ opacity: likesOpacity.value }));
  const passStyle  = useAnimatedStyle(() => ({ opacity: passOpacity.value }));
  const cartStyle  = useAnimatedStyle(() => ({ opacity: cartOpacity.value }));

  return (
    <>
      {/* Right swipe — LIKES */}
      <Animated.View style={[styles.badge, styles.likesBadge, likesStyle]}>
        <Text style={[styles.badgeText, { color: '#4caf50' }]}>LIKES</Text>
      </Animated.View>

      {/* Left swipe — PASS */}
      <Animated.View style={[styles.badge, styles.passBadge, passStyle]}>
        <Text style={[styles.badgeText, { color: colors.mute }]}>PASS</Text>
      </Animated.View>

      {/* Up swipe — CART */}
      <Animated.View style={[styles.badge, styles.cartBadge, cartStyle]}>
        <Text style={[styles.badgeText, { color: '#2196f3' }]}>CART</Text>
      </Animated.View>
    </>
  );
}

const styles = StyleSheet.create({
  badge: {
    position: 'absolute',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderWidth: 2,
    borderRadius: 4,
    zIndex: 30,
  },
  badgeText: {
    fontFamily: fonts.sansBold,
    fontSize: 22,
    letterSpacing: 2,
  },
  likesBadge: {
    top: 60,
    left: 24,
    borderColor: '#4caf50',
    transform: [{ rotate: '-15deg' }],
  },
  passBadge: {
    top: 60,
    right: 24,
    borderColor: colors.mute,
    transform: [{ rotate: '15deg' }],
  },
  cartBadge: {
    bottom: 160,
    alignSelf: 'center',
    borderColor: '#2196f3',
  },
});
