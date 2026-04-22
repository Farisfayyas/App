import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { CartItem } from '@/types';
import { colors, fonts, toneColors, radius } from '@/constants/tokens';

interface Props {
  cartItem: CartItem;
  onRemove: () => void;
  onUpdateSize: (size: string) => void;
  onUpdateQuantity: (qty: number) => void;
}

export function CartItemRow({ cartItem, onRemove, onUpdateSize, onUpdateQuantity }: Props) {
  const { item, selectedSize, quantity } = cartItem;
  const [showSizes, setShowSizes] = useState(false);

  // Use the item's first color as the placeholder background tone
  const bgColor = toneColors[item.colors[0]] ?? colors.paper2;

  return (
    <View>
      <View style={styles.row}>
        {/* Product image with tone fallback behind it while loading */}
        <View style={[styles.imageWrap, { backgroundColor: bgColor }]}>
          <Image source={{ uri: item.images[0] }} style={styles.image} resizeMode="cover" />
        </View>

        {/* Text + controls */}
        <View style={styles.content}>
          {/* Top block: brand / name / color + remove ✕ */}
          <View style={styles.topRow}>
            <View style={styles.topLeft}>
              <Text style={styles.brand}>{item.brand.toUpperCase()}</Text>
              <Text style={styles.name} numberOfLines={2}>{item.name}</Text>
              {item.colors[0] ? (
                <Text style={styles.colorLabel}>{item.colors[0]}</Text>
              ) : null}
            </View>
            <TouchableOpacity
              onPress={onRemove}
              hitSlop={{ top: 8, right: 8, bottom: 8, left: 8 }}
            >
              <Text style={styles.removeIcon}>✕</Text>
            </TouchableOpacity>
          </View>

          {/* Inline size chips — shown when the size button is tapped */}
          {showSizes && (
            <View style={styles.sizeChipRow}>
              {item.sizes.map((size) => (
                <TouchableOpacity
                  key={size}
                  onPress={() => { onUpdateSize(size); setShowSizes(false); }}
                  style={[styles.sizeChip, size === selectedSize && styles.sizeChipActive]}
                >
                  <Text style={[styles.sizeChipText, size === selectedSize && styles.sizeChipTextActive]}>
                    {size}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          )}

          {/* Bottom row: [Size ▾] [− qty +]   price */}
          <View style={styles.bottomRow}>
            <View style={styles.controls}>
              <TouchableOpacity
                onPress={() => setShowSizes((v) => !v)}
                style={styles.controlBtn}
              >
                <Text style={styles.controlBtnText}>Size {selectedSize} ▾</Text>
              </TouchableOpacity>

              <View style={styles.qtyWrap}>
                <TouchableOpacity
                  onPress={() => onUpdateQuantity(quantity - 1)}
                  style={styles.qtyBtn}
                >
                  <Text style={styles.qtyBtnText}>−</Text>
                </TouchableOpacity>
                <Text style={styles.qtyNum}>{quantity}</Text>
                <TouchableOpacity
                  onPress={() => onUpdateQuantity(quantity + 1)}
                  style={styles.qtyBtn}
                >
                  <Text style={styles.qtyBtnText}>+</Text>
                </TouchableOpacity>
              </View>
            </View>

            <Text style={styles.price}>AED {(item.price * quantity).toLocaleString()}</Text>
          </View>
        </View>
      </View>

      {/* Hairline divider between rows */}
      <View style={styles.divider} />
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: 12,
    paddingVertical: 14,
    paddingHorizontal: 20,
  },
  imageWrap: {
    width: 82,
    height: 104,
    borderRadius: radius.sm,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  content: {
    flex: 1,
    justifyContent: 'space-between',
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  topLeft: {
    flex: 1,
    gap: 2,
  },
  brand: {
    fontFamily: fonts.monoRegular,
    fontSize: 9,
    letterSpacing: 1.5,
    color: colors.mute,
  },
  name: {
    fontFamily: fonts.serifRegular,
    fontSize: 15,
    letterSpacing: -0.2,
    color: colors.ink,
    marginTop: 1,
  },
  colorLabel: {
    fontFamily: fonts.sansRegular,
    fontSize: 11,
    color: colors.mute,
    marginTop: 1,
  },
  removeIcon: {
    fontFamily: fonts.sansRegular,
    fontSize: 12,
    color: colors.mute2,
    paddingLeft: 8,
  },
  sizeChipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 4,
    marginTop: 6,
  },
  sizeChip: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderWidth: 0.5,
    borderColor: colors.line,
    borderRadius: radius.sm,
  },
  sizeChipActive: {
    borderColor: colors.ink,
    backgroundColor: colors.ink,
  },
  sizeChipText: {
    fontFamily: fonts.sansRegular,
    fontSize: 10,
    color: colors.mute,
  },
  sizeChipTextActive: {
    color: colors.white,
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginTop: 8,
  },
  controls: {
    flexDirection: 'row',
    gap: 4,
    alignItems: 'center',
  },
  controlBtn: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderWidth: 0.5,
    borderColor: colors.line,
    borderRadius: radius.sm,
  },
  controlBtnText: {
    fontFamily: fonts.sansRegular,
    fontSize: 10,
    color: colors.ink,
  },
  qtyWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 0.5,
    borderColor: colors.line,
    borderRadius: radius.sm,
    overflow: 'hidden',
  },
  qtyBtn: {
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  qtyBtnText: {
    fontFamily: fonts.sansRegular,
    fontSize: 13,
    color: colors.ink,
    lineHeight: 16,
  },
  qtyNum: {
    fontFamily: fonts.sansRegular,
    fontSize: 10,
    color: colors.ink,
    minWidth: 16,
    textAlign: 'center',
  },
  price: {
    fontFamily: fonts.serifMedium,
    fontSize: 15,
    letterSpacing: -0.2,
    color: colors.ink,
  },
  divider: {
    height: 0.5,
    backgroundColor: colors.line,
    marginHorizontal: 20,
  },
});
