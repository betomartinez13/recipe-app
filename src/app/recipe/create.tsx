import { View, ScrollView, Text, Alert, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { createRecipeSchema, CreateRecipeFormData } from '../../utils/validation';
import { useCreateRecipe, useMyRecipes } from '../../hooks/useRecipes';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { IngredientInput } from '../../components/recipes/IngredientInput';
import { StepInput } from '../../components/recipes/StepInput';
import { GroupSelector } from '../../components/groups/GroupSelector';
import { Colors } from '../../constants/colors';

export default function CreateRecipeScreen() {
  const router = useRouter();
  const { mutate: createRecipe, isPending } = useCreateRecipe();
  const { data: myRecipes } = useMyRecipes();

  const {
    control,
    handleSubmit,
    setError,
    watch,
    setValue,
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

  const groupIds = watch('groupIds') ?? [];

  const onSubmit = (data: CreateRecipeFormData) => {
    const duplicate = (myRecipes ?? []).find(
      (r) => r.title.trim().toLowerCase() === data.title.trim().toLowerCase(),
    );
    if (duplicate) {
      setError('title', { message: 'Ya tienes una receta con ese nombre' });
      return;
    }

    const payload = {
      ...data,
      ingredients: data.ingredients.map((ing, i) => ({ ...ing, order: i + 1 })),
      steps: data.steps.map((step, i) => ({ ...step, order: i + 1 })),
    };

    createRecipe(payload, {
      onSuccess: (recipe) => router.replace(`/recipe/${recipe.id}`),
      onError: (err: any) => {
        const status = err?.response?.status;
        if (status === 409) {
          setError('title', { message: 'Ya existe una receta con ese nombre' });
        } else {
          Alert.alert('Error', 'No se pudo crear la receta. Intenta de nuevo.');
        }
      },
    });
  };

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
            maxLength={300}
            showCounter
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
            maxLength={300}
            showCounter
          />
        )}
      />

      <IngredientInput control={control} errors={errors} />
      <StepInput control={control} errors={errors} />

      <GroupSelector
        selectedIds={groupIds}
        onChange={(ids) => setValue('groupIds', ids)}
      />

      <View style={styles.footer}>
        <Button
          title="Guardar receta"
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
  footer: {
    gap: 12,
    marginTop: 8,
  },
});
