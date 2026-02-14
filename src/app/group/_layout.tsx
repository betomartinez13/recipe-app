import { Stack } from 'expo-router';
import { Colors } from '../../constants/colors';

export default function GroupLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: Colors.white },
        headerTintColor: Colors.secondary,
        headerTitleStyle: { fontWeight: '600', color: Colors.black },
        headerBackTitle: 'Volver',
      }}
    >
      <Stack.Screen name="[id]" options={{ title: 'Detalle del Grupo' }} />
      <Stack.Screen name="create" options={{ title: 'Nuevo Grupo' }} />
      <Stack.Screen name="edit/[id]" options={{ title: 'Editar Grupo' }} />
    </Stack>
  );
}
