import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, fonts, TAB_BAR_HEIGHT, STATUS_BAR_HEIGHT } from '@/constants/tokens';

// Skeleton — full Search screen will be built in the next session
export default function SearchScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Search</Text>
      </View>
      <View style={styles.body}>
        <Text style={styles.placeholder}>Grid search — coming next session</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.paper,
  },
  header: {
    paddingTop: STATUS_BAR_HEIGHT + 14,
    paddingHorizontal: 20,
    paddingBottom: 10,
  },
  title: {
    fontFamily: fonts.serifRegular,
    fontSize: 28,
    letterSpacing: -0.5,
    color: colors.ink,
  },
  body: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: TAB_BAR_HEIGHT,
  },
  placeholder: {
    fontFamily: fonts.monoRegular,
    fontSize: 11,
    letterSpacing: 1.4,
    color: colors.mute,
    textTransform: 'uppercase',
  },
});
