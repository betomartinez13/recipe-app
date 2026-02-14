import { View, FlatList, TouchableOpacity, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useMyRecipes } from '../../hooks/useRecipes';
import { RecipeCard } from '../../components/recipes/RecipeCard';
import { EmptyState } from '../../components/common/EmptyState';
import { Colors } from '../../constants/colors';

export default function MisRecetasScreen() {
  const router = useRouter();
  const { data: recipes, isLoading, isError, refetch } = useMyRecipes();

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  if (isError) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>Error al cargar recetas</Text>
        <TouchableOpacity onPress={() => refetch()} style={styles.retryBtn}>
          <Text style={styles.retryText}>Reintentar</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {!recipes || recipes.length === 0 ? (
        <EmptyState
          message="No tienes recetas aun"
          submessage="Crea tu primera receta!"
          actionLabel="Crear receta"
          onAction={() => router.push('/recipe/create')}
        />
      ) : (
        <FlatList
          data={recipes}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <RecipeCard
              recipe={item}
              onPress={() => router.push(`/recipe/${item.id}`)}
            />
          )}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
        />
      )}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => router.push('/recipe/create')}
        activeOpacity={0.8}
      >
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.background,
  },
  list: {
    paddingVertical: 12,
    paddingBottom: 80,
  },
  errorText: {
    color: Colors.gray,
    fontSize: 16,
    marginBottom: 12,
  },
  retryBtn: {
    paddingVertical: 10,
    paddingHorizontal: 24,
    backgroundColor: Colors.primary,
    borderRadius: 8,
  },
  retryText: {
    color: Colors.white,
    fontWeight: '600',
  },
  fab: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
  fabText: {
    color: Colors.white,
    fontSize: 28,
    fontWeight: '300',
    lineHeight: 32,
  },
});
