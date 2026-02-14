import { useEffect } from 'react';
import { View, ScrollView, Alert, ActivityIndicator, StyleSheet } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { createRecipeSchema, CreateRecipeFormData } from '../../../utils/validation';
import { useRecipe, useUpdateRecipe } from '../../../hooks/useRecipes';
import { Input } from '../../../components/ui/Input';
import { Button } from '../../../components/ui/Button';
import { IngredientInput } from '../../../components/recipes/IngredientInput';
import { StepInput } from '../../../components/recipes/StepInput';
import { Colors } from '../../../constants/colors';

export default function EditRecipeScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { data: recipe, isLoading } = useRecipe(id);
  const { mutate: updateRecipe, isPending } = useUpdateRecipe();

  const {
    control,
    handleSubmit,
    setError,
    reset,
    formState: { errors },
  } = useForm<CreateRecipeFormData>({
    resolver: zodResolver(createRecipeSchema),
    defaultValues: {
      title: '',
      description: '',
      ingredients: [{ name: '', quantity: '', unit: '' }],
      steps: [{ description: '' }],
      groupIds: [],
    },
  });

  useEffect(() => {
    if (recipe) {
      reset({
        title: recipe.title,
        description: recipe.description ?? '',
        ingredients: recipe.ingredients.map((ing) => ({
          name: ing.name,
          quantity: ing.quantity,
          unit: ing.unit ?? '',
        })),
        steps: recipe.steps.map((s) => ({ description: s.description })),
        groupIds: recipe.groups?.map((g) => g.group.id) ?? [],
      });
    }
  }, [recipe, reset]);

  const onSubmit = (data: CreateRecipeFormData) => {
    const payload = {
      ...data,
      ingredients: data.ingredients.map((ing, i) => ({ ...ing, order: i + 1 })),
      steps: data.steps.map((step, i) => ({ ...step, order: i + 1 })),
    };

    updateRecipe(
      { id, data: payload },
      {
        onSuccess: () => router.back(),
        onError: (err: any) => {
          const status = err?.response?.status;
          if (status === 409) {
            setError('title', { message: 'Ya existe una receta con ese nombre' });
          } else {
            Alert.alert('Error', 'No se pudo actualizar la receta. Intenta de nuevo.');
          }
        },
      },
    );
  };

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      keyboardShouldPersistTaps="handled"
    >
      <Controller
        control={control}
        name="title"
        render={({ field: { value, onChange, onBlur } }) => (
          <Input
            label="Titulo *"
            placeholder="Nombre de la receta"
            value={value}
            onChangeText={onChange}
            onBlur={onBlur}
            error={errors.title?.message}
          />
        )}
      />

      <Controller
        control={control}
        name="description"
        render={({ field: { value, onChange, onBlur } }) => (
          <Input
            label="Descripcion"
            placeholder="Descripcion breve (opcional)"
            value={value}
            onChangeText={onChange}
            onBlur={onBlur}
            multiline
            numberOfLines={3}
          />
        )}
      />

      <IngredientInput control={control} errors={errors} />
      <StepInput control={control} errors={errors} />

      <View style={styles.footer}>
        <Button
          title="Guardar cambios"
          onPress={handleSubmit(onSubmit)}
          loading={isPending}
        />
        <Button
          title="Cancelar"
          variant="secondary"
          onPress={() => router.back()}
          disabled={isPending}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.background,
  },
  footer: {
    gap: 12,
    marginTop: 8,
  },
});
