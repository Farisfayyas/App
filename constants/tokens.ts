// Design tokens matching the Swoon Wireframes (minimal editorial aesthetic)

export const colors = {
  ink: '#1a1714',
  paper: '#faf8f4',
  paper2: '#f3efe8',
  line: '#e6e0d6',
  mute: '#8a837a',
  mute2: '#a8a197',
  accent: '#c14a2a',   // terracotta — badges, likes, danger
  cream: '#ece4d3',
  blush: '#e8d5c8',
  sage: '#c4ccb5',
  slate: '#2a2622',
  taupe: '#b8a998',
  bone: '#e8e3d7',
  rust: '#c89581',
  white: '#ffffff',
  transparent: 'transparent',
} as const;

// Map palette key → actual hex (used for mock item backgrounds)
export const toneColors: Record<string, string> = {
  blush: colors.blush,
  sage: colors.sage,
  cream: colors.cream,
  slate: colors.slate,
  taupe: colors.taupe,
  bone: colors.bone,
  rust: colors.rust,
};

// Font family strings — must match keys passed to useFonts() in _layout.tsx
export const fonts = {
  serifRegular: 'EBGaramond_400Regular',
  serifItalic: 'EBGaramond_400Regular_Italic',
  serifMedium: 'EBGaramond_500Medium',
  serifMediumItalic: 'EBGaramond_500Medium_Italic',
  sansRegular: 'InterTight_400Regular',
  sansMedium: 'InterTight_500Medium',
  sansSemiBold: 'InterTight_600SemiBold',
  sansBold: 'InterTight_700Bold',
  monoRegular: 'JetBrainsMono_400Regular',
  monoMedium: 'JetBrainsMono_500Medium',
} as const;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  base: 16,
  lg: 20,
  xl: 24,
  xxl: 32,
  xxxl: 48,
} as const;

export const radius = {
  sm: 2,
  md: 4,
  lg: 8,
  full: 999,
} as const;

// Tab bar height including home indicator padding
export const TAB_BAR_HEIGHT = 80;
export const STATUS_BAR_HEIGHT = 44;
