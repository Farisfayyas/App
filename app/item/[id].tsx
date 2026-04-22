import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { colors, fonts, TAB_BAR_HEIGHT, STATUS_BAR_HEIGHT } from '@/constants/tokens';
import { MOCK_ITEMS } from '@/constants/mockData';

// Skeleton — full Item Detail screen (image gallery, size selector, add to bag)
// will be built in the next session. Navigated to from Cart and Likes.
export default function ItemDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const item = MOCK_ITEMS.find((i) => i.id === id);

  return (
    <View style={styles.container}>
      <View style={styles.topBar}>
        <Pressable onPress={() => router.back()} style={styles.backBtn} hitSlop={12}>
          <Text style={styles.backText}>← Back</Text>
        </Pressable>
      </View>

      <View style={styles.body}>
        {item ? (
          <>
            <Text style={styles.brand}>{item.brand}</Text>
            <Text style={styles.name}>{item.name}</Text>
            <Text style={styles.price}>{`${item.currency} ${item.price}`}</Text>
            <Text style={styles.placeholder}>Full detail view — coming next session</Text>
          </>
        ) : (
          <Text style={styles.placeholder}>Item not found</Text>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.paper,
  },
  topBar: {
    paddingTop: STATUS_BAR_HEIGHT + 14,
    paddingHorizontal: 20,
    paddingBottom: 14,
  },
  backBtn: {
    alignSelf: 'flex-start',
  },
  backText: {
    fontFamily: fonts.sansMedium,
    fontSize: 14,
    color: colors.ink,
  },
  body: {
    flex: 1,
    paddingHorizontal: 20,
    paddingBottom: TAB_BAR_HEIGHT,
  },
  brand: {
    fontFamily: fonts.monoRegular,
    fontSize: 10,
    letterSpacing: 1.6,
    color: colors.accent,
    textTransform: 'uppercase',
  },
  name: {
    fontFamily: fonts.serifRegular,
    fontSize: 24,
    letterSpacing: -0.4,
    color: colors.ink,
    marginTop: 6,
  },
  price: {
    fontFamily: fonts.serifMedium,
    fontSize: 20,
    color: colors.ink,
    marginTop: 4,
  },
  placeholder: {
    fontFamily: fonts.monoRegular,
    fontSize: 11,
    letterSpacing: 1.4,
    color: colors.mute,
    textTransform: 'uppercase',
    marginTop: 32,
  },
});
