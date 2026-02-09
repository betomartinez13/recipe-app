import { useState } from 'react';
import { View, Text, Alert, StyleSheet, ScrollView } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuth } from '../../hooks/useAuth';
import { useAuthStore } from '../../store/auth.store';
import { userService } from '../../services/user.service';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Modal } from '../../components/ui/Modal';
import {
  updateProfileSchema,
  UpdateProfileFormData,
} from '../../utils/validation';
import { Colors } from '../../constants/colors';
import { AxiosError } from 'axios';
import { ApiError } from '../../types/api.types';

export default function ProfileScreen() {
  const { user, logout } = useAuth();
  const { updateUser, clearAuth } = useAuthStore();
  const [editVisible, setEditVisible] = useState(false);
  const [editLoading, setEditLoading] = useState(false);
  const [editError, setEditError] = useState('');
  const [deleteLoading, setDeleteLoading] = useState(false);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<UpdateProfileFormData>({
    resolver: zodResolver(updateProfileSchema),
    defaultValues: {
      name: user?.name ?? '',
      email: user?.email ?? '',
    },
  });

  const openEdit = () => {
    reset({ name: user?.name ?? '', email: user?.email ?? '' });
    setEditError('');
    setEditVisible(true);
  };

  const onEditSubmit = async (data: UpdateProfileFormData) => {
    setEditError('');
    setEditLoading(true);
    try {
      const updated = await userService.updateProfile(data);
      updateUser(updated);
      setEditVisible(false);
    } catch (err) {
      const error = err as AxiosError<ApiError>;
      if (error.response?.status === 409) {
        setEditError('Este email ya esta en uso');
      } else {
        setEditError('Error de conexion. Intenta de nuevo.');
      }
    } finally {
      setEditLoading(false);
    }
  };

  const handleLogout = () => {
    Alert.alert('Cerrar sesion', 'Deseas cerrar sesion?', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Cerrar sesion', onPress: () => logout() },
    ]);
  };

  const handleDelete = () => {
    Alert.alert(
      'Eliminar cuenta',
      'Esta accion es irreversible. Se eliminaran tu cuenta, recetas y grupos. Deseas continuar?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: async () => {
            setDeleteLoading(true);
            try {
              await userService.deleteAccount();
            } catch {
              // If it fails, still clear locally
            }
            await require('../../utils/storage').storage.removeToken();
            clearAuth();
          },
        },
      ],
    );
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
    >
      <View style={styles.card}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>
            {user?.name?.charAt(0)?.toUpperCase() ?? '?'}
          </Text>
        </View>
        <Text style={styles.name}>{user?.name}</Text>
        <Text style={styles.email}>{user?.email}</Text>
        <Text style={styles.date}>
          Miembro desde {user?.createdAt ? formatDate(user.createdAt) : '---'}
        </Text>
      </View>

      <View style={styles.actions}>
        <Button
          title="Editar perfil"
          onPress={openEdit}
          variant="secondary"
          style={styles.actionButton}
        />
        <Button
          title="Cerrar sesion"
          onPress={handleLogout}
          variant="secondary"
          style={styles.actionButton}
        />
        <Button
          title="Eliminar cuenta"
          onPress={handleDelete}
          variant="danger"
          loading={deleteLoading}
          style={styles.actionButton}
        />
      </View>

      <Modal
        visible={editVisible}
        onClose={() => setEditVisible(false)}
        title="Editar perfil"
      >
        <Controller
          control={control}
          name="name"
          render={({ field: { onChange, onBlur, value } }) => (
            <Input
              label="Nombre"
              placeholder="Tu nombre"
              autoCapitalize="words"
              onChangeText={onChange}
              onBlur={onBlur}
              value={value}
              error={errors.name?.message}
            />
          )}
        />

        <Controller
          control={control}
          name="email"
          render={({ field: { onChange, onBlur, value } }) => (
            <Input
              label="Email"
              placeholder="tu@email.com"
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              onChangeText={onChange}
              onBlur={onBlur}
              value={value}
              error={errors.email?.message}
            />
          )}
        />

        {editError ? <Text style={styles.editError}>{editError}</Text> : null}

        <Button
          title="Guardar cambios"
          onPress={handleSubmit(onEditSubmit)}
          loading={editLoading}
        />
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    padding: 24,
  },
  card: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: 24,
    alignItems: 'center',
    marginBottom: 24,
  },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  avatarText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: Colors.white,
  },
  name: {
    fontSize: 22,
    fontWeight: 'bold',
    color: Colors.black,
  },
  email: {
    fontSize: 16,
    color: Colors.gray,
    marginTop: 4,
  },
  date: {
    fontSize: 14,
    color: Colors.gray,
    marginTop: 8,
  },
  actions: {
    gap: 12,
  },
  actionButton: {
    marginBottom: 0,
  },
  editError: {
    color: Colors.error,
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 12,
  },
});
