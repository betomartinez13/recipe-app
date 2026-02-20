import { useEffect } from 'react';
import { View, ScrollView, Alert, ActivityIndicator, StyleSheet } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { createGroupSchema, CreateGroupFormData } from '../../../utils/validation';
import { useGroup, useUpdateGroup } from '../../../hooks/useGroups';
import { Input } from '../../../components/ui/Input';
import { Button } from '../../../components/ui/Button';
import { Colors } from '../../../constants/colors';

export default function EditGroupScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { data: group, isLoading } = useGroup(id);
  const { mutate: updateGroup, isPending } = useUpdateGroup();

  const {
    control,
    handleSubmit,
    setError,
    reset,
    formState: { errors },
  } = useForm<CreateGroupFormData>({
    resolver: zodResolver(createGroupSchema),
    defaultValues: { name: '', description: '' },
  });

  useEffect(() => {
    if (group) {
      reset({ name: group.name, description: group.description ?? '' });
    }
  }, [group, reset]);

  const onSubmit = (data: CreateGroupFormData) => {
    updateGroup(
      { id, data },
      {
        onSuccess: () => router.replace(`/group/${id}`),
        onError: (err: any) => {
          if (err?.response?.status === 409) {
            setError('name', { message: 'Ya tienes un grupo con ese nombre' });
          } else {
            Alert.alert('Error', 'No se pudo actualizar el grupo. Intenta de nuevo.');
          }
        },
      },
    );
  };

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={Colors.secondary} />
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
        name="name"
        render={({ field: { value, onChange, onBlur } }) => (
          <Input
            label="Nombre *"
            placeholder="Nombre del grupo"
            value={value}
            onChangeText={onChange}
            onBlur={onBlur}
            error={errors.name?.message}
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

      <View style={styles.footer}>
        <Button
          title="Guardar cambios"
          onPress={handleSubmit(onSubmit)}
          loading={isPending}
        />
        <Button
          title="Cancelar"
          variant="secondary"
          onPress={() => router.replace(`/group/${id}`)}
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
