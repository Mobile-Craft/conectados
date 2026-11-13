import { useState } from 'react';
import { TextInput, View, type TextInputProps } from 'react-native';
import { Text } from '../text/Text';
import { createStyles, useTheme } from '../theme';

export interface InputProps extends Omit<
  TextInputProps,
  'style' | 'editable' | 'placeholderTextColor'
> {
  /** Etiqueta visible; también es lo que lee el lector de pantalla. */
  label: string;
  helper?: string;
  /** Mensaje de error: pinta el borde de error y se anuncia. */
  error?: string | null;
  disabled?: boolean;
}

/**
 * Campo de texto de cristal con etiqueta, ayuda y error. Mide al menos 48 pt de alto; con foco,
 * el borde toma el color del acento.
 */
export function Input({
  label,
  helper,
  error,
  disabled = false,
  onFocus,
  onBlur,
  ...rest
}: InputProps) {
  const styles = useStyles();
  const { components } = useTheme();
  const [focused, setFocused] = useState(false);
  const message = error ?? helper;

  return (
    <View style={styles.wrapper}>
      <Text variant="label" tone="secondary">
        {label}
      </Text>
      <TextInput
        accessibilityLabel={label}
        accessibilityHint={message ?? undefined}
        accessibilityState={{ disabled }}
        editable={!disabled}
        placeholderTextColor={components.input.placeholder}
        onFocus={(e) => {
          setFocused(true);
          onFocus?.(e);
        }}
        onBlur={(e) => {
          setFocused(false);
          onBlur?.(e);
        }}
        style={[
          styles.input,
          focused && styles.focused,
          error ? styles.error : undefined,
          disabled && styles.disabled,
        ]}
        {...rest}
      />
      {message ? (
        <Text
          variant="caption"
          tone={error ? 'danger' : 'muted'}
          accessibilityLiveRegion={error ? 'polite' : 'none'}
        >
          {message}
        </Text>
      ) : null}
    </View>
  );
}

const useStyles = createStyles((t) => ({
  wrapper: { gap: t.space[1], alignSelf: 'stretch' },
  input: {
    ...t.type.body,
    minHeight: 48,
    paddingHorizontal: t.space[4],
    paddingVertical: t.space[3],
    borderRadius: t.radius.lg,
    borderWidth: 1,
    borderColor: t.components.input.border,
    backgroundColor: t.components.input.bg,
    color: t.components.input.text,
  },
  focused: { borderColor: t.components.input.focusBorder, borderWidth: 2 },
  error: { borderColor: t.components.input.errorText, borderWidth: 2 },
  disabled: { opacity: 0.45 },
}));
