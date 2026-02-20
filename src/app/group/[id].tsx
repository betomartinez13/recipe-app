import { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { useGroup, useDeleteGroup } from '../../hooks/useGroups';
import { useRemoveFromGroup, useAddToGroups, useMyRecipes } from '../../hooks/useRecipes';
import { LoadingScreen } from '../../components/common/LoadingScreen';
import { Colors } from '../../constants/colors';

export default function GroupDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { data: group, isLoading, isError } = useGroup(id);
  const { mutate: deleteGroup, isPending: isDeleting } = useDeleteGroup();
  const { mutate: removeFromGroup, isPending: isRemoving } = useRemoveFromGroup();
  const { mutate: addToGroups, isPending: isAdding } = useAddToGroups();
  const { data: myRecipes } = useMyRecipes();
  const [showRecipePicker, setShowRecipePicker] = useState(false);

  const currentRecipeIds = group?.recipes?.map((r) => r.id) ?? [];
  const availableRecipes = (myRecipes ?? []).filter((r) => !currentRecipeIds.includes(r.id));

  const handleAddRecipe = (recipeId: string, recipeTitle: string) => {
    addToGroups(
      { recipeId, groupIds: [id] },
      {
        onSuccess: () => setShowRecipePicker(false),
        onError: () => Alert.alert('Error', `No se pudo agregar "${recipeTitle}" al grupo.`),
      },
    );
  };

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

  if (isLoading) return <LoadingScreen color={Colors.secondary} />;

  if (isError || !group) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorTitle}>Grupo no encontrado</Text>
        <TouchableOpacity onPress={() => router.replace('/(tabs)/groups')} style={styles.backBtn}>
          <Text style={styles.backBtnText}>Volver</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Stack.Screen
        options={{
          title: group.name,
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.replace('/(tabs)/groups')} style={styles.backBtn}>
              <Text style={styles.backBtnText}>‹ Volver</Text>
            </TouchableOpacity>
          ),
        }}
      />
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

      {/* Recipes section */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Recetas en este grupo</Text>
        <TouchableOpacity
          style={styles.addRecipeBtn}
          onPress={() => setShowRecipePicker((v) => !v)}
        >
          <Text style={styles.addRecipeBtnText}>+ Agregar</Text>
        </TouchableOpacity>
      </View>

      {/* Recipe picker */}
      {showRecipePicker && (
        <View style={styles.picker}>
          {availableRecipes.length === 0 ? (
            <View style={styles.pickerEmpty}>
              <Text style={styles.pickerEmptyText}>
                {(myRecipes ?? []).length === 0
                  ? 'No tienes recetas aun. Crea una primero.'
                  : 'Todas tus recetas ya estan en este grupo.'}
              </Text>
            </View>
          ) : (
            availableRecipes.map((recipe) => (
              <TouchableOpacity
                key={recipe.id}
                style={styles.pickerItem}
                onPress={() => handleAddRecipe(recipe.id, recipe.title)}
                disabled={isAdding}
              >
                <Text style={styles.pickerItemTitle}>{recipe.title}</Text>
                {recipe.description ? (
                  <Text style={styles.pickerItemDesc} numberOfLines={1}>
                    {recipe.description}
                  </Text>
                ) : null}
              </TouchableOpacity>
            ))
          )}
        </View>
      )}

      {/* Recipes list */}
      {!group.recipes || group.recipes.length === 0 ? (
        <View style={styles.emptyRecipes}>
          <Text style={styles.emptyText}>Este grupo no tiene recetas aun.</Text>
          <Text style={styles.emptySubtext}>
            Usa el boton "+ Agregar" para incluir recetas en este grupo.
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
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: Colors.black,
  },
  addRecipeBtn: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: Colors.secondary,
  },
  addRecipeBtnText: {
    color: Colors.white,
    fontSize: 13,
    fontWeight: '600',
  },
  picker: {
    borderRadius: 10,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: Colors.lightGray,
    marginBottom: 16,
  },
  pickerEmpty: {
    padding: 16,
    backgroundColor: Colors.white,
  },
  pickerEmptyText: {
    fontSize: 13,
    color: Colors.gray,
    fontStyle: 'italic',
    textAlign: 'center',
  },
  pickerItem: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: Colors.lightGray,
    gap: 2,
  },
  pickerItemTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.black,
  },
  pickerItemDesc: {
    fontSize: 12,
    color: Colors.gray,
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
    paddingRight: 16,
  },
  backBtnText: {
    color: Colors.secondary,
    fontSize: 16,
    fontWeight: '600',
  },
});
