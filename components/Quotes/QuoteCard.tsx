import { Quote } from '@/components/Interfaces';
import { useEffect, useRef } from 'react';
import { Animated, Image, StyleSheet, Text, View } from 'react-native';
import { Theme, darkTheme } from '../themes';

// Font family names as registered by @expo-google-fonts
export const fonts = {
  serif: 'ShipporiMincho_500Medium',
  serifBold: 'ShipporiMincho_700Bold',
  sans: 'ZenKakuGothicNew_400Regular',
  sansBold: 'ZenKakuGothicNew_700Bold',
};


type Props = {
  quote: Quote;
  theme?: Theme;
};

// ---------- Component ----------
export default function QuoteCard({ quote, theme = darkTheme }: Props) {
  // Fade + slight rise whenever the quote changes
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(8)).current;

  useEffect(() => {
    opacity.setValue(0);
    translateY.setValue(8);
    Animated.parallel([
      Animated.timing(opacity, { toValue: 1, duration: 320, useNativeDriver: true }),
      Animated.timing(translateY, { toValue: 0, duration: 320, useNativeDriver: true }),
    ]).start();
  }, [quote.id]);

  const source = quote.episode != null ? `${quote.anime}, ep. ${quote.episode}` : quote.anime;

  return (
    <View
      style={[styles.card, { backgroundColor: theme.surface, borderColor: theme.line }]}
      accessible
      accessibilityLabel={`${quote.quote}. ${quote.char_name}, ${source}`}
    >
      {/* Vertical 言葉 ("words") watermark */}
      <Text
        style={[styles.watermark, { color: theme.ghost }]}
        importantForAccessibility="no-hide-descendants"
        accessibilityElementsHidden
      >
        {'言\n葉'}
      </Text>

      <Animated.View style={{ opacity, transform: [{ translateY }] }}>
        <Text style={[styles.quoteMark, { color: theme.accent }]}>“</Text>
        <Text style={[styles.quoteText, { color: theme.ink }]}>{quote.quote}</Text>
      </Animated.View>

      <Animated.View style={[styles.attribution, { borderTopColor: theme.line, opacity }]}>
        {quote.imageUrl ? (
          <Image source={{ uri: quote.imageUrl }} style={styles.avatar} />
        ) : (
          <View style={[styles.avatar, { backgroundColor: theme.bg, borderColor: theme.line, borderWidth: 1 }]}>
            <Text style={[styles.avatarInitial, { color: theme.muted }]}>
              {quote.char_name.charAt(0)}
            </Text>
          </View>
        )}
        <View style={styles.attributionText}>
          <Text style={[styles.character, { color: theme.ink }]} numberOfLines={1}>
            {quote.char_name}
          </Text>
          <Text style={[styles.series, { color: theme.muted }]} numberOfLines={1}>
            {source}
          </Text>
        </View>
      </Animated.View>
    </View>
  );
}

// ---------- Styles ----------
const styles = StyleSheet.create({
  card: {
    flex: 1,
    justifyContent: 'space-between',
    borderWidth: 1,
    borderRadius: 24,
    paddingHorizontal: 26,
    paddingTop: 26,
    paddingBottom: 24,
    overflow: 'hidden',
  },
  watermark: {
    position: 'absolute',
    right: 4,
    top: 8,
    fontFamily: fonts.serif,
    fontSize: 140,
    lineHeight: 150,
  },
  quoteMark: {
    fontFamily: fonts.serifBold,
    fontSize: 84,
    lineHeight: 84,
    height: 48, // lets the quote text tuck up under the mark
  },
  quoteText: {
    fontFamily: fonts.serif,
    fontSize: 27,
    lineHeight: 37,
    letterSpacing: -0.2,
  },
  attribution: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    paddingTop: 18,
    marginTop: 24,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  avatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarInitial: {
    fontFamily: fonts.serifBold,
    fontSize: 22,
  },
  attributionText: {
    flex: 1,
    gap: 3,
  },
  character: {
    fontFamily: fonts.sansBold,
    fontSize: 16,
  },
  series: {
    fontFamily: fonts.sans,
    fontSize: 14,
  },
});