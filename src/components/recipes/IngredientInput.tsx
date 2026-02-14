import { View, Text, TouchableOpacity, TextInput, StyleSheet } from 'react-native';
import { Control, useFieldArray, Controller, FieldErrors } from 'react-hook-form';
import { CreateRecipeFormData } from '../../utils/validation';
import { Colors } from '../../constants/colors';

interface IngredientInputProps {
  control: Control<CreateRecipeFormData>;
  errors: FieldErrors<CreateRecipeFormData>;
}

export function IngredientInput({ control, errors }: IngredientInputProps) {
  const { fields, append, remove } = useFieldArray({ control, name: 'ingredients' });

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Ingredientes *</Text>
      {fields.map((field, index) => (
        <View key={field.id} style={styles.row}>
          <View style={styles.fields}>
            <Controller
              control={control}
              name={`ingredients.${index}.name`}
              render={({ field: { value, onChange, onBlur } }) => (
                <TextInput
                  style={[
                    styles.input,
                    styles.inputName,
                    errors.ingredients?.[index]?.name && styles.inputError,
                  ]}
                  placeholder="Nombre"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                />
              )}
            />
            <Controller
              control={control}
              name={`ingredients.${index}.quantity`}
              render={({ field: { value, onChange, onBlur } }) => (
                <TextInput
                  style={[
                    styles.input,
                    styles.inputQty,
                    errors.ingredients?.[index]?.quantity && styles.inputError,
                  ]}
                  placeholder="Cant."
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                />
              )}
            />
            <Controller
              control={control}
              name={`ingredients.${index}.unit`}
              render={({ field: { value, onChange, onBlur } }) => (
                <TextInput
                  style={[styles.input, styles.inputUnit]}
                  placeholder="Unidad"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                />
              )}
            />
          </View>
          <TouchableOpacity style={styles.removeBtn} onPress={() => remove(index)}>
            <Text style={styles.removeBtnText}>✕</Text>
          </TouchableOpacity>
        </View>
      ))}
      {typeof errors.ingredients?.message === 'string' && (
        <Text style={styles.errorText}>{errors.ingredients.message}</Text>
      )}
      <TouchableOpacity
        style={styles.addBtn}
        onPress={() => append({ name: '', quantity: '', unit: '' })}
      >
        <Text style={styles.addBtnText}>+ Agregar ingrediente</Text>
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
    alignItems: 'center',
    marginBottom: 8,
    gap: 6,
  },
  fields: {
    flex: 1,
    flexDirection: 'row',
    gap: 6,
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
  },
  inputName: {
    flex: 2,
  },
  inputQty: {
    flex: 1,
  },
  inputUnit: {
    flex: 1,
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
