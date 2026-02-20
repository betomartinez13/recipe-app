import { View, ScrollView, Alert, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { createGroupSchema, CreateGroupFormData } from '../../utils/validation';
import { useCreateGroup } from '../../hooks/useGroups';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { Colors } from '../../constants/colors';

export default function CreateGroupScreen() {
  const router = useRouter();
  const { mutate: createGroup, isPending } = useCreateGroup();

  const {
    control,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<CreateGroupFormData>({
    resolver: zodResolver(createGroupSchema),
    defaultValues: { name: '', description: '' },
  });

  const onSubmit = (data: CreateGroupFormData) => {
    createGroup(data, {
      onSuccess: (group) => router.replace(`/group/${group.id}`),
      onError: (err: any) => {
        if (err?.response?.status === 409) {
          setError('name', { message: 'Ya tienes un grupo con ese nombre' });
        } else {
          Alert.alert('Error', 'No se pudo crear el grupo. Intenta de nuevo.');
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
          title="Crear grupo"
          onPress={handleSubmit(onSubmit)}
          loading={isPending}
        />
        <Button
          title="Cancelar"
          variant="secondary"
          onPress={() => router.replace('/(tabs)/groups')}
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
