import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  StatusBar,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import { colors, fonts, spacing, TAB_BAR_HEIGHT, STATUS_BAR_HEIGHT } from '@/constants/tokens';
import { useCartStore } from '@/store/useCartStore';
import { CartItemRow } from '@/components/cart/CartItemRow';
import { LikedItemCard } from '@/components/cart/LikedItemCard';

const SCREEN_WIDTH = Dimensions.get('window').width;
const GRID_GAP = 6;
const GRID_H_PAD = 20;
// Each card takes half the screen minus the outer padding and the single gap
const CARD_WIDTH = (SCREEN_WIDTH - GRID_H_PAD * 2 - GRID_GAP) / 2;

// SUPABASE: uncomment when auth is wired up
// import { useAuthStore } from '@/store/useAuthStore';
// import { supabase } from '@/services/supabase';
// import { useEffect } from 'react';

export default function CartScreen() {
  const cartItems     = useCartStore((s) => s.cartItems);
  const likedItems    = useCartStore((s) => s.likedItems);
  const removeFromCart  = useCartStore((s) => s.removeFromCart);
  const removeFromLikes = useCartStore((s) => s.removeFromLikes);
  const updateSize      = useCartStore((s) => s.updateSize);
  const updateQuantity  = useCartStore((s) => s.updateQuantity);
  const cartTotal = useCartStore((s) => s.cartTotal);
  const cartCount = useCartStore((s) => s.cartCount);

  // SUPABASE: hydrate cart + likes from DB on mount when a real user is logged in
  // const userId = useAuthStore(s => s.user?.id);
  // useEffect(() => {
  //   if (!userId) return;
  //   supabase.from('cart_items').select('*, item:items(*)').eq('user_id', userId)
  //     .then(({ data }) => data && hydrateCart(data));
  //   supabase.from('likes').select('*, item:items(*)').eq('user_id', userId)
  //     .then(({ data }) => data && hydrateLikes(data));
  // }, [userId]);

  const total = cartTotal();
  const count = cartCount();
  const isEmpty = cartItems.length === 0 && likedItems.length === 0;

  // Break liked items into rows of 2 for the grid
  const likedRows = Array.from(
    { length: Math.ceil(likedItems.length / 2) },
    (_, i) => likedItems.slice(i * 2, i * 2 + 2)
  );

  return (
    <View style={styles.screen}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.paper} />

      {/* ── Header ────────────────────────────────────────────────── */}
      <View style={styles.header}>
        <Text style={styles.title}>Your bag</Text>
        {count > 0 && (
          <Text style={styles.headerBadge}>
            {count} {count === 1 ? 'item' : 'items'} · AED {total.toLocaleString()}
          </Text>
        )}
      </View>

      {isEmpty ? (
        // ── Empty state: nothing in bag or likes ───────────────────
        <View style={styles.emptyFull}>
          <Text style={styles.emptyTitle}>Your bag is empty</Text>
          <Text style={styles.emptyHint}>SWIPE UP ON A CARD TO ADD PIECES</Text>
        </View>
      ) : (
        <ScrollView showsVerticalScrollIndicator={false}>

          {/* ── Cart items ────────────────────────────────────────── */}
          {cartItems.length > 0 && (
            <View>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTag}>In your bag</Text>
              </View>

              {cartItems.map((ci) => (
                <CartItemRow
                  key={ci.id}
                  cartItem={ci}
                  onRemove={() => removeFromCart(ci.id)}
                  onUpdateSize={(size) => updateSize(ci.id, size)}
                  onUpdateQuantity={(qty) => updateQuantity(ci.id, qty)}
                />
              ))}

              {/* ── Checkout summary ──────────────────────────────── */}
              <View style={styles.summary}>
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>Subtotal</Text>
                  <Text style={styles.summaryValue}>AED {total.toLocaleString()}</Text>
                </View>
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>Shipping</Text>
                  <Text style={styles.summaryValue}>Free</Text>
                </View>
                <View style={styles.totalRow}>
                  <Text style={styles.totalLabel}>Total</Text>
                  <Text style={styles.totalValue}>AED {total.toLocaleString()}</Text>
                </View>
                <TouchableOpacity style={styles.checkoutBtn} activeOpacity={0.85}>
                  <Text style={styles.checkoutBtnText}>Checkout →</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}

          {/* ── Likes section ─────────────────────────────────────── */}
          {likedItems.length > 0 ? (
            <View style={styles.likesSection}>
              <Text style={styles.savedTag}>Saved for later</Text>
              <View style={styles.likesTitleRow}>
                <Text style={styles.likesTitle}>
                  Likes
                  <Text style={styles.likesTitleCount}> · {likedItems.length}</Text>
                </Text>
              </View>

              {/* 2-column grid */}
              <View style={styles.grid}>
                {likedRows.map((row, rowIndex) => (
                  <View key={rowIndex} style={styles.gridRow}>
                    {row.map((item) => (
                      <LikedItemCard
                        key={item.id}
                        item={item}
                        cardWidth={CARD_WIDTH}
                        onRemove={() => removeFromLikes(item.id)}
                      />
                    ))}
                    {/* Ghost spacer keeps odd final card at half-width */}
                    {row.length === 1 && <View style={{ width: CARD_WIDTH }} />}
                  </View>
                ))}
              </View>
            </View>
          ) : (
            // Shown when there are cart items but no likes yet
            <View style={styles.emptyLikes}>
              <Text style={styles.emptyLikesTitle}>Nothing saved yet</Text>
              <Text style={styles.emptyHint}>SWIPE RIGHT TO SAVE A PIECE</Text>
            </View>
          )}

          {/* Bottom clearance so the last card clears the tab bar */}
          <View style={{ height: TAB_BAR_HEIGHT + spacing.lg }} />
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.paper,
  },

  // ── Header ─────────────────────────────────────────────────────
  header: {
    paddingTop: STATUS_BAR_HEIGHT + 14,
    paddingHorizontal: 20,
    paddingBottom: 6,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
  },
  title: {
    fontFamily: fonts.serifRegular,
    fontSize: 28,
    letterSpacing: -0.5,
    color: colors.ink,
  },
  headerBadge: {
    fontFamily: fonts.monoRegular,
    fontSize: 10,
    letterSpacing: 1,
    color: colors.mute,
  },

  // ── Section label above cart rows ──────────────────────────────
  sectionHeader: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 4,
  },
  sectionTag: {
    fontFamily: fonts.monoRegular,
    fontSize: 9,
    letterSpacing: 1.5,
    color: colors.mute,
    textTransform: 'uppercase',
  },

  // ── Checkout summary block ──────────────────────────────────────
  summary: {
    backgroundColor: colors.paper2,
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 20,
    marginTop: 8,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  summaryLabel: {
    fontFamily: fonts.sansRegular,
    fontSize: 12,
    color: colors.mute,
  },
  summaryValue: {
    fontFamily: fonts.sansRegular,
    fontSize: 12,
    color: colors.mute,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
    paddingTop: 8,
    borderTopWidth: 0.5,
    borderTopColor: colors.line,
  },
  totalLabel: {
    fontFamily: fonts.serifMedium,
    fontSize: 16,
    color: colors.ink,
  },
  totalValue: {
    fontFamily: fonts.serifMedium,
    fontSize: 16,
    color: colors.ink,
  },
  checkoutBtn: {
    height: 44,
    backgroundColor: colors.ink,
    marginTop: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkoutBtnText: {
    fontFamily: fonts.monoMedium,
    fontSize: 10,
    letterSpacing: 2,
    color: colors.white,
    textTransform: 'uppercase',
  },

  // ── Likes grid section ─────────────────────────────────────────
  likesSection: {
    marginTop: 28,
    paddingHorizontal: GRID_H_PAD,
  },
  savedTag: {
    fontFamily: fonts.monoRegular,
    fontSize: 10,
    letterSpacing: 1.5,
    color: colors.mute,
    textTransform: 'uppercase',
  },
  likesTitleRow: {
    marginTop: 6,
    marginBottom: 10,
  },
  likesTitle: {
    fontFamily: fonts.serifRegular,
    fontSize: 22,
    letterSpacing: -0.4,
    color: colors.ink,
  },
  likesTitleCount: {
    fontFamily: fonts.serifRegular,
    fontSize: 14,
    color: colors.mute,
  },
  grid: {
    gap: GRID_GAP,
  },
  gridRow: {
    flexDirection: 'row',
    gap: GRID_GAP,
  },

  // ── Empty states ───────────────────────────────────────────────
  emptyFull: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: TAB_BAR_HEIGHT,
    gap: 8,
  },
  emptyTitle: {
    fontFamily: fonts.serifItalic,
    fontSize: 18,
    letterSpacing: -0.3,
    color: colors.ink,
  },
  emptyHint: {
    fontFamily: fonts.monoRegular,
    fontSize: 9,
    letterSpacing: 1.4,
    color: colors.mute,
    textTransform: 'uppercase',
  },
  emptyLikes: {
    alignItems: 'center',
    paddingVertical: 28,
    gap: 8,
  },
  emptyLikesTitle: {
    fontFamily: fonts.serifItalic,
    fontSize: 16,
    letterSpacing: -0.3,
    color: colors.ink,
  },
});
