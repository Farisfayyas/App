import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { Item } from '@/types';
import { colors, fonts, toneColors, radius } from '@/constants/tokens';

interface Props {
  item: Item;
  cardWidth: number;
  onRemove: () => void;
}

export function LikedItemCard({ item, cardWidth, onRemove }: Props) {
  const bgColor = toneColors[item.colors[0]] ?? colors.paper2;

  return (
    <View style={{ width: cardWidth }}>
      {/* Image container */}
      <View style={[styles.imageWrap, { backgroundColor: bgColor }]}>
        <Image source={{ uri: item.images[0] }} style={styles.image} resizeMode="cover" />

        {/* Heart button — tapping removes the item from likes */}
        <TouchableOpacity onPress={onRemove} style={styles.heartBtn}>
          <Svg width={12} height={12} viewBox="0 0 24 24">
            <Path
              d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
              fill={colors.accent}
            />
          </Svg>
        </TouchableOpacity>
      </View>

      {/* Text block below image */}
      <View style={styles.textBlock}>
        <Text style={styles.brand}>{item.brand.toUpperCase()}</Text>
        <View style={styles.nameRow}>
          <Text style={styles.name} numberOfLines={1}>{item.name}</Text>
          <Text style={styles.price}>AED {item.price.toLocaleString()}</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  imageWrap: {
    height: 160,
    borderRadius: radius.sm,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  heartBtn: {
    position: 'absolute',
    top: 6,
    right: 6,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.9)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  textBlock: {
    marginTop: 4,
    paddingHorizontal: 2,
  },
  brand: {
    fontFamily: fonts.monoRegular,
    fontSize: 8,
    letterSpacing: 1.3,
    color: colors.mute,
    marginBottom: 2,
  },
  nameRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    gap: 4,
  },
  name: {
    fontFamily: fonts.serifRegular,
    fontSize: 12,
    color: colors.ink,
    flex: 1,
  },
  price: {
    fontFamily: fonts.serifRegular,
    fontSize: 12,
    color: colors.ink,
    flexShrink: 0,
  },
});
