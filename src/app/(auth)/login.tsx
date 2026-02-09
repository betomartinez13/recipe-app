import { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { useAuth } from '../../hooks/useAuth';
import { useAuthStore } from '../../store/auth.store';
import { loginSchema, LoginFormData } from '../../utils/validation';
import { Colors } from '../../constants/colors';
import { AxiosError } from 'axios';
import { ApiError } from '../../types/api.types';

export default function LoginScreen() {
  const router = useRouter();
  const { login } = useAuth();
  const [apiError, setApiError] = useState('');
  const [loading, setLoading] = useState(false);

  const devLogin = () => {
    const { setAuth } = useAuthStore.getState();
    setAuth(
      {
        id: 'mock-123',
        name: 'Alberto',
        email: 'alberto@test.com',
        createdAt: '2026-01-15T00:00:00.000Z',
      },
      'mock-token-dev',
    );
  };

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  });

  const onSubmit = async (data: LoginFormData) => {
    setApiError('');
    setLoading(true);
    try {
      await login(data);
    } catch (err) {
      const error = err as AxiosError<ApiError>;
      if (error.response?.status === 401) {
        setApiError('Credenciales incorrectas');
      } else {
        setApiError('Error de conexion. Intenta de nuevo.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        contentContainerStyle={styles.scroll}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.header}>
          <Text style={styles.title}>Recetario</Text>
          <Text style={styles.subtitle}>Inicia sesion en tu cuenta</Text>
        </View>

        <View style={styles.form}>
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

          <Controller
            control={control}
            name="password"
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                label="Password"
                placeholder="Tu password"
                secureTextEntry
                onChangeText={onChange}
                onBlur={onBlur}
                value={value}
                error={errors.password?.message}
              />
            )}
          />

          {apiError ? <Text style={styles.apiError}>{apiError}</Text> : null}

          <Button
            title="Iniciar sesion"
            onPress={handleSubmit(onSubmit)}
            loading={loading}
            style={styles.button}
          />
        </View>

        <TouchableOpacity
          onPress={() => router.push('/(auth)/register')}
          style={styles.link}
        >
          <Text style={styles.linkText}>
            No tienes cuenta? <Text style={styles.linkBold}>Registrate</Text>
          </Text>
        </TouchableOpacity>

        {__DEV__ && (
          <TouchableOpacity onPress={devLogin} style={styles.devButton}>
            <Text style={styles.devButtonText}>Dev: Saltar login</Text>
          </TouchableOpacity>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scroll: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 24,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: Colors.primary,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.gray,
    marginTop: 8,
  },
  form: {
    marginBottom: 24,
  },
  apiError: {
    color: Colors.error,
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 12,
  },
  button: {
    marginTop: 8,
  },
  link: {
    alignItems: 'center',
  },
  linkText: {
    fontSize: 14,
    color: Colors.gray,
  },
  linkBold: {
    color: Colors.primary,
    fontWeight: '600',
  },
  devButton: {
    marginTop: 24,
    alignItems: 'center',
    padding: 12,
    borderWidth: 1,
    borderColor: Colors.gray,
    borderRadius: 8,
    borderStyle: 'dashed',
  },
  devButtonText: {
    color: Colors.gray,
    fontSize: 14,
  },
});
