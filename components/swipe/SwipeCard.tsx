import React, { useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Dimensions,
  Share,
  Pressable,
} from 'react-native';
import { Image } from 'expo-image';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  runOnJS,
} from 'react-native-reanimated';
import Svg, { Path } from 'react-native-svg';
import { Item, SwipeAction } from '@/types';
import { colors, fonts } from '@/constants/tokens';
import { SwipeOverlay } from './SwipeOverlay';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const SWIPE_THRESHOLD = 100;
const VELOCITY_THRESHOLD = 500;

interface SwipeCardProps {
  item: Item;
  onSwipeComplete: (item: Item, action: SwipeAction) => void;
  swipedCount: number;
  totalCount: number;
}

export function SwipeCard({ item, onSwipeComplete, swipedCount, totalCount }: SwipeCardProps) {
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  // Entrance animation: card steps up from middle-slot position on mount
  const entranceScale = useSharedValue(0.95);
  const entranceTranslateY = useSharedValue(6);

  const likesOpacity = useSharedValue(0);
  const passOpacity  = useSharedValue(0);
  const cartOpacity  = useSharedValue(0);

  // Step up to front-slot position on mount (feels like the stack is advancing)
  useEffect(() => {
    entranceScale.value = withSpring(1.0, { damping: 20 });
    entranceTranslateY.value = withSpring(0, { damping: 20 });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const resetOverlays = () => {
    likesOpacity.value = withTiming(0, { duration: 150 });
    passOpacity.value  = withTiming(0, { duration: 150 });
    cartOpacity.value  = withTiming(0, { duration: 150 });
  };

  const handleSwipe = (action: SwipeAction) => {
    onSwipeComplete(item, action);
  };

  const pan = Gesture.Pan()
    .onUpdate((e) => {
      translateX.value = e.translationX;
      translateY.value = e.translationY;

      const absX = Math.abs(e.translationX);
      const absY = Math.abs(e.translationY);

      if (absX > absY) {
        likesOpacity.value = Math.max(0, Math.min(1, e.translationX / SWIPE_THRESHOLD));
        passOpacity.value  = Math.max(0, Math.min(1, -e.translationX / SWIPE_THRESHOLD));
        cartOpacity.value  = 0;
      } else if (e.translationY < 0) {
        cartOpacity.value  = Math.max(0, Math.min(1, -e.translationY / SWIPE_THRESHOLD));
        likesOpacity.value = 0;
        passOpacity.value  = 0;
      } else {
        likesOpacity.value = 0;
        passOpacity.value  = 0;
        cartOpacity.value  = 0;
      }
    })
    .onEnd((e) => {
      const goRight = e.translationX > SWIPE_THRESHOLD || e.velocityX > VELOCITY_THRESHOLD;
      const goLeft  = e.translationX < -SWIPE_THRESHOLD || e.velocityX < -VELOCITY_THRESHOLD;
      const goUp    = e.translationY < -SWIPE_THRESHOLD || e.velocityY < -VELOCITY_THRESHOLD;

      if (goRight) {
        translateX.value = withSpring(SCREEN_WIDTH * 1.5, { velocity: e.velocityX }, () => {
          runOnJS(handleSwipe)('like');
        });
      } else if (goLeft) {
        translateX.value = withSpring(-SCREEN_WIDTH * 1.5, { velocity: e.velocityX }, () => {
          runOnJS(handleSwipe)('dislike');
        });
      } else if (goUp) {
        translateY.value = withSpring(-SCREEN_HEIGHT, { velocity: e.velocityY }, () => {
          runOnJS(handleSwipe)('cart');
        });
      } else {
        translateX.value = withSpring(0);
        translateY.value = withSpring(0);
        runOnJS(resetOverlays)();
      }
    });

  const cardStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      // Combine gesture translateY with the entrance animation offset
      { translateY: translateY.value + entranceTranslateY.value },
      { scale: entranceScale.value },
      { rotate: `${(translateX.value / SCREEN_WIDTH) * 12}deg` },
    ],
  }));

  const handleShare = async () => {
    await Share.share({
      message: `${item.name} by ${item.brand} — ${item.currency} ${item.price}\n${item.shopUrl ?? ''}`,
      title: item.name,
    });
  };

  return (
    <GestureDetector gesture={pan}>
      <Animated.View style={[styles.card, cardStyle]}>
        {/* Product image (or solid tone background for mock) */}
        <Image
          source={{ uri: item.images[0] }}
          style={StyleSheet.absoluteFill}
          contentFit="cover"
          transition={200}
        />

        {/* Directional hint — left edge: PASS */}
        <View style={styles.hintLeft}>
          <Svg width={14} height={14} viewBox="0 0 24 24" fill="none">
            <Path d="M15 6l-6 6 6 6" stroke={colors.white} strokeWidth={1.4} strokeLinecap="round" strokeLinejoin="round" />
          </Svg>
          <Text style={[styles.hintText, { writingDirection: 'ltr' }]}>{'PASS'}</Text>
        </View>

        {/* Directional hint — right edge: LIKES */}
        <View style={styles.hintRight}>
          <Svg width={14} height={14} viewBox="0 0 24 24" fill="none">
            <Path d="M9 6l6 6-6 6" stroke={colors.white} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" />
          </Svg>
          <Text style={styles.hintText}>{'LIKES'}</Text>
        </View>

        {/* Top chrome: brand + counter */}
        <View style={styles.topBar}>
          <Text style={styles.brandMark}>{`— ${item.brand}`}</Text>
          <Text style={styles.counter}>{`${swipedCount + 1}/${totalCount}`}</Text>
        </View>

        {/* Bottom gradient overlay with item info */}
        <View style={styles.bottomGradient}>
          {/* Up-swipe cart hint */}
          <View style={styles.cartHint}>
            <Svg width={10} height={10} viewBox="0 0 24 24" fill="none">
              <Path d="M6 15l6-6 6 6" stroke={colors.white} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" />
            </Svg>
            <Text style={styles.cartHintText}>SWIPE UP · ADD TO CART</Text>
          </View>

          <View style={styles.itemInfoRow}>
            <View style={styles.itemInfoLeft}>
              <Text style={styles.itemName}>{item.name}</Text>
              <Text style={styles.itemMeta}>
                {item.colors.slice(0, 2).join(' · ')}
                {item.sizes.length > 0 ? ` · ${item.sizes.slice(0, 4).join(' ')}` : ''}
              </Text>
            </View>
            <Text style={styles.price}>{`${item.currency} ${item.price}`}</Text>
          </View>
        </View>

        {/* Swipe direction overlays (LIKES / PASS / CART badges) */}
        <SwipeOverlay
          likesOpacity={likesOpacity}
          passOpacity={passOpacity}
          cartOpacity={cartOpacity}
        />

        {/* Share button */}
        <Pressable style={styles.shareBtn} onPress={handleShare} hitSlop={12}>
          <Svg width={16} height={16} viewBox="0 0 24 24" fill="none">
            <Path d="M8 11L16 7M8 13L16 17" stroke={colors.white} strokeWidth={1.5} strokeLinecap="round" />
            <Path d="M18 6a2 2 0 1 0 0-4 2 2 0 0 0 0 4z" stroke={colors.white} strokeWidth={1.5} />
            <Path d="M18 22a2 2 0 1 0 0-4 2 2 0 0 0 0 4z" stroke={colors.white} strokeWidth={1.5} />
            <Path d="M6 14a2 2 0 1 0 0-4 2 2 0 0 0 0 4z" stroke={colors.white} strokeWidth={1.5} />
          </Svg>
        </Pressable>
      </Animated.View>
    </GestureDetector>
  );
}

