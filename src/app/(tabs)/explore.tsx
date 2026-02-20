import { useState, useMemo } from 'react';
import { View, TextInput, FlatList, RefreshControl, StyleSheet } from 'react-native';
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
  const [query, setQuery] = useState('');

  const filtered = useMemo(() => {
    if (!recipes) return [];
    if (!query.trim()) return recipes;
    const q = query.trim().toLowerCase();
    return recipes.filter((r) => r.title.toLowerCase().includes(q));
  }, [recipes, query]);

  if (isLoading) return <LoadingScreen />;
  if (isError) return <ErrorScreen message="Error al cargar recetas" onRetry={refetch} />;

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar recetas..."
          placeholderTextColor={Colors.gray}
          value={query}
          onChangeText={setQuery}
          autoCorrect={false}
          clearButtonMode="while-editing"
        />
      </View>

      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <RecipeCard
            recipe={item}
            showAuthor
            onPress={() => router.push(`/recipe/${item.id}`)}
          />
        )}
        contentContainerStyle={[
          styles.list,
          filtered.length === 0 && styles.listEmpty,
        ]}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        ListEmptyComponent={
          <EmptyState
            message={query.trim() ? 'Sin resultados' : 'No hay recetas aun'}
            submessage={
              query.trim()
                ? `No se encontraron recetas con "${query.trim()}"`
                : 'Se el primero en crear una!'
            }
          />
        }
        refreshControl={
          <RefreshControl
            refreshing={isRefetching}
            onRefresh={refetch}
            tintColor={Colors.primary}
            colors={[Colors.primary]}
          />
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  searchContainer: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: Colors.lightGray,
  },
  searchInput: {
    backgroundColor: Colors.background,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 9,
    fontSize: 15,
    color: Colors.black,
  },
  list: {
    paddingVertical: 12,
  },
  listEmpty: {
    flexGrow: 1,
  },
});
