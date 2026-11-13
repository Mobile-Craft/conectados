import { Image, View } from 'react-native';
import { GradientFill } from '../gradient/GradientFill';
import { Text } from '../text/Text';
import { createStyles, useTheme } from '../theme';

export type AvatarSize = 'sm' | 'md' | 'lg';

export interface AvatarProps {
  /** Nombre de la persona: da las iniciales y lo que lee el lector de pantalla. */
  name: string;
  imageUrl?: string | null;
  size?: AvatarSize;
}

const SIZES: Record<AvatarSize, number> = { sm: 32, md: 44, lg: 64 };

/** Las iniciales de un nombre: "Ana María" → "AM"; un solo nombre → su primera letra. */
export function initials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  const letters = parts.length > 1 ? [parts[0], parts[parts.length - 1]] : parts.slice(0, 1);
  return letters.map((p) => Array.from(p ?? '')[0]?.toUpperCase() ?? '').join('') || '?';
}

/** Foto o iniciales de una persona, en círculo; sin foto, las iniciales van sobre el degradado. */
export function Avatar({ name, imageUrl, size = 'md' }: AvatarProps) {
  const styles = useStyles();
  const { components } = useTheme();
  const dimension = SIZES[size];
  const box = { width: dimension, height: dimension, borderRadius: dimension / 2 };

  return (
    <View accessible accessibilityRole="image" accessibilityLabel={name} style={[styles.base, box]}>
      {imageUrl ? (
        <Image source={{ uri: imageUrl }} style={box} accessibilityIgnoresInvertColors />
      ) : (
        <>
          <GradientFill colors={components.avatar.gradient} borderRadius={dimension / 2} />
          <Text
            variant={size === 'lg' ? 'title2' : size === 'md' ? 'bodyStrong' : 'caption'}
            style={{ color: components.avatar.text }}
            maxFontSizeMultiplier={1.4}
          >
            {initials(name)}
          </Text>
        </>
      )}
    </View>
  );
}

const useStyles = createStyles((t) => ({
  base: {
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: t.components.avatar.ring,
  },
}));
