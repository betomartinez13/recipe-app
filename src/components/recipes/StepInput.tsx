import { View, Text, TouchableOpacity, TextInput, StyleSheet } from 'react-native';
import { Control, useFieldArray, Controller, FieldErrors } from 'react-hook-form';
import { CreateRecipeFormData } from '../../utils/validation';
import { Colors } from '../../constants/colors';

interface StepInputProps {
  control: Control<CreateRecipeFormData>;
  errors: FieldErrors<CreateRecipeFormData>;
}

export function StepInput({ control, errors }: StepInputProps) {
  const { fields, append, remove } = useFieldArray({ control, name: 'steps' });

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Pasos *</Text>
      {fields.map((field, index) => (
        <View key={field.id} style={styles.row}>
          <View style={styles.stepNumber}>
            <Text style={styles.stepNumberText}>{index + 1}</Text>
          </View>
          <Controller
            control={control}
            name={`steps.${index}.description`}
            render={({ field: { value, onChange, onBlur } }) => (
              <View style={styles.inputWrapper}>
                <TextInput
                  style={[
                    styles.input,
                    errors.steps?.[index]?.description && styles.inputError,
                  ]}
                  placeholder={`Describe el paso ${index + 1}...`}
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  multiline
                  numberOfLines={2}
                  textAlignVertical="top"
                  maxLength={300}
                />
                <Text style={[
                  styles.counter,
                  (value?.length ?? 0) >= 255 && styles.counterNear,
                ]}>
                  {value?.length ?? 0}/300
                </Text>
              </View>
            )}
          />
          <TouchableOpacity style={styles.removeBtn} onPress={() => remove(index)}>
            <Text style={styles.removeBtnText}>✕</Text>
          </TouchableOpacity>
        </View>
      ))}
      {typeof errors.steps?.message === 'string' && (
        <Text style={styles.errorText}>{errors.steps.message}</Text>
      )}
      <TouchableOpacity
        style={styles.addBtn}
        onPress={() => append({ description: '' })}
      >
        <Text style={styles.addBtnText}>+ Agregar paso</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.black,
    marginBottom: 8,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 10,
    gap: 8,
  },
  stepNumber: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
  },
  stepNumberText: {
    color: Colors.white,
    fontSize: 13,
    fontWeight: '700',
  },
  inputWrapper: {
    flex: 1,
  },
  input: {
    borderWidth: 1,
    borderColor: Colors.lightGray,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
    fontSize: 13,
    color: Colors.black,
    backgroundColor: Colors.white,
    minHeight: 44,
  },
  counter: {
    fontSize: 11,
    color: Colors.gray,
    textAlign: 'right',
    marginTop: 2,
  },
  counterNear: {
    color: Colors.error,
  },
  inputError: {
    borderColor: Colors.error,
  },
  removeBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.error,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 6,
  },
  removeBtnText: {
    color: Colors.white,
    fontSize: 12,
    fontWeight: '700',
  },
  addBtn: {
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: Colors.primary,
    borderRadius: 8,
    borderStyle: 'dashed',
    alignItems: 'center',
    marginTop: 4,
  },
  addBtnText: {
    color: Colors.primary,
    fontSize: 14,
    fontWeight: '600',
  },
  errorText: {
    color: Colors.error,
    fontSize: 12,
    marginBottom: 4,
  },
});
