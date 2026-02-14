import { View, FlatList, TouchableOpacity, Text, RefreshControl, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useMyRecipes } from '../../hooks/useRecipes';
import { RecipeCard } from '../../components/recipes/RecipeCard';
import { EmptyState } from '../../components/common/EmptyState';
import { LoadingScreen } from '../../components/common/LoadingScreen';
import { ErrorScreen } from '../../components/common/ErrorScreen';
import { Colors } from '../../constants/colors';

export default function MisRecetasScreen() {
  const router = useRouter();
  const { data: recipes, isLoading, isError, isRefetching, refetch } = useMyRecipes();

  if (isLoading) return <LoadingScreen />;
  if (isError) return <ErrorScreen message="Error al cargar recetas" onRetry={refetch} />;

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
          refreshControl={
            <RefreshControl
              refreshing={isRefetching}
              onRefresh={refetch}
              tintColor={Colors.primary}
              colors={[Colors.primary]}
            />
          }
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
  list: {
    paddingVertical: 12,
    paddingBottom: 80,
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
