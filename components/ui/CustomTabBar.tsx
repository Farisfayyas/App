import React from 'react';
import { View, Text, Pressable, StyleSheet, Platform } from 'react-native';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import Svg, { Path, Circle } from 'react-native-svg';
import { colors, fonts, TAB_BAR_HEIGHT } from '@/constants/tokens';
import { useCartStore } from '@/store/useCartStore';
import { useChatStore } from '@/store/useChatStore';

// ── Inline SVG icons matching the Swoon wireframe design ────────────────────

function HomeIcon({ color, strokeWidth }: { color: string; strokeWidth: number }) {
  return (
    <Svg width={22} height={22} viewBox="0 0 24 24" fill="none">
      <Path
        d="M3 11L12 3l9 8v10a1 1 0 0 1-1 1h-5v-7h-6v7H4a1 1 0 0 1-1-1V11z"
        stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round"
      />
    </Svg>
  );
}

function SearchIcon({ color, strokeWidth }: { color: string; strokeWidth: number }) {
  return (
    <Svg width={22} height={22} viewBox="0 0 24 24" fill="none">
      <Circle cx={11} cy={11} r={7} stroke={color} strokeWidth={strokeWidth} />
      <Path d="M16.5 16.5L21 21" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
    </Svg>
  );
}

function CartIcon({ color, strokeWidth }: { color: string; strokeWidth: number }) {
  return (
    <Svg width={22} height={22} viewBox="0 0 24 24" fill="none">
      <Path
        d="M4 5h2.5l2.5 11h10l2-8H7"
        stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round"
      />
      <Circle cx={10} cy={20} r={1.3} fill={color} />
      <Circle cx={18} cy={20} r={1.3} fill={color} />
    </Svg>
  );
}

function ChatIcon({ color, strokeWidth }: { color: string; strokeWidth: number }) {
  return (
    <Svg width={22} height={22} viewBox="0 0 24 24" fill="none">
      <Path
        d="M3 4h18v14a1.5 1.5 0 0 1-1.5 1.5H4.5A1.5 1.5 0 0 1 3 18V4z"
        stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round"
      />
    </Svg>
  );
}

function ProfileIcon({ color, strokeWidth }: { color: string; strokeWidth: number }) {
  return (
    <Svg width={22} height={22} viewBox="0 0 24 24" fill="none">
      <Circle cx={12} cy={8} r={4} stroke={color} strokeWidth={strokeWidth} />
      <Path
        d="M4 21c0-4.4 3.6-8 8-8s8 3.6 8 8"
        stroke={color} strokeWidth={strokeWidth} strokeLinecap="round"
      />
    </Svg>
  );
}

const ICONS = [HomeIcon, SearchIcon, CartIcon, ChatIcon, ProfileIcon];
const LABELS = ['Home', 'Search', 'Cart', 'Chat', 'Profile'];

// ── Tab bar component ────────────────────────────────────────────────────────

export function CustomTabBar({ state, navigation }: BottomTabBarProps) {
  const cartCount = useCartStore((s) => s.cartItems.reduce((sum, ci) => sum + ci.quantity, 0));
  const chatUnread = useChatStore((s) => s.conversations.reduce((sum, c) => sum + c.unreadCount, 0));

  const badges: Record<number, number> = {};
  if (cartCount > 0) badges[2] = cartCount;
  if (chatUnread > 0) badges[3] = chatUnread;

  return (
    <View style={styles.container}>
      <View style={styles.border} />
      {state.routes.map((route, index) => {
        const isActive = state.index === index;
        const iconColor = isActive ? colors.ink : colors.mute2;
        const strokeWidth = isActive ? 2 : 1.6;
        const Icon = ICONS[index];
        const badge = badges[index];

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });
          if (!isActive && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        return (
          <Pressable
            key={route.key}
            style={styles.tab}
            onPress={onPress}
            accessibilityRole="button"
            accessibilityState={{ selected: isActive }}
            accessibilityLabel={LABELS[index]}
          >
            <View style={styles.iconWrap}>
              {Icon && <Icon color={iconColor} strokeWidth={strokeWidth} />}
              {badge != null && (
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>{badge > 99 ? '99+' : badge}</Text>
                </View>
              )}
            </View>
            <Text style={[styles.label, isActive && styles.labelActive]}>
              {LABELS[index]}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: TAB_BAR_HEIGHT,
    flexDirection: 'row',
    backgroundColor: colors.paper,
    paddingTop: 10,
    paddingBottom: Platform.OS === 'ios' ? 24 : 12,
    alignItems: 'flex-start',
    justifyContent: 'space-around',
  },
  border: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 0.5,
    backgroundColor: colors.line,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    gap: 3,
  },
  iconWrap: {
    position: 'relative',
  },
  badge: {
    position: 'absolute',
    top: -4,
    right: -8,
    minWidth: 16,
    height: 16,
    paddingHorizontal: 4,
    borderRadius: 8,
    backgroundColor: colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: {
    fontFamily: fonts.sansSemiBold,
    fontSize: 9,
    color: colors.white,
  },
  label: {
    fontFamily: fonts.sansMedium,
    fontSize: 10,
    letterSpacing: 0.3,
    color: colors.mute2,
  },
  labelActive: {
    fontFamily: fonts.sansSemiBold,
    color: colors.ink,
  },
});
