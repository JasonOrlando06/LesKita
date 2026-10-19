import { useEffect, useRef, useState } from 'react';
import { TextInput } from 'react-native';
import { colors } from '../theme/colors';
import { styles } from '../theme/styles';

export function PasswordInput({
  value,
  onChangeText,
  placeholder,
}: {
  value: string;
  onChangeText: (text: string) => void;
  placeholder: string;
}) {
  const [showLast, setShowLast] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, []);

  const masked =
    value.length === 0
      ? ''
      : showLast
      ? '•'.repeat(value.length - 1) + value[value.length - 1]
      : '•'.repeat(value.length);

  const handleChange = (text: string) => {
    if (text.length > value.length) {
      onChangeText(value + text.slice(value.length));
      setShowLast(true);
      if (timer.current) clearTimeout(timer.current);
      timer.current = setTimeout(() => setShowLast(false), 500);
    } else {
      onChangeText(text.length < value.length ? value.slice(0, text.length) : value);
      setShowLast(false);
    }
  };

  return (
    <TextInput
      style={styles.input}
      placeholder={placeholder}
      placeholderTextColor={colors.muted}
      value={masked}
      onChangeText={handleChange}
      selection={{ start: masked.length, end: masked.length }}
      autoCapitalize="none"
      autoCorrect={false}
      autoComplete="off"
    />
  );
}