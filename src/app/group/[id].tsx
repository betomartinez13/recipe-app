import { View, Text, ScrollView, TouchableOpacity, Alert, ActivityIndicator, StyleSheet } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useGroup, useDeleteGroup } from '../../hooks/useGroups';
import { useRemoveFromGroup } from '../../hooks/useRecipes';
import { Colors } from '../../constants/colors';

export default function GroupDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { data: group, isLoading, isError } = useGroup(id);
  const { mutate: deleteGroup, isPending: isDeleting } = useDeleteGroup();
  const { mutate: removeFromGroup, isPending: isRemoving } = useRemoveFromGroup();

  const handleRemoveRecipe = (recipeId: string, recipeTitle: string) => {
    Alert.alert(
      'Quitar receta',
      `Quitar "${recipeTitle}" de este grupo?\n\nLa receta NO se eliminara, solo se quitara del grupo.`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Quitar',
          onPress: () => {
            removeFromGroup(
              { recipeId, groupId: id },
              {
                onError: () =>
                  Alert.alert('Error', 'No se pudo quitar la receta. Intenta de nuevo.'),
              },
            );
          },
        },
      ],
    );
  };

  const handleDeleteGroup = () => {
    const recipeCount = group?.recipes?.length ?? group?.recipeCount ?? 0;
    const recipeMsg =
      recipeCount > 0
        ? `Al eliminar este grupo, se eliminaran ${recipeCount} receta${recipeCount > 1 ? 's' : ''} que pertenecen solo a este grupo.\n\nEsta accion es irreversible.`
        : 'Este grupo no tiene recetas. Se eliminara permanentemente.';

    Alert.alert('Eliminar grupo', recipeMsg, [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Eliminar',
        style: 'destructive',
        onPress: () => {
          deleteGroup(id, {
            onSuccess: () => router.back(),
            onError: () =>
              Alert.alert('Error', 'No se pudo eliminar el grupo. Intenta de nuevo.'),
          });
        },
      },
    ]);
  };

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={Colors.secondary} />
      </View>
    );
  }

  if (isError || !group) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorTitle}>Grupo no encontrado</Text>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Text style={styles.backBtnText}>Volver</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Header info */}
      <View style={styles.header}>
        <Text style={styles.title}>{group.name}</Text>
        {group.description ? (
          <Text style={styles.description}>{group.description}</Text>
        ) : null}
        <View style={styles.badge}>
          <Text style={styles.badgeText}>
            {group.recipes?.length ?? group.recipeCount ?? 0} recetas
          </Text>
        </View>
      </View>

      {/* Edit / Delete buttons */}
      <View style={styles.actions}>
        <TouchableOpacity
          style={styles.editBtn}
          onPress={() => router.push(`/group/edit/${id}`)}
        >
          <Text style={styles.editBtnText}>Editar grupo</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.deleteBtn}
          onPress={handleDeleteGroup}
          disabled={isDeleting}
        >
          <Text style={styles.deleteBtnText}>
            {isDeleting ? 'Eliminando...' : 'Eliminar grupo'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Recipes list */}
      <Text style={styles.sectionTitle}>Recetas en este grupo</Text>

      {!group.recipes || group.recipes.length === 0 ? (
        <View style={styles.emptyRecipes}>
          <Text style={styles.emptyText}>Este grupo no tiene recetas aun.</Text>
          <Text style={styles.emptySubtext}>
            Agrega recetas desde la pantalla de crear/editar receta.
          </Text>
        </View>
      ) : (
        group.recipes.map((recipe) => (
          <View key={recipe.id} style={styles.recipeRow}>
            <TouchableOpacity
              style={styles.recipeInfo}
              onPress={() => router.push(`/recipe/${recipe.id}`)}
              activeOpacity={0.7}
            >
              <Text style={styles.recipeTitle}>{recipe.title}</Text>
              {recipe.description ? (
                <Text style={styles.recipeDesc} numberOfLines={1}>
                  {recipe.description}
                </Text>
              ) : null}
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.removeBtn}
              onPress={() => handleRemoveRecipe(recipe.id, recipe.title)}
              disabled={isRemoving}
            >
              <Text style={styles.removeBtnText}>✕</Text>
            </TouchableOpacity>
          </View>
        ))
      )}
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
  header: {
    marginBottom: 20,
    gap: 6,
  },
  title: {
    fontSize: 26,
    fontWeight: '800',
    color: Colors.black,
  },
  description: {
    fontSize: 15,
    color: Colors.gray,
    lineHeight: 22,
  },
  badge: {
    alignSelf: 'flex-start',
    backgroundColor: Colors.secondary,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
    marginTop: 4,
  },
  badgeText: {
    color: Colors.white,
    fontSize: 12,
    fontWeight: '600',
  },
  actions: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 28,
  },
  editBtn: {
    flex: 1,
    backgroundColor: Colors.secondary,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  editBtnText: {
    color: Colors.white,
    fontSize: 14,
    fontWeight: '600',
  },
  deleteBtn: {
    flex: 1,
    backgroundColor: Colors.error,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  deleteBtnText: {
    color: Colors.white,
    fontSize: 14,
    fontWeight: '600',
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: Colors.black,
    marginBottom: 12,
  },
  emptyRecipes: {
    padding: 20,
    backgroundColor: Colors.white,
    borderRadius: 12,
    alignItems: 'center',
    gap: 6,
  },
  emptyText: {
    fontSize: 14,
    color: Colors.gray,
    textAlign: 'center',
  },
  emptySubtext: {
    fontSize: 12,
    color: Colors.lightGray,
    textAlign: 'center',
  },
  recipeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius: 10,
    padding: 14,
    marginBottom: 8,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 3,
    elevation: 1,
    gap: 10,
  },
  recipeInfo: {
    flex: 1,
    gap: 2,
  },
  recipeTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.black,
  },
  recipeDesc: {
    fontSize: 12,
    color: Colors.gray,
  },
  removeBtn: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: Colors.error,
    alignItems: 'center',
    justifyContent: 'center',
  },
  removeBtnText: {
    color: Colors.white,
    fontSize: 12,
    fontWeight: '700',
  },
  errorTitle: {
    fontSize: 18,
    color: Colors.gray,
    marginBottom: 16,
  },
  backBtn: {
    paddingVertical: 10,
    paddingHorizontal: 24,
    backgroundColor: Colors.secondary,
    borderRadius: 8,
  },
  backBtnText: {
    color: Colors.white,
    fontWeight: '600',
  },
});
