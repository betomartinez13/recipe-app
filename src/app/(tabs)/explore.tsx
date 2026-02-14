import { View, FlatList, RefreshControl, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useAllRecipes } from '../../hooks/useRecipes';
import { RecipeCard } from '../../components/recipes/RecipeCard';
import { EmptyState } from '../../components/common/EmptyState';
import { LoadingScreen } from '../../components/common/LoadingScreen';
import { ErrorScreen } from '../../components/common/ErrorScreen';
import { Colors } from '../../constants/colors';

export default function ExploreScreen() {
  const router = useRouter();
  const { data: recipes, isLoading, isError, isRefetching, refetch } = useAllRecipes();

  if (isLoading) return <LoadingScreen />;
  if (isError) return <ErrorScreen message="Error al cargar recetas" onRetry={refetch} />;

  return (
    <View style={styles.container}>
      {!recipes || recipes.length === 0 ? (
        <EmptyState message="No hay recetas aun" submessage="Se el primero en crear una!" />
      ) : (
        <FlatList
          data={recipes}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <RecipeCard
              recipe={item}
              showAuthor
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
  },
});
