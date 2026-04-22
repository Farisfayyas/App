import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
} from 'react-native';
import Svg, { Path, Circle } from 'react-native-svg';
import { colors, fonts, spacing, TAB_BAR_HEIGHT, STATUS_BAR_HEIGHT } from '@/constants/tokens';

// Placeholder profile data — swap for useAuthStore(s => s.user) when auth is live
// SUPABASE: const user = useAuthStore(s => s.user);
const MOCK_PROFILE = {
  name: 'Faris Fayyas',
  handle: '@faris',
  location: 'Dubai',
  initials: 'FF',
  styleSummary: 'Minimal, clean cuts, warm tones',
  sizes: ['S', 'M'],
  brandsSelected: 8,
  favouriteColors: 'Warm neutrals',
};

// ── Chevron icon (right-facing, used in every settings row) ─────────────────
function Chevron({ faded = false }: { faded?: boolean }) {
  return (
    <Svg width={10} height={10} viewBox="0 0 24 24" fill="none">
      <Path
        d="M9 18l6-6-6-6"
        stroke={faded ? colors.line : colors.mute2}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

// ── Single settings row ──────────────────────────────────────────────────────
interface RowProps {
  label: string;
  value?: string;
  danger?: boolean;
  disabled?: boolean;
}

function SettingsRow({ label, value, danger = false, disabled = false }: RowProps) {
  return (
    <TouchableOpacity
      style={[styles.row, disabled && styles.rowDisabled]}
      activeOpacity={disabled ? 1 : 0.5}
      disabled={disabled}
    >
      <Text style={[styles.rowLabel, danger && styles.rowLabelDanger]}>{label}</Text>
      <View style={styles.rowRight}>
        {value ? <Text style={styles.rowValue}>{value}</Text> : null}
        <Chevron faded={disabled} />
      </View>
    </TouchableOpacity>
  );
}

// ── Section header label ─────────────────────────────────────────────────────
function SectionTag({ label }: { label: string }) {
  return <Text style={styles.sectionTag}>{label}</Text>;
}

// ─────────────────────────────────────────────────────────────────────────────

export default function ProfileScreen() {
  return (
    <View style={styles.screen}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.paper} />

      {/* ── Header ────────────────────────────────────────────────── */}
      <View style={styles.header}>
        <Text style={styles.title}>Profile</Text>
        <TouchableOpacity activeOpacity={0.7}>
          {/* Gear icon — Feather settings */}
          <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
            <Circle cx="12" cy="12" r="3" stroke={colors.mute2} strokeWidth={1.4} />
            <Path
              d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"
              stroke={colors.mute2}
              strokeWidth={1.4}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </Svg>
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>

        {/* ── Identity card ──────────────────────────────────────────── */}
        <View style={styles.identityCard}>
          {/* Avatar circle with initials */}
          <View style={styles.avatar}>
            <Text style={styles.avatarInitials}>{MOCK_PROFILE.initials}</Text>
          </View>

          {/* Name, handle, style summary */}
          <View style={styles.identityText}>
            <Text style={styles.identityName}>{MOCK_PROFILE.name}</Text>
            <Text style={styles.identityHandle}>
              {MOCK_PROFILE.handle} · {MOCK_PROFILE.location}
            </Text>
            <Text style={styles.identitySummary}>{MOCK_PROFILE.styleSummary}</Text>
          </View>
        </View>

        {/* ── Divider before first section ──────────────────────────── */}
        <View style={styles.fullDivider} />

        {/* ── Style preferences ──────────────────────────────────────── */}
        <View style={styles.section}>
          <SectionTag label="Style preferences" />
          <SettingsRow label="Sizes" value={MOCK_PROFILE.sizes.join(' · ')} />
          <SettingsRow label="Preferred brands" value={`${MOCK_PROFILE.brandsSelected} selected`} />
          <SettingsRow label="Favourite colors" value={MOCK_PROFILE.favouriteColors} />
        </View>

        {/* ── Account ────────────────────────────────────────────────── */}
        <View style={styles.section}>
          <SectionTag label="Account" />
          <SettingsRow label="Orders & returns" />
          <SettingsRow label="Payment methods" />
          <SettingsRow label="Addresses" />
          <SettingsRow label="Notifications" />
        </View>

        {/* ── Support ────────────────────────────────────────────────── */}
        <View style={[styles.section, styles.sectionLast]}>
          <SectionTag label="Support" />
          <SettingsRow label="Help center" />
          <SettingsRow label="Privacy" />
          {/* Sign out — visual placeholder only, no handler until auth is wired */}
          <SettingsRow label="Sign out" danger disabled />
        </View>

        <View style={{ height: TAB_BAR_HEIGHT + spacing.lg }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.paper,
  },

  // ── Header ──────────────────────────────────────────────────────────
  header: {
    paddingTop: STATUS_BAR_HEIGHT + 14,
    paddingHorizontal: 20,
    paddingBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontFamily: fonts.serifRegular,
    fontSize: 28,
    letterSpacing: -0.5,
    color: colors.ink,
  },

  // ── Identity card ─────────────────────────────────────────────────────
  identityCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    paddingHorizontal: 20,
    paddingTop: 18,
    paddingBottom: 20,
  },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: 36,
    // blush ≈ the start of the wireframe gradient — close enough without expo-linear-gradient
    backgroundColor: colors.blush,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarInitials: {
    fontFamily: fonts.serifItalic,
    fontSize: 26,
    color: colors.ink,
  },
  identityText: {
    flex: 1,
    gap: 2,
  },
  identityName: {
    fontFamily: fonts.serifRegular,
    fontSize: 20,
    letterSpacing: -0.3,
    color: colors.ink,
  },
  identityHandle: {
    fontFamily: fonts.monoRegular,
    fontSize: 10,
    letterSpacing: 1.3,
    color: colors.mute,
    textTransform: 'uppercase',
    marginTop: 2,
  },
  identitySummary: {
    fontFamily: fonts.sansRegular,
    fontSize: 11,
    color: colors.mute,
    marginTop: 6,
  },

  // ── Full-width divider between identity and first section ─────────────
  fullDivider: {
    height: 0.5,
    backgroundColor: colors.line,
  },

  // ── Section containers ────────────────────────────────────────────────
  section: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  sectionLast: {
    paddingBottom: 4,
  },
  sectionTag: {
    fontFamily: fonts.monoRegular,
    fontSize: 10,
    letterSpacing: 1.4,
    color: colors.mute,
    textTransform: 'uppercase',
    paddingBottom: 4,
  },

  // ── Settings rows ─────────────────────────────────────────────────────
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: 0.5,
    borderBottomColor: colors.line,
  },
  rowDisabled: {
    // Faded so it's clearly a placeholder, not yet interactive
    opacity: 0.38,
  },
  rowLabel: {
    fontFamily: fonts.sansRegular,
    fontSize: 13,
    color: colors.ink,
  },
  rowLabelDanger: {
    color: colors.accent,
  },
  rowRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  rowValue: {
    fontFamily: fonts.sansRegular,
    fontSize: 11,
    color: colors.mute,
  },
});