const styles = StyleSheet.create({
  card: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 4,
    overflow: 'hidden',
    backgroundColor: colors.cream,
  },
  topBar: {
    position: 'absolute',
    top: 16,
    left: 18,
    right: 18,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    zIndex: 20,
  },
  brandMark: {
    fontFamily: fonts.monoRegular,
    fontSize: 10,
    letterSpacing: 1.8,
    color: colors.white,
    textTransform: 'uppercase',
  },
  counter: {
    fontFamily: fonts.monoRegular,
    fontSize: 11,
    color: colors.white,
    opacity: 0.7,
  },
  hintLeft: {
    position: 'absolute',
    left: 14,
    top: '50%',
    marginTop: -30,
    alignItems: 'center',
    gap: 4,
    opacity: 0.7,
    zIndex: 20,
  },
  hintRight: {
    position: 'absolute',
    right: 14,
    top: '50%',
    marginTop: -30,
    alignItems: 'center',
    gap: 4,
    zIndex: 20,
  },
  hintText: {
    fontFamily: fonts.monoRegular,
    fontSize: 8,
    letterSpacing: 1.4,
    color: colors.white,
    textTransform: 'uppercase',
    // Simulate vertical text by stacking individual letters is complex;
    // we render horizontally here and the design's rotated label is advisory only.
  },
  bottomGradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: 20,
    // Simulate gradient with a solid overlay (expo-linear-gradient can be added for polish)
    backgroundColor: 'rgba(0,0,0,0.45)',
    zIndex: 10,
  },
  cartHint: {
    position: 'absolute',
    top: 14,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 4,
    opacity: 0.85,
  },
  cartHintText: {
    fontFamily: fonts.monoRegular,
    fontSize: 8,
    letterSpacing: 1.4,
    color: colors.white,
    textTransform: 'uppercase',
  },
  itemInfoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  itemInfoLeft: {
    flex: 1,
    marginRight: 12,
  },
  itemName: {
    fontFamily: fonts.serifItalic,
    fontSize: 22,
    fontWeight: '400',
    letterSpacing: -0.3,
    color: colors.white,
  },
  itemMeta: {
    fontFamily: fonts.sansRegular,
    fontSize: 11,
    color: colors.white,
    opacity: 0.85,
    marginTop: 4,
  },
  price: {
    fontFamily: fonts.serifMedium,
    fontSize: 22,
    color: colors.white,
  },
  shareBtn: {
    position: 'absolute',
    bottom: 84,
    right: 20,
    zIndex: 20,
    padding: 8,
  },
});
