import { Text } from 'react-native';
import { styles } from '../theme/styles';

export type Msg = { text: string; ok: boolean } | null;

export function Message({ msg }: { msg: Msg }) {
  if (!msg) return null;
  return (
    <Text style={[styles.message, msg.ok ? styles.ok : styles.error]}>
      {msg.text}
    </Text>
  );
}