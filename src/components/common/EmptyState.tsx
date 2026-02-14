import { View, Text, StyleSheet } from 'react-native';
import { Button } from '../ui/Button';
import { Colors } from '../../constants/colors';

interface EmptyStateProps {
  message: string;
  submessage?: string;
  actionLabel?: string;
  onAction?: () => void;
}

export function EmptyState({ message, submessage, actionLabel, onAction }: EmptyStateProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.icon}>🍽️</Text>
      <Text style={styles.message}>{message}</Text>
      {submessage ? <Text style={styles.submessage}>{submessage}</Text> : null}
      {actionLabel && onAction ? (
        <Button title={actionLabel} onPress={onAction} style={styles.button} />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
    gap: 12,
  },
  icon: {
    fontSize: 64,
    marginBottom: 8,
  },
  message: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.black,
    textAlign: 'center',
  },
  submessage: {
    fontSize: 14,
    color: Colors.gray,
    textAlign: 'center',
  },
  button: {
    marginTop: 8,
    paddingHorizontal: 32,
  },
});
