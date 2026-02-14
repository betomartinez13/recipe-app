import { Stack } from 'expo-router';
import { Colors } from '../../constants/colors';

export default function RecipeLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: Colors.white },
        headerTintColor: Colors.primary,
        headerTitleStyle: { fontWeight: '600', color: Colors.black },
        headerBackTitle: 'Volver',
      }}
    >
      <Stack.Screen name="[id]" options={{ title: 'Detalle' }} />
      <Stack.Screen name="create" options={{ title: 'Nueva Receta' }} />
      <Stack.Screen name="edit/[id]" options={{ title: 'Editar Receta' }} />
    </Stack>
  );
}
