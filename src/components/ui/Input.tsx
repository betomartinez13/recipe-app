import {
  View,
  Text,
  TextInput,
  TextInputProps,
  StyleSheet,
} from 'react-native';
import { Colors } from '../../constants/colors';

interface InputProps extends TextInputProps {
  label: string;
  error?: string;
  showCounter?: boolean;
}

export function Input({ label, error, style, showCounter, maxLength, value, ...props }: InputProps) {
  const current = value?.length ?? 0;
  const nearLimit = maxLength != null && current >= maxLength * 0.85;

  return (
    <View style={styles.container}>
      <View style={styles.labelRow}>
        <Text style={styles.label}>{label}</Text>
        {showCounter && maxLength != null && (
          <Text style={[styles.counter, nearLimit && styles.counterNear]}>
            {current}/{maxLength}
          </Text>
        )}
      </View>
      <TextInput
        style={[styles.input, error && styles.inputError, style]}
        placeholderTextColor={Colors.gray}
        maxLength={maxLength}
        value={value}
        {...props}
      />
      {error && <Text style={styles.error}>{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  labelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.black,
  },
  counter: {
    fontSize: 11,
    color: Colors.gray,
  },
  counterNear: {
    color: Colors.error,
  },
  input: {
    borderWidth: 1,
    borderColor: Colors.lightGray,
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 16,
    color: Colors.black,
    backgroundColor: Colors.white,
  },
  inputError: {
    borderColor: Colors.error,
  },
  error: {
    fontSize: 12,
    color: Colors.error,
    marginTop: 4,
  },
});
