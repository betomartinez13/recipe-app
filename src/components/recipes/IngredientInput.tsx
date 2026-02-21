import { View, Text, TouchableOpacity, TextInput, StyleSheet } from 'react-native';
import { Control, useFieldArray, Controller, FieldErrors } from 'react-hook-form';
import { CreateRecipeFormData } from '../../utils/validation';
import { Colors } from '../../constants/colors';

const UNITS = ['kg', 'g', 'L', 'ml'];

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
        <View key={field.id} style={styles.ingredientBlock}>
          {/* Row 1: name + quantity + remove */}
          <View style={styles.row}>
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
                  keyboardType="numeric"
                />
              )}
            />
            <TouchableOpacity style={styles.removeBtn} onPress={() => remove(index)}>
              <Text style={styles.removeBtnText}>✕</Text>
            </TouchableOpacity>
          </View>

          {/* Row 2: unit selector */}
          <Controller
            control={control}
            name={`ingredients.${index}.unit`}
            render={({ field: { value, onChange } }) => (
              <View style={styles.unitRow}>
                {UNITS.map((unit) => (
                  <TouchableOpacity
                    key={unit}
                    style={[styles.unitBtn, value === unit && styles.unitBtnSelected]}
                    onPress={() => onChange(unit)}
                  >
                    <Text style={[styles.unitBtnText, value === unit && styles.unitBtnTextSelected]}>
                      {unit}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          />
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
  ingredientBlock: {
    marginBottom: 10,
    backgroundColor: Colors.white,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Colors.lightGray,
    padding: 10,
    gap: 8,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
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
    backgroundColor: Colors.background,
  },
  inputName: {
    flex: 2,
  },
  inputQty: {
    flex: 1,
  },
  inputError: {
    borderColor: Colors.error,
  },
  unitRow: {
    flexDirection: 'row',
    gap: 6,
  },
  unitBtn: {
    flex: 1,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.lightGray,
    alignItems: 'center',
    backgroundColor: Colors.background,
  },
  unitBtnSelected: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  unitBtnText: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.gray,
  },
  unitBtnTextSelected: {
    color: Colors.white,
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
